import React, { useEffect } from "react";
import Navigation from "./navigation/Navigation";
import { ToastContainer, toast } from "react-toastify";
import { ModalProvider } from "./components/ModalContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { requestFirebaseNotificationPermission } from "./services/notificationService";
import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "../public/firebase.js";

const App = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    requestFirebaseNotificationPermission();

    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      toast.info(`${payload.notification.title}: ${payload.notification.body}`, {
        position: "top-right",
        autoClose: 5000,
      });
    });
  }, []);

  return (
    <Provider store={store}>
      <ModalProvider>
        <ToastContainer />
        <Navigation />
      </ModalProvider>
    </Provider>
  );
};

export default App;
