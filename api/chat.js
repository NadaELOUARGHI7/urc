import { getConnecterUser, triggerNotConnected } from '../lib/session';
import { db } from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    try {
        console.log("Handling request for /api/chat");


        const user = await getConnecterUser(req);
        if (!user) {
            console.log("Not connected");
            return new Response(JSON.stringify({ error: "Not authenticated" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }


        const url = new URL(req.url);
        const selectedUserId = url.searchParams.get("selectedUserId")  ;
        console.log("Fetching messages for selectedUserId:", selectedUserId);


        const client = await db.connect();
        if (!client) {
            console.error("Failed to connect to the database");
            return new Response(JSON.stringify({ error: "Failed to connect to the database" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }



        if (selectedUserId) {
            console.log("Fetching user-to-user chat for selectedUserId:", selectedUserId);

            if (isNaN(Number(selectedUserId))) {
                console.log("Invalid selectedUserId:", selectedUserId);
                return new Response(JSON.stringify({ error: "Invalid userId provided." }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }


            const result = await client.query(
            `SELECT * FROM messages 
             WHERE (sender_id = $1 AND receiver_id = $2) 
                OR (sender_id = $2 AND receiver_id = $1) 
             ORDER BY timestamp ASC`,
            [user.id, selectedUserId]
        );


        const userResult = await client.query(
            `SELECT username FROM users WHERE user_id = $1`,
            [selectedUserId]
        );


        if (result.rows.length === 0) {
            console.log("No messages found in the room");
            
        }

        const userNameReciever = userResult.rows.length > 0 ? userResult.rows[0].username : "Unknown User";


        return new Response(JSON.stringify({ messages: result.rows, userNameReciever }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    }

    } catch (error) {
        console.error("Internal server error:", error);
        return new Response(JSON.stringify({ error: "An error occurred while fetching messages." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}