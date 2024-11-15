import { getConnecterUser, triggerNotConnected } from '../lib/session';
import { db } from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    try {
        console.log("Handling request for /api/chat");

        // Validate the authenticated user
        const user = await getConnecterUser(req);
        if (!user) {
            console.log("Not connected");
            return new Response(JSON.stringify({ error: "Not authenticated" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Extract the query parameters from the URL
        const url = new URL(req.url);
        const selectedUserId = url.searchParams.get("selectedUserId");
        console.log("Fetching messages for selectedUserId:", selectedUserId);

        // Validate selectedUserId
        if (!selectedUserId || isNaN(Number(selectedUserId))) {
            console.log("Invalid selectedUserId:", selectedUserId);
            return new Response(JSON.stringify({ error: "Invalid userId provided." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Connect to the database
        const client = await db.connect();
        if (!client) {
            console.error("Failed to connect to the database");
            return new Response(JSON.stringify({ error: "Failed to connect to the database" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Fetch messages between the authenticated user and the target user
        const result = await client.query(
            `SELECT * FROM messages 
             WHERE (sender_id = $1 AND receiver_id = $2) 
                OR (sender_id = $2 AND receiver_id = $1) 
             ORDER BY timestamp ASC`,
            [user.id, selectedUserId]
        );

        // Check if there are messages
        if (result.rows.length === 0) {
            console.log("No messages found between user and selectedUserId");
            return new Response(JSON.stringify({ error: "No messages found between these users." }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Return the fetched messages
        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Internal server error:", error);
        // Handle errors with an appropriate response
        return new Response(JSON.stringify({ error: "An error occurred while fetching messages." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 