'use strict';

let {Sequelize, sequelize} = require('../service/db');

exports.creator = async (req, res) => {
    try {
        const creatorId = req.query.creator_id;
        let user = await db.sequelize.query(
            'SELECT * FROM creator b\n' +
            'WHERE id=$1\n',
            { bind: [creatorId], type: 'RAW' },
        );
        res.send(user[0]);
    } catch (err) {
        console.log("Error is User: " + err);
        res.sendStatus(400);
    }
};

/*
    TODO implement new endpoints here
 */
exports.listings = async (req, res) => {
    try {
        if (!req.params.creator_id) return res.status(400).send('creator_id required');

        const creatorId = req.params.creator_id;
        const listingsResult = await db.sequelize.query(
            `SELECT campaign_name, campaign_icon_url, conversion_event, media, pricing, access, expires_at FROM campaign`,
            { type: 'RAW' }
        );
        const listingsResultSet = listingsResult[0];

        // Filter out the resultset to only the listings available/accessible to creator_ids passed in (O(n^2))
        // Improvement can be to filter in sql query instead
        const accessibleListings = listingsResultSet.filter((jsonCampaign) => {
            const arrayUserIds = jsonCampaign['access'];
            const expiresAt = jsonCampaign['expires_at'];
            if (expiresAt !== null) {
                const hasExpired = new Date().getTime() > expiresAt;
                return !hasExpired && arrayUserIds.includes(parseInt(creatorId, 10));
            } 

            return arrayUserIds.includes(parseInt(creatorId, 10));
        }); 

        // Can put as separateapi this but might as well get all installs
        const installsResult = await db.sequelize.query(
            `SELECT id, platform, country FROM install WHERE creator_id=$1`,
            { bind: [creatorId], type: 'RAW' },
        );
        const installsResultSet = installsResult[0];
        console.log(installsResultSet);

        const lookupMapCreatorInstalls = {};
        for (let i = 0; i < installsResultSet.length; i++) {
            const jsonInstall = installsResultSet[i];
            lookupMapCreatorInstalls[`${jsonInstall['platform']}-${jsonInstall['country']}`] = 1;
        }

        // For each campaign, calculate the average pay per install
        for (let i = 0; i < accessibleListings.length; i++) {
            const jsonCampaign = accessibleListings[i];
            const pricing = jsonCampaign['pricing'];
            const lookupMapCampaign = {}

            let sum = 0;
            for (const jsonPrice of pricing) {
                lookupMapCampaign[`${jsonPrice['platform']}-${jsonPrice['country']}`] = jsonPrice['price'];
                if (lookupMapCreatorInstalls[`${jsonPrice['platform']}-${jsonPrice['country']}`]) {
                    sum += lookupMapCampaign[`${jsonPrice['platform']}-${jsonPrice['country']}`] ;
                }
            }
            const average = (sum / installsResultSet.length).toFixed(2);
            console.log(`Average for ${jsonCampaign['campaign_name']} : ${average}`);

            accessibleListings[i]['pay_per_install'] = average;
        }

        res.json({creatorId, accessibleListings});
        
    } catch (err) {
        console.log("Error is User: " + err);
        res.sendStatus(400);
    }
};

exports.removeCampaign = async (req, res) => {
    const { publisher_id, campaign_id, remove_at } = req.body;
    if (!publisher_id || !campaign_id) return res.status(400).send('publisher_id and campaign_id required');

    // TODO: Validate remove_at

    // Validate publisher

    const timestamp = (!remove_at) ? new Date().getTime() + (24 * 60 * 60) : remove_at;

    const removeCampaignResult = await db.sequelize.query(
        `UPDATE campaign SET expires_at = $1 WHERE id=$2`,
        { bind: [timestamp, campaign_id], type: 'RAW'}
    );
    const removeCampaignResultSet = removeCampaignResult[0];

    res.sendStatus(200).send('Successfully removed campaign for the future!')
};