/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState, useCallback, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FirebaseAppContext } from "../../pages/_app";
import { doc, deleteDoc } from "firebase/firestore";
import style from "./restraurant.module.css";
import Image from "next/image";
import More from "./more.png";
function Restaurant({ Img, Location, Name, id }) {
  const [option, setOption] = useState(false);
  const { db } = useContext(FirebaseAppContext);
  const { push } = useRouter();
  const path = usePathname();
  const SetOptionFunction = useCallback((prev) => !prev, []);
  const DeleteDoc = useCallback(() => {
    try {
      deleteDoc(doc(db, path.replace(/([^/?]+)\/+/, "").replace(/\//, ""), id));
      setOption(SetOptionFunction);
    } catch (error) {
      console.log("err", error);
    }
  }, [id]);
  return (
    <div className={style.restaurant}>
      <Image
        className={style.more}
        src={More}
        alt="three dot sign"
        onClick={() => setOption(SetOptionFunction)}
      />
      <div className={`${style.options} ${option ? style.view : style.hide}`}>
        <p onClick={() => push(`${path}/${id}`)}>تعديل</p>
        <p onClick={DeleteDoc}>اخفاء</p>
      </div>
      <div className={style.information}>
        <h6>{Name}</h6>
        <Image
          src={Img}
          alt="restaurant Img"
          width={100}
          height={100}
          className={style.restaurantImg}
        />
        <div>
          <p className={style.address}>{Location}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className={style.locationIcon}
          >
            <g fill="#134563">
              <path d="m32 55.7-.9-1.1c-.6-.8-15.9-18.7-15.9-29.4 0-9.3 7.6-16.8 16.8-16.8S48.8 16 48.8 25.2c0 10.7-15.3 28.7-15.9 29.4l-.9 1.1zm0-45c-8 0-14.4 6.5-14.4 14.4 0 8.4 11.1 22.7 14.4 26.8 3.3-4.1 14.4-18.3 14.4-26.8 0-7.9-6.4-14.4-14.4-14.4z" />
              <path d="M32 31.6c-3.5 0-6.4-2.9-6.4-6.4s2.9-6.4 6.4-6.4 6.4 2.9 6.4 6.4-2.9 6.4-6.4 6.4zm0-10.4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
export default memo(Restaurant);
