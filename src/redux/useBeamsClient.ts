import { useEffect } from "react";
import { Client as PusherPushNotifications } from "@pusher/push-notifications-web";
console.log("PusherPushNotifications import:", PusherPushNotifications);

const useBeamsClient = (userId: number | null) => {
    useEffect(() => {
        if (!userId) return;

        if (!PusherPushNotifications) {
          console.error("PusherPushNotifications is undefined. Ensure the library is installed and imported correctly.");
          return;
      }

        const beamsClient = new PusherPushNotifications({
            instanceId: "299133a2-058c-43bd-8fea-d418d69fa943", 
        });

        beamsClient
            .start()
            .then(() => beamsClient.addDeviceInterest(`user-${userId}`))
            .then(() => {
                console.log(`Subscribed to interest: user : ${userId}`);
            })
            .catch((error) => {
                console.error("Error setting up Pusher Beams:", error);
            });

        return () => {
            beamsClient.removeDeviceInterest(`user-${userId}`);
            console.error("Error clearing Pusher Beams state:", Error);

        };
    }, [userId]);
};

export default useBeamsClient;
