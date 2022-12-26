/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/router";
import { setDoc, doc } from "firebase/firestore";
import { RouteContext } from "../../contexts";
import { FirebaseAppContext } from "../../pages/_app";
import { uuidv4 } from "@firebase/util";
import Head from "next/head";
import Image from "next/image";
import PreviewImg from "../public/-Insert_image_here-.svg.png";
import style from "../styles/createPlace.module.css";
function CreateAnythingThanPlace({ collectionName, NavRoute }) {
  const [Img, setImg] = useState(PreviewImg);
  const { push } = useRouter();
  const { editRoute } = useContext(RouteContext);
  const { db } = useContext(FirebaseAppContext);
  const NameRef = useRef();
  const LocationRef = useRef();
  const submitRef = useRef();
  useEffect(() => editRoute(`انشاء ${NavRoute}`), []);
  const HandleInputChange = useCallback(({ target }) => {
    if (!target.files.length || !target.files[0].name?.match(/\.jpe?g/)) return;
    const Reader = new FileReader();
    Reader.onload = ({ target: { result } }) => setImg(result);
    Reader.readAsDataURL(target.files[0]);
  }, []);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { value: Location } = LocationRef.current;
      const { value: Name } = NameRef.current;
      if (!Location || !Name || Img === PreviewImg) {
        submitRef.current.classList.add(style.shake);
        setTimeout(() => submitRef.current.classList.remove(style.shake), 200);
        return;
      }
      try {
        const id = uuidv4();
        const docRef = doc(db, collectionName, id);
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
    [Img]
  );
  return (
    <>
      <Head>
        <title>Create an {collectionName.replace(/s$/, "")}</title>
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
              Select First Image
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
            ref={NameRef}
            placeholder={`insert the name of the ${collectionName.replace(
              /s$/,
              ""
            )}`}
          />
          <input
            type={"text"}
            ref={LocationRef}
            placeholder={`insert the location of the ${collectionName.replace(
              /s$/,
              ""
            )}`}
          />
          <input type={"submit"} ref={submitRef} />
        </div>
      </form>
    </>
  );
}
export default CreateAnythingThanPlace;
