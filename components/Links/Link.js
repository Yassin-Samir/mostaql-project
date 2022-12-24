import Styles from "./Link.module.css";
import { useRouter } from "next/navigation";
function LinkComponent({ children, Route }) {
  const { push } = useRouter();
  return (
    <div className={Styles.link} onClick={() => push(`/${Route}`)}>
      {children}
    </div>
  );
}
export default LinkComponent;
