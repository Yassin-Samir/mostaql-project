/* eslint-disable react-hooks/exhaustive-deps */
import {
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
  createRef,
} from "react";
import { useRouter } from "next/router";
import { setDoc, doc } from "firebase/firestore";
import { RouteContext } from "../../../contexts";
import { FirebaseAppContext } from "../../../pages/_app";
import { uuidv4 } from "@firebase/util";
import Head from "next/head";
import Image from "next/image";
import style from "../../../styles/createPlace.module.css";
import PreviewImg from "../../../public/Screenshot 2022-12-26 212952.png";
function CreateEvent() {
  const [Img, setImg] = useState(PreviewImg);
  const [wayPoints, setWayPoints] = useState([]);
  const { push } = useRouter();
  const { editRoute } = useContext(RouteContext);
  const { db } = useContext(FirebaseAppContext);
  const locationRef = useRef();
  const descriptionRef = useRef();
  const submitRef = useRef();
  const PriceRef = useRef();
  useEffect(() => editRoute("انشاء حدث"), []);
  const ConvertToBase64 = useCallback(async (blob) => {
    const Base64Promise = new Promise((resolve, reject) => {
      const Reader = new FileReader();
      Reader.onload = ({ target: { result } }) => resolve(result);
      Reader.readAsDataURL(blob);
    });
    return await Base64Promise;
  }, []);
  const HandleInputChange = useCallback(async ({ target }) => {
    if (!target.files.length || !target.files[0].name?.match(/\.jpe?g/)) return;
    setImg(await ConvertToBase64(target.files[0]));
  }, []);
  const setDescriptionAndLocationToTheirInputValues = useCallback(() => {
    setWayPoints((prev) => {
      return prev.map((i) => ({
        ...i,
        location: i.waypointLocationRef.current.value,
        description: i.waypointLocationRef.current.value,
      }));
    });
  }, []);
  const IsAllWaypointValuesTrue = useCallback(() => {
    let state = true;
    wayPoints.map((i, ind) => {
      for (const property in i) {
        if (!i[property] && property !== "view" && property !== "index") {
          state = false;
          break;
        }
        if (i[property] && ind === wayPoints.length - 1) {
          console.log("true");
          state = true;
        }
      }
    });
    return state;
  }, []);
  const ShowWayPoint = useCallback(
    ({ target }) => {
      const { index } = target?.dataset;
      if (!wayPoints[index]) return;
      setWayPoints((prev) => {
        return prev.map((i, ind) => {
          const { view } = i;
          return ind == index ? { ...i, view: !view } : { ...i };
        });
      });
    },
    [wayPoints.length]
  );
  const HandleInputInWaypointsChange = useCallback(async ({ target }) => {
    if (!target.files.length) return;
    if (!target.files[0]?.name.match(/\.jpe?g/)) {
      alert("not supported file type");
      return;
    }
    const { index } = target.dataset;
    const base64ImgText = await ConvertToBase64(target.files[0]);
    setWayPoints((prev) => {
      return prev.map((i, ind) => {
        return index != ind
          ? { ...i }
          : {
              ...i,
              picture: base64ImgText,
            };
      });
    });
  }, []);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { value: location } = locationRef.current;
      const { value: description } = descriptionRef.current;
      const { value: price } = PriceRef.current;
      const test = setDescriptionAndLocationToTheirInputValues();
      const IsAllWaypointValuesFilled = IsAllWaypointValuesTrue(wayPoints);
      console.log("img", Boolean(Img));
      console.log(Boolean(location));
      console.log(Boolean(description));
      console.log(Boolean(price));
      console.log(IsAllWaypointValuesFilled);
      if (
        !Img ||
        !location ||
        !description ||
        !price ||
        !IsAllWaypointValuesFilled
      ) {
        submitRef.current.classList.add(style.shake);
        setTimeout(() => submitRef.current.classList.remove(style.shake), 200);
        return;
      }
      try {
        const id = uuidv4();
        const docRef = doc(db, "tourism-plans", id);
        setDoc(docRef, {
          Img,
          description,
          Location: location,
          price,
          wayPoints: wayPoints.map(({ location, description, picture }) => ({
            location,
            description,
            picture,
          })),
          id,
        });
        push("/tourism-plans");
      } catch (error) {
        alert("please try again");
      }
    },
    [Img, wayPoints.length]
  );
  return (
    <>
      <Head>
        <title>Create an event</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <div className={style.Container}>
          <div className={style.inputImgContainer}>
            <label
              htmlFor="MainImg"
              className={`${style.ImginputBtn} ${style.ImgPreviewer}`}
            >
              <div style={{ display: Img === PreviewImg ? "flex" : "none" }}>
                صورة الرئيسية
              </div>
              <Image
                className={style.previewImg}
                alt="previewed picture"
                src={Img}
                style={{ display: Img === PreviewImg ? "none" : "block" }}
                width={100}
                height={100}
              />
            </label>
            <input
              type={"file"}
              id={"MainImg"}
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
          <label htmlFor="price" className={style.inputLabel}>
            السعر
          </label>
          <input type={"text"} id={"price"} ref={PriceRef} />
          {wayPoints &&
            wayPoints.map(
              (
                {
                  picture: wayPointPicture,
                  waypointLocationRef,
                  waypointDescriptionRef,
                  view,
                },
                ind
              ) => (
                <div
                  className={`${style.wayPoint} ${view ? style.view : ""}`}
                  key={ind + 1}
                >
                  <div className={style.wayPointHeader}>
                    <button
                      data-index={ind}
                      onClick={ShowWayPoint}
                      style={{
                        transition: "transform 0.5s linear",
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        transform: `rotate(${view ? "180deg" : "0"})`,
                      }}
                      type="button"
                    >
                      🡡
                    </button>
                    <p> ({ind + 1})الوجهة </p>
                  </div>
                  <label htmlFor="location" className={style.inputLabel}>
                    عنوان الوجهة
                  </label>
                  <input
                    type={"text"}
                    id={"location"}
                    ref={waypointLocationRef}
                  />
                  <label htmlFor="description" className={style.inputLabel}>
                    الوصف
                  </label>
                  <textarea
                    type={"text"}
                    id={"description"}
                    ref={waypointDescriptionRef}
                  />
                  <div className={style.inputImgContainer}>
                    <label
                      htmlFor={`waypointImg${ind}`}
                      className={`${style.ImginputBtn} ${style.ImgPreviewer}`}
                    >
                      <div
                        style={{
                          display:
                            wayPointPicture !== PreviewImg ? "none" : "flex",
                        }}
                      >
                        صورة الرئيسية
                      </div>
                      <Image
                        className={style.previewImg}
                        alt="previewed picture"
                        src={wayPointPicture}
                        style={{
                          display:
                            wayPointPicture === PreviewImg ? "none" : "block",
                        }}
                        width={100}
                        height={100}
                      />
                    </label>
                    <input
                      type={"file"}
                      id={`waypointImg${ind}`}
                      className={style.fileImgInput}
                      accept={"image/jpeg"}
                      data-index={ind}
                      onChange={HandleInputInWaypointsChange}
                    />
                  </div>
                </div>
              )
            )}

          <button
            className={style.addWaypointBtn}
            onClick={() => {
              setWayPoints((prev) => [
                ...prev,
                {
                  location: "",
                  waypointLocationRef: createRef(),
                  description: "",
                  waypointDescriptionRef: createRef(),
                  picture: PreviewImg,
                  view: false,
                },
              ]);
            }}
            type="button"
          >
            اضف وجهة
          </button>
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
