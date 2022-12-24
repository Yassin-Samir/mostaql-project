/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/router";
import { setDoc, doc } from "firebase/firestore";
import { RouteContext } from "../../../../contexts";
import { FirebaseAppContext } from "../../../_app";
import { uuidv4 } from "@firebase/util";
import Head from "next/head";
import Image from "next/image";
import style from "../../../../styles/createRestaurant.module.css";
import PreviewImg from "../../../../public/-Insert_image_here-.svg.png";
function Create() {
  const [Base64Img, setBase64Img] = useState(PreviewImg);
  const { push } = useRouter();
  const { editRoute } = useContext(RouteContext);
  const { db } = useContext(FirebaseAppContext);
  const NameRef = useRef();
  const LocationRef = useRef();
  const submitRef = useRef();
  useEffect(() => editRoute("انشاء تنقل"), []);
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
      if (!Location || !Name || Base64Img === PreviewImg) {
        submitRef.current.classList.add(style.shake);
        setTimeout(() => submitRef.current.classList.remove(style.shake), 200);
        return;
      }
      try {
        const id = uuidv4();
        const docRef = doc(db, "transport", id);
        setDoc(docRef, {
          Img: Base64Img,
          Name,
          Location,
          id,
        });
        push("/places/transport");
      } catch (error) {
        alert("please try again");
      }
    },
    [Base64Img]
  );
  return (
    <>
      <Head>
        <title>Create a restaurant</title>
      </Head>
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
    </>
  );
}
export default Create;
