'use strict';

if (!global.hasOwnProperty('db')) {
    let {Sequelize, sequelize} = require('../service/db');

    global.db = {
        Sequelize: Sequelize,
        sequelize: sequelize,
        Creator: require(__dirname + '/creator')(sequelize, Sequelize.DataTypes),
        Install: require(__dirname + '/install')(sequelize, Sequelize.DataTypes),
        Publisher: require(__dirname + '/publisher')(sequelize, Sequelize.DataTypes),
        /*
        *
        * TODO add any additional models here.
        *
        */
        Campaign: require(__dirname + '/campaign')(sequelize, Sequelize.DataTypes)
    };

    global.db.Creator.hasMany(global.db.Install, {
        onDelete: 'cascade',
        foreignKey: 'creator_id',
    });

    global.db.Publisher.hasMany(global.db.Campaign, {
        onDelete: 'cascade',
        foreignKey: 'campaign_id',
    });

    // global.db.Install.belongsTo(global.db.Campaign, {
    //     onDelete: 'cascade',
    //     foreignKey: 'campaign_id',
    // });

    /*
    *
    * TODO add any additional relationships between models here.
    *
    */
}