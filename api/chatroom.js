import { getConnecterUser } from '../lib/session';
import { db } from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    try {
        console.log("Handling request for /api/chatroom");

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
        const selectedRoomId = url.searchParams.get("selectedRoomId");
        console.log("Fetching messages for selectedRoomId:", selectedRoomId);


        // Connect to the database
        const client = await db.connect();
        if (!client) {
            console.error("Failed to connect to the database");
            return new Response(JSON.stringify({ error: "Failed to connect to the database" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }


        // User-to-room chat
        if (selectedRoomId) {
            console.log("Fetching user-to-room chat for selectedRoomId:", selectedRoomId);

            if (isNaN(Number(selectedRoomId))) {
                console.log("Invalid selectedRoomId:", selectedRoomId);
                return new Response(JSON.stringify({ error: "Invalid userId provided." }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }


        // Fetch messages for the room
        const result = await client.query(
            `SELECT rm.*, u.username 
             FROM room_messages rm
             JOIN users u ON rm.sender_id = u.user_id
             WHERE rm.room_id = $1
             ORDER BY rm.timestamp ASC`,
            [selectedRoomId]
        );

        if (result.rows.length === 0) {
            console.log("No messages found in the room");
            return new Response(JSON.stringify({ error: "No messages found in this room." }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } 
    }catch (error) {
        console.error("Internal server error:", error);
        return new Response(JSON.stringify({ error: "An error occurred while fetching messages." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
