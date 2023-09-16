import { useEffect, useRef } from "react";

function useEventHandler(eventType, callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleEvent = (event) => {
      callbackRef.current(event);
    };
    window.addEventListener(eventType, handleEvent);
    return () => {
      window.removeEventListener(eventType, handleEvent);
    };
  }, [eventType]);
}

export default useEventHandler;
