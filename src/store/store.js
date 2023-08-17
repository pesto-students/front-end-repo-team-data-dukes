import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import storage from "redux-persist/lib/storage";

import { rootReducer } from "./reducers/rootReducer";

const externalMiddleware = [logger, thunk];

const config = {
  key: "XjhgVQbjZbKNKkmDXuWvHqaq",
  storage: storage,
  transforms: [
    encryptTransform({
      secretKey: "UcaZxYsAdZeGZsmEFRAxtcUn",
      onError: function (error) {
        console.log("Decryption Error!");
      },
    }),
  ],
  blacklist: ["contact"],
};

const persistedReducer = persistReducer(config, rootReducer);

const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(externalMiddleware),
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

let persistor = persistStore(store);

export { store, persistor };
