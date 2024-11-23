// beams.js
const express = require("express");
const router = express.Router();
const PushNotifications = require("@pusher/push-notifications-server");

const beamsClient = new PushNotifications({
  instanceId: "299133a2-058c-43bd-8fea-d418d69fa943", // Replace with env variable in production
  secretKey: "4C8ED6519D08EF8AC726DB4530668024263F7A742AF276EE98476C92E2277B7E", // Replace with env variable in production
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

    console.log("Push notification sent!");
    res.status(200).json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error("Error sending push notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;