import neo4jdb from '../util/neo4j';
const { ModelFactory, ModelRelatedNodesI, NeogmaInstance } = require('neogma');


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
      firstname: {
        type: 'string',
        minLength: 3,
        required: true,
      },
      lastname: {
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
        require: false,
        minimum: 0,
      },
      following: {
        type: 'number',
        require: false,
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
