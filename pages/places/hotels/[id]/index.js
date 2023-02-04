import { doc, getDoc, getFirestore } from "firebase/firestore";
import { EditPlacePage } from "../../../../components";
const Hotels = ({ docData }) => (
  <EditPlacePage
    NavRoute={"فنادق"}
    collectionName={"places"}
    DocData={docData}
  />
);

export default Hotels;
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
