import React from "react";
import styles from "./MainButton.module.css";
const MainButton = (props) => {
   return (
      <>
         <button type={props.type} disabled={props.disabled} className={`${styles.mainButton} ${props.moreCSS}`} onClick={props.onClick}>
            {props.value}
         </button>
      </>
   );
};

export default MainButton;
