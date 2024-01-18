import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MainButton from "../../Components/MainButton/MainButton";

const Home = () => {
   return (
      <React.Fragment>
         <section id="HomeSec" className="main-section w-100 vh-100   position-relative  overflow-hidden  ">
            <div className="HomeLayout"></div>

            <div className="row w-100  h-100   justify-content-start overflow-hidden  align-items-center align-items-center position-relative ">
               <div className="col-6  row justify-content-center  ">
                  {" "}
                  <motion.div className="   row justify-self-center m-auto position-relative w-100   justify-content-center overflow-hidden my-4  " style={{ zIndex: 9999 }}>
                     <motion.div className="div text-dark  m-auto  col-10  " style={{ marginRight: "60px" }}>
                        <h1 className="fw-bolder my-3 fs-2 w-100 text-center ">
                           <Link to="/" className="w-100">
                              <img src="images/logo-01.svg" alt="Logo is not here" className=" w-100" />
                           </Link>
                        </h1>
                        {/* <h3 className=" text-center my-2 " style={{}}>
                           <Typewriter
                              options={{
                                 strings: ["We Deliver Food", "We Deliver Health", "We Deliver Joy"],
                                 autoStart: true,
                                 loop: true,
                              }}
                           />
                        </h3> */}
                        <div className="   m-auto text-center  row m-0   justify-content-center align-items-center ">
                           <Link className=" col " to="/login">
                              <MainButton type="button" value="Login" moreCSS="fs-6" />
                           </Link>
                           <Link className="col  " to="/signUp">
                              <MainButton type="button" value="Signup" moreCSS="fs-6" />
                           </Link>
                           <Link className="col " to="/Guest">
                              <MainButton type="button" value="Guest" moreCSS="fs-6" />
                           </Link>
                        </div>
                     </motion.div>
                  </motion.div>
               </div>
               <div className="col-6 bg-danger "></div>
            </div>
         </section>
      </React.Fragment>
   );
};

export default Home;
