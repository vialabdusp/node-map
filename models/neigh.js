const Sequelize = require('sequelize');

module.exports = (sequelize) => { 
    return sequelize.define('neigh', {
        oid: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name : {
            type: Sequelize.STRING,
            allowNull: false
        },
        length: {
            type: Sequelize.FLOAT
        },
        area: {
            type: Sequelize.FLOAT
        },
        geom: {
            type: Sequelize.GEOMETRY('POLYGON', 4326)
        }
    }, {
        timestamps: false
    })
}