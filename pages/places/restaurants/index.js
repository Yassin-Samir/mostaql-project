/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FirebaseAppContext } from "../../_app";
import { RouteContext } from "../../../contexts";
import { Restaurant, LinkComponent } from "../../../components";
function Restaurants() {
  const { isReady, pathname } = useRouter();
  const { editRoute } = useContext(RouteContext);
  const { app, db } = useContext(FirebaseAppContext);
  useEffect(() => editRoute("المطاعم"), []);
  const restaurantsRef = useMemo(() => {
    if (!isReady || !app || !db) return;
    const restaurantsRef = collection(db, "restaurants");
    return restaurantsRef;
  }, [isReady, app._automaticDataCollectionEnabled]);
  const [restaurants] = useCollectionData(restaurantsRef);
  return (
    <>
      <Head>
        <title>restaurants</title>
      </Head>
      {restaurants &&
        restaurants.map((i, ind) => <Restaurant {...i} key={ind + 1} />)}
      <LinkComponent Route={`${pathname.replace(/\//, "")}/create`}>
        انشاء مطعم
      </LinkComponent>
    </>
  );
}
export default Restaurants;
