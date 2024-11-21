//useBeamsClients
import { useEffect } from "react";
import { Client as PusherPushNotifications } from "@pusher/push-notifications-web";

const useBeamsClient = (userId: number | null) => {
    useEffect(() => {
        if (!userId) return;

        const beamsClient = new PusherPushNotifications({
            instanceId: "299133a2-058c-43bd-8fea-d418d69fa943", 
        });

        
        beamsClient.start()
        .then(() => beamsClient.addDeviceInterest(`user-${userId}`))
        .then(() => console.log(`Subscribed to interest: user-${userId}`))
        .catch(error => console.error('Error setting up Pusher Beams:', error));
  

        return () => {
          beamsClient.removeDeviceInterest(`receiveruser-${userId}`)
          .then(() => {
              console.log(`Unsubscribed from interest: user-${userId}`);
          })
          .catch((error) => {
              console.error("Error clearing Pusher Beams interest:", error);
          });
        };
    }, [userId]);
};

export default useBeamsClient;
