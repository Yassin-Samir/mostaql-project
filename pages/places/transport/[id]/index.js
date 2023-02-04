import { doc, getDoc, getFirestore } from "firebase/firestore";
import { EditPlacePage } from "../../../../components";
const EntertainmentPage = ({ docData }) => (
  <EditPlacePage
    NavRoute={"تنقل"}
    DocData={docData}
    collectionName={"places"}
  />
);

export default EntertainmentPage;
export async function getServerSideProps({ params }) {
  const { id } = params;
  const db = getFirestore();
  const docRef = doc(db, "places", id);
  const docSnapShot = await getDoc(docRef);
  const docData = docSnapShot.data();
  console.log(docData);
  return {
    props: { docData: docData || null },
  };
}
