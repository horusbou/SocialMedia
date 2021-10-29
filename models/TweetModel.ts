import { DataTypes, Model, Optional } from 'sequelize';
import db from '../util/database';

export interface TweetCreationAttributes
	extends Optional<TweetIterface, 'post_id'> {}

export interface TweetIterface {
	tweet_id: string;
	post_id: string;
	user_id: string;
}
export const Tweet = db.define('Retweet', {
	Tweet_id: {
		primaryKey: true,
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
	},
	post_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
});
