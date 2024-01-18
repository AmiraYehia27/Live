import React from "react";

const Spinner = () => {
   return (
      <React.Fragment>
         <div style={{ zIndex: 9999999, backgroundColor: "#00a88610" }} className="  spinner position-absolute w-100 top-0 bottom-0 end-0 start-0 d-flex align-items-center justify-content-center align-content-center">
            <div className="  text-center" style={{ color: "#00a886" }}>
               <i className="fa-solid fa-cog fa-spin fs-1 "></i>
            </div>
         </div>
      </React.Fragment>
   );
};

export default Spinner;
