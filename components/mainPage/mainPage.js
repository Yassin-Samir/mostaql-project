/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useMemo, memo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FirebaseAppContext } from "../../pages/_app";
import { RouteContext } from "../../contexts";
import { Place } from "../index";
function MainPage({ NavRoute, title }) {
  const { isReady, pathname } = useRouter();
  const { editRoute } = useContext(RouteContext);
  const { app, db } = useContext(FirebaseAppContext);
  useEffect(() => editRoute(NavRoute), []);
  const placesRef = useMemo(() => {
    if (!isReady || !app || !db) return;
    const placesRef = collection(db, "places");
    return placesRef;
  }, [isReady, app._automaticDataCollectionEnabled]);
  const [places] = useCollectionData(placesRef);
  console.log(places);
  console.log(NavRoute);
  console.log(places);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {places && places.map((i, ind) => <Place {...i} key={ind + 1} />)}
    </>
  );
}
export default MainPage;
