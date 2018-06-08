const Sequelize = require('sequelize');
const config = require('../config.js');

const sequelize = new Sequelize(config.database,config.username, config.password,
    {
        host: config.host,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            freezeTableName: true,
            createdAt: false,
            updatedAt: false
        }
    }
)

const User = sequelize.define( 'student', {
    id: {type: Sequelize.STRING(10), primaryKey: true, allowNull: false},
    name: {type: Sequelize.STRING(10), allowNull: false},
    gender: {type: Sequelize.BOOLEAN, allowNull: false},
    pass: {type: Sequelize.STRING(50),allowNull: false}
})

module.exports = User;