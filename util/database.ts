const Sequelize = require('sequelize');
const sequelize = new Sequelize('ensaTweet', 'root', 'compaq7550', {
	host: 'localhost',
	dialect: 'mysql',
});
export default sequelize;
