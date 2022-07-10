import neo4jdb from '../util/neo4j';
const { ModelFactory, ModelRelatedNodesI, NeogmaInstance } = require('neogma');

export interface UserInterface {
    user_id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    userAvatar: string;
    bio: string;
    followers: number;
    following: number;
}

export const User = ModelFactory(
    {
        label: 'User',
        schema: {
            user_id: {
                type: 'string',
                minLength: 3,
                required: true,
            },
            username: {
                type: 'string',
                minLength: 3,
                required: true,
            },
            firstName: {
                type: 'string',
                minLength: 3,
                required: true,
            },
            lastName: {
                type: 'string',
                minLength: 3,
                required: true,
            },
            email: {
                type: 'string',
                minLength: 3,
                required: true,
            },
            userAvatar: {
                type: 'string',
                require: true,
            },
            bio: {
                type: 'string',
                require: false,
            },

            followers: {
                type: 'number',
                default: 0,
                require: false,
            },
            following: {
                type: 'number',
                default: 0,
                require: false,
            },
        },
        primaryKeyField: 'user_id',
        relationships: {
            Follows: {
                model: 'self',
                direction: 'out',
                name: 'Follows',
            },
        },
    },
    neo4jdb
);

User.prototype.getFollwers = function (this: UserInterface) {
    return this.followers;
};
User.prototype.getFollowing = function () {
    return this.following;
};
User.prototype.addFollwers = async function () {
    const follwers: number = this.getFollwers();
    await this.update({ followers: follwers + 1 });
};
