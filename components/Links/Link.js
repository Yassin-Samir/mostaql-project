import Styles from "./Link.module.css";
import { useRouter } from "next/navigation";
function LinkComponent({ children, Route }) {
  const { push } = useRouter();
  return (
    <a href={`/${Route}`} onClick={(e) => e.preventDefault()}>
      <div
        className={Styles.link}
        onClick={(e) => {
          e.preventDefault();
          push(`/${Route}`);
        }}
      >
        {children}
      </div>
    </a>
  );
}
export default LinkComponent;
