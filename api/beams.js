// beams.js

const express = require("express");
const router = express.Router();
const Pusher = require("@pusher/push-notifications-server");


const beamsClient = new PushNotifications.Client({
    instanceId: "299133a2-058c-43bd-8fea-d418d69fa943",  //process.env.PUSHER_INSTANCE_ID
    secretKey: "4C8ED6519D08EF8AC726DB4530668024263F7A742AF276EE98476C92E2277B7E", //process.env.PUSHER_SECRET_KEY
    });

    router.post("/api/beams", async (req, res) => {
        try {
            const { receiver_id, sender_id, content } = req.body;
            console.log("Request body: in api/beams", req.body); // Log incoming data

            if (!receiver_id || !sender_id || !content) {
                throw new Error("Missing required fields");
            }
    
            const interest = `user-${receiver_id}`;
            const response = await beamsClient.publishToInterests([interest], {
                apns: {
                    aps: {
                        alert: {
                            title: `Message from user ${sender_id}`,
                            body: content,
                        },
                    },
                },
                fcm: {
                    notification: {
                        title: `Message from user ${sender_id}`,
                        body: content,
                    },
                },
            });
    
            console.log("Push notification sent successfully", response);
            res.status(200).send({ success: true });
        } catch (error) {
            console.error("Error in /api/beams:", error.message, error.stack);
            res.status(500).send("Internal Server Error");
        }
    });
    

module.exports = router;
/*
    app.post("/api/beams", async (req, res) => {
        const { receiver_id, sender_id, content } = req.body;
    
        try {
            // Assuming you have a mapping of user IDs to Pusher Beams interests
            const interest = `user-${receiver_id}`;
    
            await beamsClient.publishToInterests([interest], {
                web: {
                    notification: {
                        title: "New Message",
                        body: `${sender_id}: ${content}`,
                        deep_link: `/chat/${sender_id}`, // URL to open when the notification is clicked
                    },
                },
            });
    
            console.log("Push notification sent!");
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error sending push notification:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    });    
*/


/*import {getConnecterUser, triggerNotConnected} from "../lib/session";

const PushNotifications = require("@pusher/push-notifications-server");


export default async (req, res) => {

    const userIDInQueryParam = req.query["user_id"];
    const user = await getConnecterUser(req);
    console.log("PushToken : " + userIDInQueryParam + " -> " + JSON.stringify(user));
    if (user === undefined || user === null || userIDInQueryParam !== user.externalId) {
        console.log("Not connected");
        triggerNotConnected(res);
        return;
    }

    console.log("Using push instance : " + process.env.PUSHER_INSTANCE_ID);
    const beamsClient = new PushNotifications({
        instanceId: process.env.PUSHER_INSTANCE_ID,
        secretKey: process.env.PUSHER_SECRET_KEY,
    });

    const beamsToken = beamsClient.generateToken(user.externalId);
    console.log(JSON.stringify(beamsToken));
    res.send(beamsToken);
};
*/