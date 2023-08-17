import { useState, useEffect } from "react";

export const useInternetConnection = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleOnline = () => {
    setIsOnline(true);
  };

  const handleOffline = () => {
    setIsOnline(false);
  };

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const addOnlineHandler = (handler) => {
    window.addEventListener("online", handler);
  };

  const addOfflineHandler = (handler) => {
    window.addEventListener("offline", handler);
  };

  return { isOnline, addOnlineHandler, addOfflineHandler };
};
