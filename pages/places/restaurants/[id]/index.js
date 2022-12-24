import { setDoc, doc, getDoc } from "firebase/firestore";
import { useContext, useCallback, useState, useRef, useEffect } from "react";
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
  const LocationRef = useRef();
  const NameRef = useRef();
  const submitRef = useRef();
  useEffect(() => {
    if (!isReady) return;
    editRoute("تعديل مطعم");
    const documentRef = doc(db, "restaurants", id);
    (async () => {
      try {
        const docSnap = await getDoc(documentRef);
        const { Img, Name, Location } = docSnap.data();
        setDocument({ ...docSnap.data() });
        setBase64Img(Img);
        NameRef.current.value = Name;
        LocationRef.current.value = Location;
      } catch {
        push("/404");
      }
    })();
  }, [isReady, id]);
  const HandleInputChange = useCallback(({ target }) => {
    if (!target.files.length || !target.files[0].name?.match(/\.jpe?g/)) return;
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
        const docRef = doc(db, "restaurants", id);
        setDoc(docRef, {
          Img: Base64Img,
          Name,
          Location,
          id,
        });
        push("/places/restaurants");
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
      {document.Name ? (
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
              ref={NameRef}
              placeholder={"insert the name of the restaurant"}
            />
            <input
              type={"text"}
              ref={LocationRef}
              placeholder={"insert the location of the restaurant"}
            />
            <input type={"submit"} ref={submitRef} />
          </div>
        </form>
      ) : (
        <div className="spinner"></div>
      )}
    </>
  );
}
export default Edit;
