'use strict';

module.exports = function(sequelize, DataTypes) {
    var Campaign = sequelize.define(
        'Campaign',
        {
            campaign_name: { type: DataTypes.STRING },
            campaign_icon_url: { type: DataTypes.STRING },
            conversion_event: { type: DataTypes.STRING },
            media: { type: DataTypes.ARRAY(DataTypes.JSONB) },
            pricing: { type: DataTypes.ARRAY(DataTypes.JSONB) },
            access: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
            expires_at: { type: DataTypes.INTEGER }
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            underscored: true,
            tableName: 'campaign',
        },
    );

    return Campaign;
};
