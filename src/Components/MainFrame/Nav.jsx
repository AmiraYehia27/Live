import React, { Fragment } from "react";
import classes from "./Frame.module.css";
const Nav = (props) => {
   return (
      <Fragment>
         <nav className={`col-12  ${classes.nav}  navbar w-100  row m-0 p-0 align-items-center align-content-center `} style={{ backgroundColor: "#00a886", height: "10vh" , fontStyle: "italic"}}>
            
            <h3 className=" d-sm-none d-md-block   col-4 text-center text-light fw-bold m-0">
               <img src="/itemcreation/images/logo_white.png" alt="Logo" className={` ${classes.img}  m-0 `} />
            </h3>
            <h3 className="  col-4 text-center text-light fw-bold my-0 ">
               <span className={` mx-2 w-25 h-25 bg-gray  p-2 rounded-circle ${classes.label} `}>{props.user.name.split(' ')[0].split('')[0].toUpperCase() }{props.user.name.split(' ')[1].split('')[0].toUpperCase()}</span>
                :
               <span className=" mx-2 col-4 text-center text-light   fw-bold m-0">{props.headerLabel || "label"} </span>
            </h3>
         </nav>
      </Fragment>
   );
};

export default Nav;

//  {props.user.name !== null ? props.user.name : ""}
