import redis from 'redis';

const redisClient = redis.createClient({ legacyMode: true })
await redisClient.connect()
console.log('redisConnected');
export default redisClient;