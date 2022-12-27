import { MainPage, LinkComponent } from "../../components";
const TourismPage = () => (
  <>
    <MainPage NavRoute={"احداث"} collectionName={"events"} title={"events"} />
    <LinkComponent Route={"events/create"}>اضف</LinkComponent>
  </>
);

export default TourismPage;
