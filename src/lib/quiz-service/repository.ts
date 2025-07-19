import * as redis from 'redis';
import RedisJsonModule from '@redis/json';
import { PlayerRecord } from '@/lib/quiz-service/types';

const redisClient = await redis.createClient({
    url: process.env.REDIS_URL,
    modules: { json: RedisJsonModule },
}).on("error", (err) => console.log("Redis Client Error", err)).connect();

async function getRecord(id: string): Promise<PlayerRecord | null> {
    return await redisClient.json.get(id) as unknown as PlayerRecord | null;
}

async function setRecord(id: string, record: PlayerRecord): Promise<void> {
    // @ts-expect-error JSON module is used
    await redisClient.json.set(id, '$', record);
}

async function deleteRecord(id: string): Promise<void> {
    await redisClient.del(id);
}

export const quizRepository = {
    getRecord,
    setRecord,
    deleteRecord
}
