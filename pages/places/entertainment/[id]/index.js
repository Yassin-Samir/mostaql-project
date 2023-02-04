import { doc, getDoc, getFirestore } from "firebase/firestore";
import { EditPlacePage } from "../../../../components";
const Edit = ({ docData }) => (
  <EditPlacePage
    NavRoute={"ترفيه"}
    collectionName={"entertainment"}
    DocData={docData}
  />
);

export default Edit;
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
