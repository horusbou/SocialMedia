const { Neogma, ModelFactory } = require('neogma');
const neogma = new Neogma(
	{ url: 'bolt://localhost:7687', username: 'neo4j', password: 'compaq7550' },
	{
		logger: console.log,
	}
);

export default neogma;
