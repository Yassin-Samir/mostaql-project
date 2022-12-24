import { createContext } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GlobalRouteContext } from "../contexts";
import { Nav } from "../components";
import "../styles/globals.css";
const app = initializeApp({
  apiKey: "AIzaSyDROPc-Tb1AHUDp4Xz9Se-womiF0WMz1h8",
  authDomain: "mostaql-78e5b.firebaseapp.com",
  projectId: "mostaql-78e5b",
  storageBucket: "mostaql-78e5b.appspot.com",
  messagingSenderId: "805214583123",
  appId: "1:805214583123:web:10d366cc728f8e8e6649a6",
  measurementId: "G-Y6W3N80MYY",
});
const db = getFirestore(app);
export const FirebaseAppContext = createContext({ app: null, db: null });
export default function App({ Component, pageProps }) {
  return (
    <FirebaseAppContext.Provider value={{ app, db }}>
      <GlobalRouteContext>
        <Nav />
        <main>
          <Component {...pageProps} />
        </main>
      </GlobalRouteContext>
    </FirebaseAppContext.Provider>
  );
}
