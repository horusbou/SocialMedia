import neo4jdb from '../util/neo4j';
const { ModelFactory, ModelRelatedNodesI, NeogmaInstance } = require('neogma');
export interface UserInterface {
	user_id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	avatar: string;
	bio: string;
	followers: number;
	following: number;
}

interface MethodsI {
	getFollowers: (this: UserInterface) => number;
	getFollowing: (this: UserInterface) => number;
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
			avatar: {
				type: 'string',
				require: true,
			},
			bio: {
				type: 'string',
			},
			followers: {
				type: 'number',
				minimum: 0,
			},
			following: {
				type: 'number',
				minimum: 0,
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
// methods: {
//     Getfollwers: function () {
//         return this.followers;
//     },
//     Getfollowing: function () {},
// },
User.prototype.getFollwers = function () {
	return this.followers;
};
User.prototype.getFollowing = function () {
	return this.following;
};
User.prototype.addFollwers = async function () {
	const follwers: number = this.getFollwers();
	await this.update({ followers: follwers + 1 });
};
// export { User, UserInterface };
