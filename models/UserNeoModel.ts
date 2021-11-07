import neo4jdb from '../util/neo4j';
const { ModelFactory } = require('neogma');
export interface UserInterface {
	user_id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
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
// export { User, UserInterface };
