import { Redis } from '@upstash/redis';

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (token) {
                await redis.del(token);

                return res.status(200).json({ message: 'Logged out successfully' });
            } else {
                return res.status(400).json({ error: 'Token missing' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Logout failed' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
