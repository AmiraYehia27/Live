import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const Services = () => {
   return (
      <React.Fragment>
         <section id="HomeSec" className="main-section vw-100 vh-100   position-relative  overflow-hidden  ">
            <div className="HomeLayout"></div>

            <div className="row justify-content-start text-center align-items-center align-content-center h-100 m-0 p-sm-5  ">
               <div className="col-md-6 ">
                  <motion.div className=" text-white col-md-8  " style={{ zIndex: 9999 }}>
                     <h1 className="fw-bolder my-1  ">
                        <Link to="/mainpage">
                           <img src="/itemcreation/images/logo-01.svg" alt="Logo is not here" className=" w-100" />
                        </Link>
                     </h1>
                  </motion.div>
               </div>
            </div>
         </section>
      </React.Fragment>
   );
};

export default Services;
