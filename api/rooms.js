import { sql } from "@vercel/postgres";
import { checkSession, unauthorizedResponse } from "../lib/session";
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); 

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {

        const token = request.headers.get('Authorization')?.replace("Bearer ", "").trim();

        if (!token) {
            console.warn("Authentication token missing");
            return unauthorizedResponse(); // Return unauthorized if token is missing
        }


        const tok = await redis.get(token);
        if (!tok) {
            console.warn("Token is not valid or expired.");
            return unauthorizedResponse(); // Return unauthorized if token is not valid
        }


        const connected = await checkSession(request);
        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

        // Query the database for users
        const { rowCount, rows } = await sql`select room_id, name, TO_CHAR(created_on, 'DD/MM/YYYY HH24:MI') as created_on from rooms order by created_on desc`;
        console.log("Got " + rowCount + " room");

        if (rowCount === 0) {
            // Vercel bug doesn't allow 204 response status
            return new Response("[]", {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify(rows), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
