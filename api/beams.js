// beams.js
const express = require("express");
const router = express.Router();
const PushNotifications = require("@pusher/push-notifications-server");

const beamsClient = new PushNotifications({
  instanceId: process.env.PUSHER_INSTANCE_ID,
  secretKey: process.env.PUSHER_SECRET_KEY,
});

router.post("/api/beams", async (req, res) => {
  const { receiver_id, sender_id, content ,sender_name} = req.body;
  try {
    if (!receiver_id || !sender_id || !content) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const interest = `user-${receiver_id}`;
    // Determine the environment and set the appropriate domain
    const domain = process.env.NODE_ENV === "production" 
      ? "https://urc-cwhjsam9t-nada-el-ouarghis-projects.vercel.app/"  // Your production domain
      : "http://localhost:3001";            // Localhost for development

      const deepLink = `${domain}/chat/${sender_id}`; 

    await beamsClient.publishToInterests([interest], {
      web: {
        notification: {
          title: "New Message",
          body: `${sender_name}: ${content}`,
          deep_link: deepLink,
        },
      },
    });
    console.log("Sending push notification with data:", {
      receiver_id: receiver_id,
      sender_id: sender_id,
      content: content,
      sender_name: sender_name
    });
    console.log("tttttttttttt",process.env.PUSHER_INSTANCE_ID);
    console.log("Push notification sent!");
    res.status(200).json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error("Error sending push notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;