/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FirebaseAppContext } from "../../_app";
import { RouteContext } from "../../../contexts";
import { Restaurant, LinkComponent } from "../../../components";
function Imp() {
  const { isReady, pathname } = useRouter();
  const { editRoute } = useContext(RouteContext);
  const { app, db } = useContext(FirebaseAppContext);
  useEffect(() => editRoute("عناوين مهمة"), []);
  const entertainmentsRef = useMemo(() => {
    if (!isReady || !app || !db) return;
    const entertainmentsRef = collection(db, "Imp");
    return entertainmentsRef;
  }, [isReady, app._automaticDataCollectionEnabled]);
  const [entertainments] = useCollectionData(entertainmentsRef);
  return (
    <>
      <Head>
        <title>entertainments</title>
      </Head>
      {entertainments &&
        entertainments.map((i, ind) => <Restaurant {...i} key={ind + 1} />)}
      <LinkComponent Route={`${pathname.replace(/\//, "")}/create`}>
        اضف
      </LinkComponent>
    </>
  );
}
export default Imp;
