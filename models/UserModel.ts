import { DataTypes, Model } from 'sequelize';
import db from '../util/database';
import { Optional } from 'sequelize';
export interface UserCreationAttributes
    extends Optional<UserInterface, 'user_id'> { }

export interface UserI {
    user_id: string;
    username: string;
    firstName: string;
    lastName: string;
    userAvatar: string | '';
    email: string;
    password: string;
    bio: string;
}

export interface UserInterface extends Model {
    user_id: string;
    username: string;
    firstName: string;
    lastName: string;
    userAvatar: string | '';
    email: string;
    password: string;
    bio: string;
}
export const User = db.define(
    'User',
    {
        user_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userAvatar: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
    },
    { timestamps: true }
);
