import { DataTypes, Model, Optional } from 'sequelize';
import db from '../util/database';

export interface RetweetCreationAttributes
    extends Optional<RetweetIterface, 'post_id'> { }

export interface RetweetIterface {
    retweet_id: string;
    post_id: string;
    user_id: string;
}
export const Retweet = db.define('Retweet', {
    retweet_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    retweetBody: {
        type: new DataTypes.STRING(6383),
        allowNull: false,
        defaultValue: ''
    }
});
