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
            return unauthorizedResponse(); 
        }


        const tok = await redis.get(token);
        if (!tok) {
            console.warn("Token is not valid or expired.");
            return unauthorizedResponse(); 
        }


        const connected = await checkSession(request);
        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }


        const bearerToken = token.replace("Bearer ", "").trim();
        const user = await redis.get(bearerToken);
        const currentUser=user.username;


        const { rowCount, rows } = await sql`select user_id, username, TO_CHAR(last_login, 'DD/MM/YYYY HH24:MI') as last_login from users WHERE username != ${currentUser}  order by last_login desc`;
        console.log("Got " + rowCount + " users");

        if (rowCount === 0) {
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
