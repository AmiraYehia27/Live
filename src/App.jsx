import React, { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AddProduct from "./ExistingCycle/AddNewProduct/AddProduct";
import AdminView from "./ExistingCycle/Admin/AdminView";
import ForgetPassword from "./ExistingCycle/Auth/ForgetPassword";
import Guest from "./ExistingCycle/Guest/Guest";
import GuestViewPage from "./ExistingCycle/Guest/GuestViewPage";
import Home from "./ExistingCycle/Main/Home";
import ItemAdjustment from "./ExistingCycle/ExistingItem/ItemAdjustment";
import ItemHistory from "./ExistingCycle/History/ItemHistory";
import Login from "./ExistingCycle/Auth/Login";
import MainPage from "./ExistingCycle/Main/MainPage";
import ProtectedRoutes from "./ExistingCycle/ProtectedRoutes/ProtectedRoutes";
import Signup from "./ExistingCycle/Auth/Signup";
import AdjustDiscription from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustDiscription";
import AdjustSupplier from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustSupplier";
import AdjustKit from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustKit";
import AdjustBypass from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustBypass";
import AdjustRelex from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustRelex";
import AdjustCost from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustCost";
import AdjustPrice from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustPrice";
import AdjustPricePerStore from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustPricePerStore";
import AdjustCustomerId from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustCustomerId";
import StarProducts from "./ExistingCycle/ExistingItem/Sub-Pages/StarProducts";
import AdjustActiveItems from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustActiveItems";
import AdjustWeb from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustWeb";
import Content from "./NewCycle/New-Product-Content/Content";
import PlanningQueue from "./NewCycle/PlanningPages/PlanningQueue";
import PlanningView from "./NewCycle/PlanningPages/PlanningView";
import ImageQueue from "./NewCycle/ContentImages/ImageQueue";
import ImageView from "./NewCycle/ContentImages/ImageView";
import ContentRejection from "./NewCycle/New-Product-Content/ContentRejection";
import CampaignQueue from "./NewCycle/Marketing/CampaignQueue";
import ViewCampaign from "./NewCycle/Marketing/ViewCampaign";
import ViewRunningCampaign from "./NewCycle/Marketing/ViewRunningCampaign";
import PageNotFound from "./ExistingCycle/4O4/PageNotFound";
import ViewUpcomingCampaign from "./NewCycle/Marketing/ViewUpcomingCampaign";
import ViewEndCampaign from "./NewCycle/Marketing/ViewEndCampaign";
import UserView from "./ExistingCycle/Admin/UserView";
import AdjustPriceBulk from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustPriceBulk";
import AdjustCostBulk from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustCostBulk";
import ContentContainer from "./NewCycle/New-Product-Content/ContentContainer";
import AssortmentQueue from "./NewCycle/BuyingPages/AssortmentQueue";
import AssortmentUpdate from "./NewCycle/BuyingPages/AssortmentUpdate";
import AdjustActiveBulk from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustActiveBulk";
import AdjustWebBulk from "./ExistingCycle/ExistingItem/Sub-Pages/AdjustWebBulk";
import packageJson from "../package.json";
import Report from "./NewCycle/Reporting/Report";
import './App.css'
import ReportProduct from "./NewCycle/Reporting/Reports/ReportProduct";
import ReportCost from "./NewCycle/Reporting/Reports/ReportCost";
import ReportApproval from "./NewCycle/Reporting/Reports/ReportApproval";
import ReportPrice from "./NewCycle/Reporting/Reports/ReportPrice";
import KVIScreen from "./NewCycle/KVIScreen/KVIScreen";
import Xproduct from "./NewCycle/ItemAcrul/Xproduct";

const App = () => {
  let [reportData, setReportData] = useState([])
  const emptyCache = useCallback(() => {
    let version = localStorage.getItem("version");
    if (version != packageJson.version) {
      if ("caches" in window) {
        caches.keys().then((names) => {
          // Delete all the cache files
          names.forEach((name) => {
            caches.delete(name);
          });
        });

        // Makes sure the page reloads. Changes are only visible after you refresh.
        window.location.reload(true);
      }

      localStorage.clear();
      localStorage.setItem("version", packageJson.version);
    }
  }, []);
  const getReportsData = (obj) => {
    console.log("obj from App", obj);
    setReportData(obj)

  }
  useEffect(() => {
    emptyCache();
  }, [emptyCache]);
  console.log("reportData", reportData)
  return (
    <React.Fragment>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/mainpage/kviscreen" element={<KVIScreen />} />
        <Route exact path="/mainpage/Xproduct" element={<Xproduct />} />
        <Route exact path="*" element={<PageNotFound />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/guest" element={<Guest />} />
        <Route exact path="/forgetpassword" element={<ForgetPassword />} />
        <Route exact path="/guest/:Id" element={<GuestViewPage />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoutes />}>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/mainpage" element={<MainPage ReportsData={getReportsData} />} />
          <Route exact path="/mainpage/adminview" element={<AdminView />} />
          <Route exact path="/mainpage/adminview/:Id" element={<UserView />} />
          <Route exact path="/mainpage/reports" element={<Report reportData={reportData} />} />
          <Route exact path="mainpage/reports/product" element={<ReportProduct />} />
          <Route exact path="/mainpage/reports/cost" element={<ReportCost />} />
          <Route exact path="/mainpage/reports/approval" element={<ReportApproval />} />
          <Route exact path="/mainpage/reports/prices" element={<ReportPrice />} />
          <Route
            exact
            path="/mainpage/itemhistory"
            element={<ItemHistory />}
          />
          <Route exact path="/mainpage/addproduct" element={<AddProduct />} />
          {/* Item Adjustment Start */}
          <Route
            exact
            path="/mainpage/itemadjust/:Param"
            element={<ItemAdjustment />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/description/:Id"
            element={<AdjustDiscription />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/supplier/:Id"
            element={<AdjustSupplier />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/kit/:Id"
            element={<AdjustKit />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/bypass/:Id"
            element={<AdjustBypass />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/relex/:Id"
            element={<AdjustRelex />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/costbulk"
            element={<AdjustCostBulk />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/cost/:Id"
            element={<AdjustCost />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/pricebulk"
            element={<AdjustPriceBulk />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/price/:Id"
            element={<AdjustPrice />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/active/:Id"
            element={<AdjustActiveItems />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/activebulk"
            element={<AdjustActiveBulk />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/webbulk"
            element={<AdjustWebBulk />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/web/:Id"
            element={<AdjustWeb />}
          />
          <Route
            exact
            path="/mainpage/itemadjust/pricePerStore"
            element={<AdjustPricePerStore />}
          />
          <Route
            exact
            path="/mainpage/customerId"
            element={<AdjustCustomerId />}
          />
          <Route
            exact
            path="/mainpage/StarProducts"
            element={<StarProducts />}
          />


          {/* Item Adjustment End  */}
          {/* Content Section Start */}
          <Route path="/mainpage/content/:Param" element={<Content />} />
          <Route
            exact
            path="/mainpage/content/:Param/:Id"
            element={<ContentContainer />}
          />
          <Route
            exact
            path="/mainpage/content/pqueue"
            element={<PlanningQueue />}
          />
          <Route
            exact
            path="/mainpage/content/pqueue/:Id"
            element={<PlanningView />}
          />
          <Route
            exact
            path="/mainpage/content/Aqueue"
            element={<AssortmentQueue />}
          />
          <Route
            exact
            path="/mainpage/content/Aqueue/:Id"
            element={<AssortmentUpdate />}
          />
          <Route
            exact
            path="/mainpage/content/Iqueue"
            element={<ImageQueue />}
          />
          <Route
            exact
            path="/mainpage/content/Iqueue/:Id"
            element={<ImageView />}
          />
          <Route
            exact
            path="/mainpage/content/CRqueue"
            element={<ContentRejection />}
          />
          <Route
            exact
            path="/mainpage/content/CAMqueue"
            element={<CampaignQueue />}
          />
          <Route
            exact
            path="/mainpage/content/Mediaqueue"
            element={<ViewCampaign />}
          />
          <Route
            exact
            path="/mainpage/content/RCAMqueue/:Id"
            element={<ViewRunningCampaign />}
          />
          <Route
            exact
            path="/mainpage/content/ECAMqueue/:Id"
            element={<ViewEndCampaign />}
          />
          <Route
            exact
            path="/mainpage/content/UCAMqueue/:Id"
            element={<ViewUpcomingCampaign />}
          />
          {/* Content Section End  */}
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default App;
