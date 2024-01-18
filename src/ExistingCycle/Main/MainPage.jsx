import React from "react";
import Sidebar from "../../Components/Sidebar";
import Services from "./Services";
import SidebarNew from "../../Components/SidebarNew";



const MainPage = (props) => {
   console.log("props", props.ReportsData)
   return (
      <React.Fragment>
         <SidebarNew reportsData={props.ReportsData} height={"100vh"} />
         <Services />
      </React.Fragment>
   );
};

export default MainPage;
