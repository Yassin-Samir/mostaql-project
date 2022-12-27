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
    const PlacesQuery = query(
      placesRef,
      where("PlacesToShow", "array-contains", { key: PlacesType })
    );
    return PlacesQuery;
  }, [isReady, app._automaticDataCollectionEnabled]);
  const [places] = useCollectionData(PlacesQuery);
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
