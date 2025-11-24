import React, { useEffect } from "react";
import Navigation from "./navigation/Navigation";
import { ToastContainer } from "react-toastify";
import { ModalProvider } from "./components/ModalContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { requestFirebaseNotificationPermission } from "./services/notificationService";

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
