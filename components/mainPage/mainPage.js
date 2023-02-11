/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useMemo, memo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { collection, where, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FirebaseAppContext } from "../../pages/_app";
import { RouteContext } from "../../contexts";
import { Place } from "../index";
function MainPage({ collectionName, NavRoute, title, PlacesType }) {
  const { isReady, pathname } = useRouter();
  const { editRoute } = useContext(RouteContext);
  const { app, db } = useContext(FirebaseAppContext);
  useEffect(() => editRoute(NavRoute), []);
  const PlacesQuery = useMemo(() => {
    if (!isReady || !app || !db) return;
    const placesRef = collection(db, collectionName || "places");
    console.log(PlacesType);
    return PlacesType
      ? query(
          placesRef,
          where("PlacesToShow", "array-contains", { key: PlacesType })
        )
      : placesRef;
  }, [isReady, app._automaticDataCollectionEnabled]);
  const [places] = useCollectionData(PlacesQuery);
  console.log('places',places);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {places && places.map((i, ind) => <Place {...i} collectionName={collectionName} key={ind + 1} />)}
    </>
  );
}
export default MainPage;
