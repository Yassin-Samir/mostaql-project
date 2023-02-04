import { setDoc, doc } from "firebase/firestore";
import {
  useContext,
  useCallback,
  useState,
  useEffect,
  createRef,
  useMemo,
  useLayoutEffect,
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
function Edit({ NavRoute, DocData }) {
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
  const [RecheckingDoc, setRecheckingDoc] = useState({
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
  const { push } = useRouter();
  const pagination = useMemo(
    () => ({
      clickable: true,
      renderBullet: (index, className) => `<span class=${className}></span>`,
    }),
    []
  );
  const { db } = useContext(FirebaseAppContext);
  const { editRoute } = useContext(RouteContext);
  const submitRef = useMemo(() => createRef(), []);
  const { Name, description, location, bookingSite, phoneNum, site, rating } =
    document;
  const [firstDocumentImg, secondDocumentImg] = RecheckingDoc.Img;
  useLayoutEffect(() => {
    if (!DocData) push("/404");
  }, []);
  useEffect(() => {
    editRoute(`${NavRoute} تعديل`);
    if (!submitRef.current) return;
    const { Img, PlacesToShow } = DocData;
    setDocument({ ...DocData });
    setRecheckingDoc({ ...DocData });
    setImages(Img);
    setPlacesToShow([...PlacesToShow]);
    window.document.querySelectorAll("li input").forEach((ele) => {
      if (!PlacesToShow.filter((i) => i.key === ele.value).length) {
        return;
      }
      ele.checked = true;
    });
  }, [submitRef.current, DocData, NavRoute]);
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
    ({ target: { checked, value } }) =>
      setPlacesToShow((prev) =>
        checked
          ? [...prev, { key: value }]
          : [...prev.filter((i) => i.key !== value)]
      ),
    []
  );
  const HasPlacesToShowChange = useCallback(
    (placeToShow) => {
      if (
        placeToShow.length &&
        placeToShow.length !== document.PlacesToShow.length
      )
        return true;

      for (let index = 0; index < placeToShow.length; index++) {
        const element = placeToShow[index];
        if (element.key === document.PlacesToShow[index].key) continue;
        return true;
      }
      return false;
    },
    [document.PlacesToShow.length]
  );
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const {
        Name,
        description,
        location,
        bookingSite,
        phoneNum,
        site,
        rating,
      } = document;
      const HasTheValueChanged = HasPlacesToShowChange(PlacesToShow);
      if (
        Name === RecheckingDoc.Name &&
        description === RecheckingDoc.description &&
        location === RecheckingDoc.location &&
        bookingSite === RecheckingDoc.bookingSite &&
        phoneNum === RecheckingDoc.phoneNum &&
        rating === RecheckingDoc.rating &&
        site === RecheckingDoc.site &&
        firstImg === firstDocumentImg &&
        secondImg === secondDocumentImg &&
        !HasTheValueChanged
      ) {
        submitRef.current.classList.add(style.shake);
        setTimeout(() => submitRef.current.classList.remove(style.shake), 200);
        return;
      }
      try {
        const { id } = RecheckingDoc;
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
          PlacesToShow: [...PlacesToShow],
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
          PlacesToShow: [...PlacesToShow],
        });
        push("/places/");
      } catch (error) {
        alert("please try again");
      }
    },
    [
      Images,
      PlacesToShow,
      RecheckingDoc.Name,
      RecheckingDoc.bookingSite,
      RecheckingDoc.description,
      RecheckingDoc.location,
      RecheckingDoc.phoneNum,
      RecheckingDoc.rating,
      RecheckingDoc.site,
      RecheckingDoc.id,
      document.Name,
      document.bookingSite,
      document.description,
      document.location,
      document.phoneNum,
      document.rating,
      document.site,
      document.id,
      firstDocumentImg,
      firstImg,
      secondDocumentImg,
      secondImg,
    ]
  );
  const handleInputChange = useCallback(
    ({
      target: {
        dataset: { name },
        value,
      },
    }) => {
      console.log("test");
      setDocument((prev) => ({ ...prev, [name]: value }));
    },
    []
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
          <input
            type={"text"}
            value={Name}
            data-name="Name"
            onChange={handleInputChange}
          />
          <label className="inputLabel">الوصف</label>
          <input
            type={"text"}
            value={description}
            data-name="description"
            onChange={handleInputChange}
          />
          <label className="inputLabel">العنوان</label>
          <input
            type={"text"}
            value={location}
            data-name="location"
            onChange={handleInputChange}
          />
          <label className="inputLabel">booking رابط موقع</label>
          <input
            type={"text"}
            value={bookingSite}
            data-name="bookingSite"
            onChange={handleInputChange}
          />
          <label className="inputLabel">رقم الهاتف</label>
          <input
            type={"text"}
            value={phoneNum}
            data-name="phoneNum"
            onChange={handleInputChange}
          />
          <label className="inputLabel">رابط الموقع</label>
          <input
            type={"text"}
            value={site}
            data-name="site"
            onChange={handleInputChange}
          />
          <label className="inputLabel">التقييم</label>
          <input
            type={"text"}
            value={rating}
            data-name="rating"
            onChange={handleInputChange}
          />
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
                  value={"فنادق"}
                  onChange={handleInputChecked}
                />
              </li>
              <li>
                مطاعم
                <input
                  type={"checkbox"}
                  value={"مطاعم"}
                  onChange={handleInputChecked}
                />
              </li>
              <li>
                عناوين مهمة
                <input
                  type={"checkbox"}
                  value={"عناوين مهمة"}
                  onChange={handleInputChecked}
                />
              </li>
              <li>
                ترفيه
                <input
                  type={"checkbox"}
                  value={"ترفيه"}
                  onChange={handleInputChecked}
                />
              </li>
              <li>
                سياحة
                <input
                  type={"checkbox"}
                  value={"سياحة"}
                  onChange={handleInputChecked}
                />
              </li>
              <li>
                تنقل
                <input
                  type={"checkbox"}
                  value={"تنقل"}
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
