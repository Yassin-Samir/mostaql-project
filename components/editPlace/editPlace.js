import { setDoc, doc, getDoc } from "firebase/firestore";
import {
  useContext,
  useCallback,
  useState,
  useEffect,
  createRef,
  useMemo,
} from "react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";
import { FirebaseAppContext } from "../../pages/_app";
import { RouteContext } from "../../contexts";
import Head from "next/head";
import Image from "next/image";
import PreviewImg from "../public/-Insert_image_here-.svg.png";
import style from "../styles/createPlace.module.css";
function Edit({ NavRoute }) {
  const [Images, setImages] = useState([PreviewImg, PreviewImg]);
  const [PlacesToShow, setPlacesToShow] = useState([]);
  const [Triggered, setTriggered] = useState(false);
  const [firstImg, secondImg] = Images;
  const [document, setDocument] = useState({
    Img: ["", ""],
    Name: "",
    description: "",
    location: "",
    bookingSite: "",
    phoneNum: "",
    site: "",
    rating: "",
    PlacesToShow: [],
    id: "",
  });
  const {
    query: { id },
    isReady,
    push,
  } = useRouter();
  const [firstDocumentImg, secondDocumentImg] = document.Img;
  const pagination = {
    clickable: true,
    renderBullet: (index, className) => `<span class=${className}></span>`,
  };
  const { db } = useContext(FirebaseAppContext);
  const { editRoute } = useContext(RouteContext);
  const NameRef = useMemo(() => createRef(), []);
  const descriptionRef = useMemo(() => createRef(), []);
  const locationRef = useMemo(() => createRef(), []);
  const bookingSiteRef = useMemo(() => createRef(), []);
  const phoneNumRef = useMemo(() => createRef(), []);
  const siteRef = useMemo(() => createRef(), []);
  const ratingRef = useMemo(() => createRef(), []);
  const submitRef = useMemo(() => createRef(), []);
  useEffect(() => {
    editRoute(`${NavRoute} تعديل`);
    if (
      !isReady ||
      !id ||
      !(
        NameRef ||
        descriptionRef ||
        locationRef ||
        bookingSiteRef ||
        phoneNumRef ||
        siteRef ||
        submitRef
      ).current
    )
      return;
    const documentRef = doc(db, "places", id);
    (async () => {
      const docSnap = await getDoc(documentRef);
      const DocData = docSnap.data();
      if (!DocData) push("/404");
      const {
        Img,
        Name,
        location,
        description,
        bookingSite,
        phoneNum,
        site,
        rating,
        PlacesToShow,
      } = DocData;
      setDocument({ ...DocData });
      setImages(Img);
      setPlacesToShow([...PlacesToShow]);
      NameRef.current.value = Name;
      descriptionRef.current.value = description;
      locationRef.current.value = location;
      bookingSiteRef.current.value = bookingSite;
      phoneNumRef.current.value = phoneNum;
      siteRef.current.value = site;
      ratingRef.current.value = rating;
      window.document.querySelectorAll("li input").forEach((ele) => {
        console.log(
          !PlacesToShow.filter((i) => i.key === ele.dataset.translatedvalue)
            .length
        );
        if (
          !PlacesToShow.filter((i) => i.key === ele.dataset.translatedvalue)
            .length
        ) {
          return;
        }
        ele.checked = true;
      });
    })();
  }, [
    isReady,
    id,
    NameRef.current,
    submitRef.current,
    locationRef.current,
    bookingSiteRef.current,
    phoneNumRef.current,
    siteRef.current,
    ratingRef.current,
    submitRef.current,
  ]);
  const HandleInputChange = useCallback(({ target }) => {
    if (!target.files.length) return;
    if (!target.files[0].name?.match(/\.jpe?g/)) {
      alert("wrong file format was provided accept jpg or jpeg");
      return;
    }
    const Reader = new FileReader();
    Reader.onload = ({ target: { result } }) => {
      target.dataset.imgplace === "first"
        ? setImages((prev) => [result, prev[1]])
        : setImages((prev) => [prev[0], result]);
    };
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
        Name === document.Name &&
        description === document.description &&
        location === document.location &&
        bookingSite === document.bookingSite &&
        phoneNum === document.phoneNum &&
        rating === document.rating &&
        site === document.site &&
        firstImg === firstDocumentImg &&
        secondImg === secondDocumentImg
      ) {
        submitRef.current.classList.add(style.shake);
        setTimeout(() => submitRef.current.classList.remove(style.shake), 200);
        return;
      }
      try {
        const { id } = document;
        console.log({
          Img: Images,
          Name,
          description,
          location,
          bookingSite,
          phoneNum,
          site,
          rating,
          id,
          PlacesToShow,
        });
        const docRef = doc(db, "places", id);
        setDoc(docRef, {
          Img: Images,
          Name,
          description,
          location,
          bookingSite,
          phoneNum,
          site,
          rating,
          id,
          PlacesToShow,
        });
        push("/places/");
      } catch (error) {
        alert("please try again");
      }
    },
    [
      Images.length,
      document.id,
      document.Name,
      document.location,
      document.description,
      document.bookingSite,
      document.site,
      document.rating,
      document.phoneNum,
      document.PlacesToShow.length,
      firstDocumentImg,
      secondDocumentImg,
      locationRef.current,
      NameRef.current,
      descriptionRef.current,
      bookingSiteRef.current,
      siteRef.current,
      ratingRef.current,
      phoneNumRef.current,
      submitRef.current,
      firstImg,
      secondImg,
    ]
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
                <Image
                  className={style.previewImg}
                  src={firstImg}
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
                <Image
                  className={style.previewImg}
                  src={secondImg}
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
export default Edit;
