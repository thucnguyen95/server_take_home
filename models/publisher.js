'use strict';

module.exports = function(sequelize, DataTypes) {
    var Publisher = sequelize.define(
        'Publisher',
        {
            name: { type: DataTypes.TEXT },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            underscored: true,
            tableName: 'publisher',
        },
    );

    return Publisher;
};