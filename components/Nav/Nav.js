import { usePathname, useRouter } from "next/navigation";
import { useContext, useCallback, useMemo } from "react";
import { RouteContext } from "../../contexts";
import styles from "../styles/Nav.module.css";
function Nav() {
  const path = usePathname();
  const { push } = useRouter();
  const { route } = useContext(RouteContext);
  const RepeatedNumbersOfASpecialCharacter = useCallback(
    (str = "", ch = "") => {
      let NumberOfRepeatedCharacters = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] !== ch) continue;
        NumberOfRepeatedCharacters++;
      }
      return NumberOfRepeatedCharacters;
    },
    []
  );
  const NumberOfSlashesInARoute = useMemo(
    () => {
      if (!path) return;
      const number = RepeatedNumbersOfASpecialCharacter(path, "/");
      return number;
    },
    [path]
  );
  return (
    <nav className={styles.nav}>
      {path !== "/" && (
        <>
          <h3 className={styles.head}>{route}</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            onClick={(e) => {
              e.preventDefault();
              push(
                NumberOfSlashesInARoute === 1
                  ? "/"
                  : path.substring(0, path.lastIndexOf("/"))
              );
            }}
            className={styles.rightArrow}
          >
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
          </svg>
        </>
      )}
    </nav>
  );
}
export default Nav;
