import React, { Fragment } from "react";
import Sidebar from "../Sidebar";
import Nav from "./Nav";
import classes from "./Frame.module.css";
import SidebarNew from "../SidebarNew";
const Frame = (props) => {
   let user = JSON.parse(sessionStorage.getItem("userData"));
   const reportsData = () => {
      console.log('helloworld')
   }
   return (
      <Fragment>
         <Nav headerLabel={props.headerLabel} user={user} />
         <SidebarNew height={"90vh"} reportsData={reportsData} />
         <section className={`${classes.section}`}>
            <div className=" container-md  m-0 m-auto p-0 h-100">{props.children}</div>
         </section>
      </Fragment>
   );
};

export default Frame;
