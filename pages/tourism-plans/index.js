import { MainPage,LinkComponent } from "../../components";
const TourismPage = () => (
  (<>
  <MainPage
    NavRoute={"خطط سياحية"}
    collectionName={"tourism-plans"}
    title={"tourism Plans"}
  /><LinkComponent Route={'tourism-plans/create'}>اضف</LinkComponent> </>)
);

export default TourismPage;
