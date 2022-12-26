import { setDoc, doc, getDoc } from "firebase/firestore";
import {
  useContext,
  useCallback,
  useState,
  useEffect,
  createRef,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import { FirebaseAppContext } from "../../pages/_app";
import { RouteContext } from "../../contexts";
import Head from "next/head";
import Image from "next/image";
import style from "../styles/createPlace.module.css";
function Edit({ collectionName, NavRoute }) {
  const [Img, setImg] = useState("");
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
    editRoute(`${NavRoute} تعديل`);
    if (!isReady || !id || !(LocationRef || submitRef || NameRef).current)
      return;
    const documentRef = doc(db, collectionName, id);
    (async () => {
      const docSnap = await getDoc(documentRef);
      const DocData = docSnap.data();
      if (!DocData) push("/404");
      const { Img, Name, Location } = DocData;
      setDocument({ ...DocData });
      setImg(Img);
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
    Reader.onload = ({ target: { result } }) => setImg(result);
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
        Img === document.Img
      ) {
        submitRef.current.classList.add(style.shake);
        setTimeout(() => submitRef.current.classList.remove(style.shake), 200);
        return;
      }
      try {
        const { id } = document;
        const docRef = doc(db, `${collectionName}`, id);
        setDoc(docRef, {
          Img,
          Name,
          Location,
          id,
        });
        push(`/${collectionName}`);
      } catch (error) {
        alert("please try again");
      }
    },
    [
      document.id,
      document.Name,
      document.Location,
      document.Img,
      LocationRef.current,
      NameRef.current,
      submitRef.current,
      Img,
    ]
  );
  return (
    <>
      <Head>
        <title>edit a {collectionName.replace(/s$/, "")}</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <div className={style.Container}>
          <Image
            className={style.previewImg}
            src={Img}
            alt="insert a picture"
            width={100}
            height={100}
          />
          <div className={style.inputImgContainer}>
            <label htmlFor="img1" className={style.inputBtn}>
              Edit First Image
            </label>
            <input
              type={"file"}
              id={"img1"}
              className={style.fileImgInput}
              accept={"image/jpeg"}
              onChange={HandleInputChange}
            />
          </div>
          <input
            type={"text"}
            ref={(ref) => (NameRef.current = ref)}
            placeholder={`insert the name of the ${collectionName.replace(
              /s/,
              ""
            )}`}
          />
          <input
            type={"text"}
            ref={(ref) => (LocationRef.current = ref)}
            placeholder={`insert the location of the ${collectionName.replace(
              /s/,
              ""
            )}`}
          />
          <input type={"submit"} ref={(ref) => (submitRef.current = ref)} />
        </div>
      </form>
    </>
  );
}
export default Edit;
