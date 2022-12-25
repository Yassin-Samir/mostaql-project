import { setDoc, doc, getDoc } from "firebase/firestore";
import {
  useContext,
  useCallback,
  useState,
  Suspense,
  useEffect,
  createRef,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import { FirebaseAppContext } from "../../../_app";
import { RouteContext } from "../../../../contexts";
import Head from "next/head";
import Image from "next/image";
import PreviewImg from "../../../../public/-Insert_image_here-.svg.png";
import style from "../../../../styles/createRestaurant.module.css";
function Edit() {
  const [Base64Img, setBase64Img] = useState(PreviewImg);
  const [document, setDocument] = useState({
    Name: "",
    Location: "",
    Img: "",
    id: "",
  });
  const {
    query: { id },
    isReady,
    push,
  } = useRouter();
  const { db } = useContext(FirebaseAppContext);
  const { editRoute } = useContext(RouteContext);
  const LocationRef = useMemo(() => createRef(), []);
  const NameRef = useMemo(() => createRef(), []);
  const submitRef = useMemo(() => createRef(), []);
  useEffect(() => {
    editRoute("تعديل ترفيه");
    if (!isReady || !id || !(LocationRef || submitRef || NameRef).current)
      return;
    const documentRef = doc(db, "entertainment", id);
    (async () => {
      const docSnap = await getDoc(documentRef);
      const DocData = docSnap.data();
      if (!DocData) push("/404");
      const { Img, Name, Location } = DocData;
      setDocument({ ...DocData });
      setBase64Img(Img);
      NameRef.current.value = Name;
      LocationRef.current.value = Location;
    })();
  }, [isReady, id, submitRef.current, NameRef.current, LocationRef.current]);
  const HandleInputChange = useCallback(({ target }) => {
    if (!target.files.length) return;
    if (!target.files[0].name?.match(/\.jpe?g/)) {
      alert("wrong file format was provided accept jpg or jpeg");
      return;
    }
    const Reader = new FileReader();
    Reader.onload = ({ target: { result } }) => setBase64Img(result);
    Reader.readAsDataURL(target.files[0]);
  }, []);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { value: Location } = LocationRef.current;
      const { value: Name } = NameRef.current;
      if (
        Location === document.Location &&
        Name === document.Name &&
        Base64Img === document.Img
      ) {
        submitRef.current.classList.add(style.shake);
        setTimeout(() => submitRef.current.classList.remove(style.shake), 200);
        return;
      }
      try {
        const { id } = document;
        const docRef = doc(db, "entertainment", id);
        setDoc(docRef, {
          Img: Base64Img,
          Name,
          Location,
          id,
        });
        push("/places/entertainment");
      } catch (error) {
        alert("please try again");
      }
    },
    [Base64Img, document.Location, document.Name, document.Img, document.id]
  );
  return (
    <>
      <Head>
        <title>edit a restaurant</title>
      </Head>
      <Suspense fallback={<div className="spinner"></div>}>
        <form onSubmit={handleSubmit}>
          <div className={style.Container}>
            <div>
              <Image
                className={style.previewImg}
                src={Base64Img}
                alt="insert a picture"
                width={100}
                height={100}
              />
              <input
                type={"file"}
                accept={"image/jpeg"}
                onChange={HandleInputChange}
              />
            </div>
            <input
              type={"text"}
              ref={(ref) => (NameRef.current = ref)}
              placeholder={"insert the name of the restaurant"}
            />
            <input
              type={"text"}
              ref={(ref) => (LocationRef.current = ref)}
              placeholder={"insert the location of the restaurant"}
            />
            <input type={"submit"} ref={(ref) => (submitRef.current = ref)} />
          </div>
        </form>
      </Suspense>
    </>
  );
}
export default Edit;
