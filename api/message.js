import {getConnecterUser, triggerNotConnected} from "../lib/session";
// import { Redis } from '@upstash/redis';
// const PushNotifications = require("@pusher/push-notifications-server");

export default async (request, response) => {
    try {
        const headers = new Headers(request.headers);
        const user = await getConnecterUser(request);
        if (user === undefined || user === null) {
            console.log("Not connected");
            triggerNotConnected(response);
        }

        const message = await request.body;

        const insertMessage = async (senderId, receiverId, content) => {
            const query = `
                INSERT INTO messages (sender_id, receiver_id, content)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [senderId, receiverId, content];
            const result = await pool.query(query, values);
            return result.rows[0];
        };
        
        response.send("OK");
    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
