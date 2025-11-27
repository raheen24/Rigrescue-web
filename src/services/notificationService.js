import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../../public/firebase.js";
import { store } from "../redux/store.js";
import { setFcmToken } from "../redux/userslice.js";

const requestFirebaseNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);

    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
      return null;
    }

    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    console.log("FCM token:", token);

    store.dispatch(setFcmToken(token));

    return token;

  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
    return null;
  }
};

export { requestFirebaseNotificationPermission };