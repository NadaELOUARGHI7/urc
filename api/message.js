// import { Redis } from '@upstash/redis';
// const PushNotifications = require("@pusher/push-notifications-server");
import { db } from "@vercel/postgres";
import { getConnecterUser, triggerNotConnected } from "../lib/session";

export const config = {
    runtime: "edge", // Ensure this is the correct runtime for your environment
};

export default async (request, response) => {
    let client;

    try {
        // Extract headers and authenticate user
        const user = await getConnecterUser(request);
        if (!user) {
            console.log("User not connected");
            return triggerNotConnected(response);
        }

        // Parse the request body
        const { sender_id, receiver_id, content } = await request.json();
        if (!sender_id || !receiver_id || !content.trim()) {
            return response.status(400).json({ error: "Invalid input. All fields are required." });
        }

        // Connect to the database
        client = await db.connect();
        if (!client) {
            console.error("Failed to connect to the database");
            return response.status(500).json({ error: "Failed to connect to the database" });
        }

        // Insert the message into the database
        const query = `
            INSERT INTO messages (sender_id, receiver_id, content)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [sender_id, receiver_id, content];
        const result = await client.query(query, values);
        const newMessage = result.rows[0];

        // Respond with the inserted message
        return new Response(JSON.stringify(newMessage), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
            } catch (error) {
        console.error("Error inserting message:", error);
        return response.status(500).json({ error: "Internal server error." });
    } finally {
        if (client) {
            client.release();
        }
    }
};
