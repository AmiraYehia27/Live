import React from "react";
import styles from "./SubButton.module.css";
const SubButton = (props) => {
   return (
      <>
         <button type={props.type} disabled={props.disabled} className={`${styles.subButton} ${props.moreCSS}`} onClick={props.onClick}>
            {props.value}
         </button>
      </>
   );
};

export default SubButton;
