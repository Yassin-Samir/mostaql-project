/* eslint-disable react-hooks/exhaustive-deps */
import {
  useContext,
  useEffect,
  useCallback,
  useState,
  createRef,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { RouteContext } from "../../../contexts";
import { FirebaseAppContext } from "../../../pages/_app";
import Head from "next/head";
import Image from "next/image";
import style from "../../../styles/createPlace.module.css";
import PreviewImg from "../../../public/Screenshot 2022-12-26 212952.png";
import TickIcon from "../../../public/checklist.png";
function EditEvent() {
  const [Img, setImg] = useState(PreviewImg);
  const [selectedDiv, setSelectedDiv] = useState("0");
  const [document, setDocument] = useState({
    description: "",
    Location: "",
    color: "",
    Link: "",
    Img: "",
    id: "",
  });
  const selectedDivOnclickHandler = useCallback(
    ({ target }) => setSelectedDiv(target.dataset.index),
    []
  );
  const {
    query: { id },
    isReady,
    push,
  } = useRouter();
  const { editRoute } = useContext(RouteContext);
  const { db } = useContext(FirebaseAppContext);
  const locationRef = useMemo(() => createRef(), []);
  const descriptionRef = useMemo(() => createRef(), []);
  const LinkRef = useMemo(() => createRef(), []);
  const submitRef = useMemo(() => createRef(), []);
  const ImgRef = useMemo(() => createRef(), []);
  useEffect(() => {
    editRoute(`تعديل ${"حدث"}`);
    if (!isReady || !id || !(locationRef || descriptionRef || LinkRef).current)
      return;
    const documentRef = doc(db, "events", id);
    (async () => {
      const docSnap = await getDoc(documentRef);
      const DocData = docSnap.data();
      if (!DocData) push("/404");
      const { Img, description, Location, Link, color } = DocData;
      setDocument({ ...DocData });
      setImg(Img);
      console.log(DocData);
      setSelectedDiv(color);
      descriptionRef.current.value = description;
      LinkRef.current.value = Link;
      locationRef.current.value = Location;
    })();
  }, [
    isReady,
    id,
    submitRef.current,
    LinkRef.current,
    descriptionRef.current,
    locationRef.current,
  ]);
  const HandleInputChange = useCallback(
    ({ target }) => {
      if (!target.files.length || !target.files[0].name?.match(/\.jpe?g/))
        return;
      const Reader = new FileReader();
      Reader.onload = ({ target: { result } }) => setImg(result);
      Reader.readAsDataURL(target.files[0]);
    },
    [ImgRef.current]
  );
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { value: location } = locationRef.current;
      const { value: description } = descriptionRef.current;
      const { value: Link } = LinkRef.current;
      if (
        Img === document.Img &&
        location === document.Location &&
        description === document.description &&
        Link === document.Link &&
        selectedDiv === document.color
      ) {
        submitRef.current.classList.add(style.shake);
        setTimeout(() => submitRef.current.classList.remove(style.shake), 200);
        return;
      }
      try {
        const docRef = doc(db, "events", id);
        setDoc(docRef, {
          Img,
          description,
          Location: location,
          Link,
          id,
        });
        push("/events");
      } catch (error) {
        alert("please try again");
      }
    },
    [Img]
  );
  return (
    <>
      <Head>
        <title>Create an event</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <div className={style.Container}>
          <div className={style.inputImgContainer} style={{ width: "100%" }}>
            <label
              htmlFor="img1"
              className={`${style.ImginputBtn} ${style.imgPreviewer}`}
            >
              <Image
                className={style.previewImg}
                alt="previewed picture"
                src={Img}
                ref={ImgRef}
                width={100}
                height={100}
              />
            </label>
            <input
              type={"file"}
              id={"img1"}
              className={style.fileImgInput}
              accept={"image/jpeg"}
              onChange={HandleInputChange}
            />
          </div>
          <label htmlFor="eventLocation" className={style.inputLabel}>
            عنوان الحدث
          </label>
          <input type={"text"} id="eventLocation" ref={locationRef} />
          <label htmlFor="description" className={style.inputLabel}>
            الوصف
          </label>
          <textarea type={"text"} id={"description"} ref={descriptionRef} />
          <label htmlFor="link" className={style.inputLabel}>
            رابط
          </label>
          <input type={"text"} ref={LinkRef} id={"link"} />
          <div className={style.ColorContainer}>
            <div
              style={{ backgroundColor: "blue" }}
              data-index={"0"}
              className={selectedDiv === "0" ? style.selectedDiv : null}
              onClick={selectedDivOnclickHandler}
            >
              <Image alt="tick icon" src={TickIcon} />
            </div>
            <div
              style={{ backgroundColor: "green" }}
              data-index={"1"}
              className={selectedDiv === "1" ? style.selectedDiv : null}
              onClick={selectedDivOnclickHandler}
            >
              <Image alt="tick icon" src={TickIcon} />
            </div>
            <div
              style={{ backgroundColor: "pink" }}
              data-index={"2"}
              className={selectedDiv === "2" ? style.selectedDiv : null}
              onClick={selectedDivOnclickHandler}
            >
              <Image alt="tick icon" src={TickIcon} />
            </div>
            <div
              style={{ backgroundColor: "yellow" }}
              data-index={"3"}
              className={selectedDiv === "3" ? style.selectedDiv : null}
              onClick={selectedDivOnclickHandler}
            >
              <Image alt="tick icon" src={TickIcon} />
            </div>
          </div>
          <input
            type={"submit"}
            ref={submitRef}
            value={"حقظ"}
            className={style.submitBtn}
          />
        </div>
      </form>
    </>
  );
}
export default EditEvent;
