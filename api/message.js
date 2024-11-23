import { db } from "@vercel/postgres";
import { getConnecterUser, triggerNotConnected } from "../lib/session";

export const config = {
    runtime: "edge", 
};

// Helper function to fetch sender's name
async function getSenderNameById(senderId) {
    let client;
    try {
        client = await db.connect();
        const senderQuery = `
            SELECT username FROM users WHERE user_id = $1;
        `;
        const senderResult = await client.query(senderQuery, [senderId]);
        return senderResult.rows[0]?.username || "Unknown";  
    } catch (error) {
        console.error("Error fetching sender name:", error);
        return "Unknown"; 
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function sendPushNotification(receiverId, senderId, content, userToken, roomId = null) {
        try {
            console.log(`Sending push notification: receiver ${receiverId}, sender ${senderId}, room ${roomId}`);
            const senderName = await getSenderNameById(senderId);

            const response = await fetch(`http://localhost:3001/api/beams`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    receiver_id: receiverId,
                    sender_id: senderId,
                    content: content,
                    sender_name: senderName,
                }),
            });
    
            if (!response.ok) {
                const errorDetails = await response.text();
                console.error(`Push notification failed for receiver ${receiverId}:`, errorDetails);
                throw new Error(`Failed to send notification: ${response.status} ${response.statusText}`);
            }
    
            const result = await response.json();
            console.log(`Push notification sent to receiver ${receiverId}:`, result);
        } catch (error) {
            console.error(`Error sending push notification to receiver ${receiverId}:`, error);
        }
  };


export default async (request, response) => {
    let client;

    try {
        const user = await getConnecterUser(request);
        if (!user) {
            console.log("User not connected");
            return triggerNotConnected(response);
        }
        const userToken = user.token; 
        const { sender_id, receiver_id, room_id, content } = await request.json();

        client = await db.connect();
        if (!client) {
            console.error("Failed to connect to the database");
            return response.status(500).json({ error: "Failed to connect to the database" });
        }

        let query, values, result;

        if (room_id) {
            query = `
                INSERT INTO room_messages (sender_id, room_id, content)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            values = [sender_id, room_id, content];
            result = await client.query(query, values);
            const newMessage = result.rows[0];

            const membersQuery = `
                SELECT user_id 
                FROM users
                WHERE user_id != $1;
            `;
            const membersResult = await client.query(membersQuery, [sender_id]);
            const groupMemberIds = membersResult.rows.map((row) => row.user_id);
             await Promise.all(
                groupMemberIds.map((memberId) =>
                    sendPushNotification(memberId, sender_id, content, userToken, room_id)
                )
                , console.log("gsgsgsg",content)
            );

            return new Response(JSON.stringify(newMessage), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });

        } else {
            query = `
                INSERT INTO messages (sender_id, receiver_id, content)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            values = [sender_id, receiver_id, content];
            result = await client.query(query, values);
            const newMessage = result.rows[0];

            await sendPushNotification(receiver_id, sender_id, content, userToken);

            return new Response(JSON.stringify(newMessage), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        }

    }  catch (error) {
        console.error("Error inserting message:", error);
        return response.status(500).json({ error: "Internal server error." });
    } finally {
        if (client) {
            client.release();
        }
    }
};
