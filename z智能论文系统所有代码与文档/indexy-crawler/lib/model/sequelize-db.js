'use strict';

const Sequelize = require('sequelize');
const config = require('../../config');

const sequelize = new Sequelize(config.sequelize);

// 只是验证是否已连接数据库
// sequelize.authenticate()
// 	.then( () => {
// 		console.log( `Has connected to msql :${config.sequelize.host}.` );
// 	} )
// 	.catch( err => {
// 		console.error( `Unable to connect to the database:${config.sequelize.host}`, err );
// 	} );


module.exports = sequelize;
exports.Sequelize = Sequelize;
