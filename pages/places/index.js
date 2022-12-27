import { useContext, useEffect } from "react";
import { RouteContext } from "../../contexts";
import { LinkComponent } from "../../components";
import Head from "next/head";
import { usePathname } from "next/navigation";
function Places() {
  const pathName = usePathname();
  const { editRoute } = useContext(RouteContext);
  useEffect(() => editRoute("الاماكن"), []);
  return (
    <>
      <Head>
        <title>places</title>
      </Head>
      <LinkComponent Route={`${pathName.replace(/\//, "")}/restaurants`}>
        المطاعم
      </LinkComponent>
      <LinkComponent Route={`${pathName.replace(/\//, "")}/hotels`}>
        الفنادق
      </LinkComponent>
      <LinkComponent Route={`${pathName.replace(/\//, "")}/entertainment`}>
        ترفيه
      </LinkComponent>
      <LinkComponent Route={`${pathName.replace(/\//, "")}/tourism`}>
        السياحة
      </LinkComponent>
      <LinkComponent Route={`${pathName.replace(/\//, "")}/Imp`}>
        عناوين مهمة
      </LinkComponent>
      <LinkComponent Route={`${pathName.replace(/\//, "")}/transport`}>
        تنقل
      </LinkComponent>
      <LinkComponent Route={`${pathName.replace(/\//, "")}/create`}>
        انشاء مكان
      </LinkComponent>
    </>
  );
}
export default Places;
