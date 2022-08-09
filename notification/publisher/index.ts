import { Tweet } from '../../entity';
import { createClient } from 'redis';



const publisher = createClient();

publisher.on('error', (err) => console.log('Redis Client Error', err));
(async () => {

    const article = {
        id: '123456',
        name: 'Using Redis Pub/Sub with Node.js',
        blog: 'Logrocket Blog',
    };

    await publisher.connect();

    await publisher.publish('hamzaBouqal', JSON.stringify(article));
})();
