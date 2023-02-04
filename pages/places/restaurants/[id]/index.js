import { doc, getDoc, getFirestore } from "firebase/firestore";
import { EditPlacePage } from "../../../../components";
const EntertainmentPage = ({ docData }) => (
  <EditPlacePage
    NavRoute={"مطاعم"}
    collectionName={"places"}
    DocData={docData}
  />
);

export default EntertainmentPage;
export async function getServerSideProps({ params }) {
  const { id } = params;
  const db = getFirestore();
  const docRef = doc(db, "places", id);
  const docSnapShot = await getDoc(docRef);
  const docData = docSnapShot.data();
  return {
    props: { docData: docData || null },
  };
}
