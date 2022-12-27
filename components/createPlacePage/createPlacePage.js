/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useCallback, useState, useRef } from "react";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/router";
import { setDoc, doc } from "firebase/firestore";
import { RouteContext } from "../../contexts";
import { FirebaseAppContext } from "../../pages/_app";
import { uuidv4 } from "@firebase/util";
import Head from "next/head";
import Image from "next/image";
import PreviewImg from "../public/-Insert_image_here-.svg.png";
import style from "../styles/createPlace.module.css";
function Create({ NavRoute }) {
  const [firstImg, setFirstImg] = useState(PreviewImg);
  const [secondImg, setSecondImg] = useState(PreviewImg);
  const [Triggered, setTriggered] = useState(false);
  const [PlacesToShow, setPlacesToShow] = useState([]);
  const pagination = {
    clickable: true,
    /**
     *
     * @param {number} index
     * @param {string} className
     * @returns
     */
    renderBullet: (index, className) => `<span class=${className}></span>`,
  };
  const { push } = useRouter();
  const { editRoute } = useContext(RouteContext);
  const { db } = useContext(FirebaseAppContext);
  const NameRef = useRef();
  const descriptionRef = useRef();
  const locationRef = useRef();
  const bookingSiteRef = useRef();
  const phoneNumRef = useRef();
  const siteRef = useRef();
  const ratingRef = useRef();
  const submitRef = useRef();
  useEffect(() => editRoute(`انشاء ${NavRoute}`), []);
  const HandleInputChange = useCallback(({ target }) => {
    if (!target.files.length || !target.files[0].name?.match(/\.jpe?g/)) return;
    const Reader = new FileReader();
    Reader.onload = ({ target: { result } }) =>
      target.dataset.imgplace === "first"
        ? setFirstImg(result)
        : setSecondImg(result);
    Reader.readAsDataURL(target.files[0]);
  }, []);
  const handleInputChecked = useCallback(
    ({
      target: {
        dataset: { translatedvalue },
        checked,
      },
    }) =>
      setPlacesToShow((prev) =>
        checked
          ? [...prev, { key: translatedvalue }]
          : [...prev.filter((i) => i.key !== translatedvalue)]
      ),
    []
  );
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { value: Name } = NameRef.current;
      const { value: description } = descriptionRef.current;
      const { value: location } = locationRef.current;
      const { value: bookingSite } = bookingSiteRef.current;
      const { value: phoneNum } = phoneNumRef.current;
      const { value: site } = siteRef.current;
      const { value: rating } = ratingRef.current;
      if (
        !Name ||
        !description ||
        !location ||
        !bookingSite ||
        !phoneNum ||
        !site ||
        !rating ||
        !PlacesToShow.length ||
        (firstImg || secondImg) === PreviewImg
      ) {
        submitRef.current.classList.add(style.shake);
        setTimeout(() => submitRef.current.classList.remove(style.shake), 200);
        return;
      }
      try {
        const id = uuidv4();
        const docRef = doc(db, "places", id);
        setDoc(docRef, {
          Img: [firstImg, secondImg],
          Name,
          description,
          location,
          bookingSite,
          phoneNum,
          site,
          rating,
          PlacesToShow,
          id,
        });
        push(`/places`);
      } catch (error) {
        alert("please try again");
      }
    },
    [firstImg, secondImg, PlacesToShow.length]
  );
  return (
    <>
      <Head>
        <title>Create an {"place"}</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <div className={style.Container}>
          <Swiper
            pagination={pagination}
            modules={[Pagination]}
            className="mySwiper"
            style={{ marginBottom: "15px" }}
          >
            <SwiperSlide>
              <label htmlFor="img1" className={style.inputBtn}>
                <div
                  className={style.imgPreviewer}
                  style={{
                    display: firstImg === PreviewImg ? "flex" : "none",
                  }}
                >
                  ضع صورة
                </div>
                <Image
                  className={style.previewImg}
                  src={firstImg}
                  style={{
                    display: firstImg === PreviewImg ? "none" : "block",
                  }}
                  alt="insert a picture"
                  width={100}
                  height={100}
                />
                <input
                  type={"file"}
                  id={"img2"}
                  className={style.fileImgInput}
                  data-imgplace={"second"}
                  accept={"image/jpeg"}
                  onChange={HandleInputChange}
                />
              </label>
            </SwiperSlide>
            <SwiperSlide>
              <label htmlFor="img2" className={style.inputBtn}>
                <div
                  className={style.imgPreviewer}
                  style={{
                    display: secondImg === PreviewImg ? "flex" : "none",
                  }}
                >
                  ضع صورة اخري
                </div>
                <Image
                  className={style.previewImg}
                  src={secondImg}
                  style={{
                    display: secondImg === PreviewImg ? "none" : "block",
                  }}
                  alt="insert a picture"
                  width={100}
                  height={100}
                />
              </label>
              <input
                type={"file"}
                id={"img1"}
                className={style.fileImgInput}
                accept={"image/jpeg"}
                data-imgplace={"first"}
                onChange={HandleInputChange}
              />
            </SwiperSlide>
          </Swiper>
          <label className="inputLabel">اسم المكان</label>
          <input type={"text"} ref={NameRef} />
          <label className="inputLabel">الوصف</label>
          <input type={"text"} ref={descriptionRef} />
          <label className="inputLabel">العنوان</label>
          <input type={"text"} ref={locationRef} />
          <label className="inputLabel">booking رابط موقع</label>
          <input type={"text"} ref={bookingSiteRef} />
          <label className="inputLabel">رقم الهاتف</label>
          <input type={"text"} ref={phoneNumRef} />
          <label className="inputLabel">رابط الموقع</label>
          <input type={"text"} ref={siteRef} />
          <label className="inputLabel">التقييم</label>
          <input type={"text"} ref={ratingRef} />
          <label className="inputLabel">القسم</label>
          <div className={style.dropDown}>
            <div
              className={style.dropDownHeader}
              onClick={() => setTriggered((prev) => !prev)}
            >
              <button
                type="button"
                style={{ transform: `rotate(${Triggered ? 180 : 0}deg)` }}
              >
                🡡
              </button>
              {PlacesToShow &&
                PlacesToShow.map((i, ind) => (
                  <div key={ind + 1} className={style.placeToShow}>
                    {i.key}
                  </div>
                ))}
            </div>
            <ul
              className={`${style.departmentsUl} ${
                Triggered ? style.showUl : ""
              } `}
            >
              <li>
              فنادق
                <input
                  type={"checkbox"}
                  value={"hotels"}
                  data-translatedvalue={"فنادق"}
                  onChange={handleInputChecked}
                />
              </li>
              <li>
              مطاعم
                <input
                  type={"checkbox"}
                  value={"restaurants"}
                  data-translatedvalue={"مطاعم"}
                  onChange={handleInputChecked}
                />
              </li>
              <li>
                عناوين مهمة
                <input
                  type={"checkbox"}
                  value={"Imp"}
                  data-translatedvalue={"عناوين مهمة"}
                  onChange={handleInputChecked}
                />
              </li>
            </ul>
          </div>
          <input type={"submit"} ref={submitRef} value="حفظ" />
        </div>
      </form>
    </>
  );
}
export default Create;
