/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/router";
import { setDoc, doc } from "firebase/firestore";
import { RouteContext } from "../../../contexts";
import { FirebaseAppContext } from "../../../pages/_app";
import { uuidv4 } from "@firebase/util";
import Head from "next/head";
import Image from "next/image";
import style from "../../../styles/createPlace.module.css";
import PreviewImg from "../../../public/Screenshot 2022-12-26 212952.png";
import TickIcon from "../../../public/checklist.png";
function CreateEvent() {
  const [Img, setImg] = useState(PreviewImg);
  const [selectedDiv, setSelectedDiv] = useState("0");
  const selectedDivOnclickHandler = useCallback(({ target }) => {
    setSelectedDiv(target.dataset.index);
    console.log(selectedDiv === 1);
  }, []);
  const { push } = useRouter();
  const { editRoute } = useContext(RouteContext);
  const { db } = useContext(FirebaseAppContext);
  const locationRef = useRef();
  const descriptionRef = useRef();
  const LinkRef = useRef();
  const submitRef = useRef();
  const imgPreviewerRef = useRef();
  const ImgRef = useRef();
  useEffect(() => editRoute(`انشاء ${"حدث"}`), []);
  const HandleInputChange = useCallback(({ target }) => {
    if (!target.files.length || !target.files[0].name?.match(/\.jpe?g/)) return;
    const Reader = new FileReader();
    Reader.onload = ({ target: { result } }) => {
      imgPreviewerRef.current.style.display = "none";
      setImg(result);
      ImgRef.current.style.display = "block";
    };
    Reader.readAsDataURL(target.files[0]);
  }, []);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { value: location } = locationRef.current;
      const { value: description } = descriptionRef.current;
      const { value: Link } = LinkRef.current;
      if (!Img || !location || !description || !Link) {
        submitRef.current.classList.add(style.shake);
        setTimeout(() => submitRef.current.classList.remove(style.shake), 200);
        return;
      }
      try {
        const id = uuidv4();
        const docRef = doc(db, "events", id);
        setDoc(docRef, {
          Img,
          description,
          Location: location,
          Link,
          color: selectedDiv,
          id,
        });
        push(`/${"events"}`);
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
              <div ref={imgPreviewerRef}>اضف صورة</div>
              <Image
                className={style.previewImg}
                alt="previewed picture"
                src={Img}
                ref={ImgRef}
                style={{ display: "none" }}
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
export default CreateEvent;
