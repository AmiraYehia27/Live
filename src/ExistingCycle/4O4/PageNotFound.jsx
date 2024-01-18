import React from "react";
import { Link} from "react-router-dom";
const PageNotFound = () => {
   return (
      <React.Fragment>
         <section className=" position-relative" style={{ height: "100vh", backgroundColor: "#00A88610", overflowY: "scroll" }}>
            <div className="col-12 nav  navbar w-100 fixed-top  row  mb-5 " style={{ backgroundColor: "#00a886", height: "10%" }}>
               <h3 className="  col-4 text-center text-light  fw-bold">
                  <img src="/itemcreation/images/logo_white.png" alt="Logo" className="w-50" />
               </h3>
            </div>
            <div className="container h-100  ">
               <div className="row h-100 justify-content-center align-content-center align-item-center text-center">
                  <h1>404 Page Not Found </h1>

                  <Link to="/mainpage" className="col-2 G-link text-center btn-hover fs-3 text-decoration-none text-dark border border-top-0 border-start-0 border-end-0">
                     Home
                  </Link>
               </div>
            </div>
         </section>
      </React.Fragment>
   );
};

export default PageNotFound;
