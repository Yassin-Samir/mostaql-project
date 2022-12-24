import { getFirestore, collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
const firestore = getFirestore();
const entertainmentRef = collection(firestore, "entertainment");
console.log();
function Entertainment() {
  const [entertainment] = useCollectionData(entertainmentRef);
  console.log(entertainment);
  return <div>Entertainment</div>;
}
export default Entertainment;
