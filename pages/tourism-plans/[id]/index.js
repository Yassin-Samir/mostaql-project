/* eslint-disable react-hooks/exhaustive-deps */
import {
  useContext,
  useEffect,
  useCallback,
  useState,
  createRef,
  Fragment,
  useRef,
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
function EditTourismPlan() {
  const [Img, setImg] = useState(PreviewImg);
  const [document, setDocument] = useState({
    description: "",
    wayPoints: "",
    Location: "",
    price: "",
    Img: "",
    id: "",
  });
  const [Waypoints, setWaypoints] = useState([]);
  const {
    query: { id },
    isReady,
    push,
  } = useRouter();
  const { editRoute } = useContext(RouteContext);
  const { db } = useContext(FirebaseAppContext);
  const locationRef = useRef();
  const descriptionRef = useRef();
  const PriceRef = useRef();
  const submitRef = useRef();
  useEffect(() => {
    editRoute(`تعديل ${"حدث"}`);
    console.log("mounted");
    if (!isReady || !id || !(locationRef || descriptionRef || PriceRef).current)
      return;
    const documentRef = doc(db, "tourism-plans", id);
    (async () => {
      const docSnap = await getDoc(documentRef);
      const DocData = docSnap.data();
      console.log(DocData);
      if (!DocData) push("/404");
      const { Img, Location, description, price, wayPoints } = DocData;
      setDocument({
        ...DocData,
      });
      setWaypoints(
        wayPoints.map((i) => ({
          ...i,
          view: false,
        }))
      );
      setImg(Img);
      descriptionRef.current.value = description;
      PriceRef.current.value = price;
      locationRef.current.value = Location;
    })();
  }, [isReady, id]);
  const addWaypointHandler = useCallback(() => {
    setWaypoints((prev) => [
      ...prev,
      {
        location: " ",
        description: " ",
        picture: PreviewImg,
        view: false,
      },
    ]);
  }, []);
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
  /* const setDescriptionAndLocationToTheirInputValues = useCallback(() => {
    setWaypoints((prev) =>
      prev.map(
        ({
          location,
          description,
          picture,
          waypointDescriptionRef,
          waypointLocationRef,
        }) => {
          console.log(waypointLocationRef);
          console.log(waypointDescriptionRef);
          location = waypointLocationRef.current.value;
          description = waypointDescriptionRef.current.value;
          return {
            location,
            description,
            picture,
          };
        }
      )
    );
  }, []); */
  const IsAllWaypointValuesTrue = useCallback((wayPoints) => {
    let state = true;
    wayPoints.map((i, ind) => {
      for (const property in i) {
        if (!i[property] && property !== "view" && property !== "index") {
          state = false;
          break;
        }
        if (i[property] && ind === wayPoints.length - 1) {
          state = true;
        }
      }
    });
    return state;
  }, []);
  const HandleInputInWaypointsChange = useCallback(async ({ target }) => {
    const { index } = target.dataset;
    if (!target.files.length) return;
    if (!target.files[0]?.name.match(/\.jpe?g/)) {
      alert("not supported file type");
      return;
    }
    const base64ImgText = await ConvertToBase64(target.files[0]);
    setWaypoints((prev) => {
      return prev.map((i, ind) => {
        return ind != index ? { ...i } : { ...i, picture: base64ImgText };
      });
    });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const { value: location } = locationRef.current;
    const { value: description } = descriptionRef.current;
    const { value: price } = PriceRef.current;
    /* setDescriptionAndLocationToTheirInputValues(); */
    const IsAllWaypointValuesFilled = IsAllWaypointValuesTrue(Waypoints);
    /*  console.log("img", Img);
      console.log("location", location);
      console.log("description", description);
      console.log("price", price);
      console.log("test", IsAllWaypointValuesFilled); */
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
    console.log("passed validation");
    try {
      const docRef = doc(db, "tourism-plans", id);
      setDoc(docRef, {
        Img: document.Img,
        id: document.id,
        Location: locationRef.current.value,
        description: descriptionRef.current.value,
        price: PriceRef.current.value,
        wayPoints: Waypoints.map(({ location, description, picture }) => {
          return {
            location,
            description,
            picture,
          };
        }),
      });
      push("/tourism-plans");
    } catch (error) {
      alert(error);
    }
  };
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
              className={`${style.ImginputBtn} ${style.imgPreviewer}`}
            >
              <Image
                className={style.previewImg}
                alt="previewed picture"
                src={Img}
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
          {Waypoints &&
            Waypoints.map(
              (
                { picture: wayPointPicture, view, location, description },
                ind
              ) => (
                <Fragment key={ind + 1}>
                  <div
                    className={`${style.wayPoint}  ${view ? style.view : ""}`}
                  >
                    <div className={style.wayPointHeader}>
                      <button
                        data-index={ind}
                        onClick={({ target }) => {
                          console.log(target.dataset);
                          const { index } = target.dataset;
                          console.log("ind", index);
                          if (!Waypoints[index]) return;
                          setWaypoints((prev) => {
                            return prev.map((i, ind) => {
                              if (ind != index) return { ...i };
                              const { view } = i;
                              return { ...i, view: !view };
                            });
                          });
                        }}
                        style={{
                          transition: "transform 0.5s linear",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          cursor: "pointer",
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
                      value={location}
                      onChange={(e) => {
                        setWaypoints((prev) =>
                          prev.map((element, index) => {
                            if (index != ind) return { ...element };
                            return { ...element, location: e.target.value };
                          })
                        );
                      }}
                    />
                    <label htmlFor="description" className={style.inputLabel}>
                      الوصف
                    </label>
                    <textarea
                      type={"text"}
                      id={"description"}
                      value={description}
                      onChange={(e) => {
                        setWaypoints((prev) =>
                          prev.map((element, index) => {
                            if (index != ind) return { ...element };
                            return { ...element, description: e.target.value };
                          })
                        );
                      }}
                    />
                    <div className={style.inputImgContainer}>
                      <label
                        htmlFor={`waypointImg${ind}`}
                        className={`${style.ImginputBtn} ${style.imgPreviewer}`}
                      >
                        <Image
                          className={style.previewImg}
                          alt="previewed picture"
                          src={wayPointPicture}
                          width={100}
                          height={100}
                        />
                      </label>
                      <input
                        type={"file"}
                        id={`waypointImg${ind}`}
                        className={style.fileImgInput}
                        data-index={ind}
                        accept={"image/jpeg"}
                        onChange={HandleInputInWaypointsChange}
                      />
                    </div>
                  </div>
                </Fragment>
              )
            )}

          <button
            className={style.addWaypointBtn}
            onClick={addWaypointHandler}
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

export default EditTourismPlan;
