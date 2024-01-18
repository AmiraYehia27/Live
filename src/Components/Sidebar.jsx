import React, { Fragment } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RiListUnordered, RiAddFill, RiH1 } from "react-icons/ri";
import { HiQueueList } from "react-icons/hi2";
import { HiAdjustments } from "react-icons/hi";
import { BiBookContent } from "react-icons/bi";
import { MdPreview, MdCampaign, MdOutlineAdminPanelSettings, MdHistory, MdOutlineLogout } from "react-icons/md";
import { BsCamera } from "react-icons/bs";
import { SlSocialFacebook } from "react-icons/sl";
const Sidebar = (props) => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  const [isHovered, setIsHovered] = useState(false);
  return (
    <React.Fragment>
      <motion.section
        id="SideBar"
        initial={{ width: "5vw" }}
        whileHover={{ width: "20vw" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className=" position-fixed   start-0 bottom-0  "
        style={{
          height: `${props.height}`,
          zIndex: 99999,
        }}
      >
        <Fragment>
          <ul
            className="sideCss list-group row flex-nowrap position-relative align-content-start align-items-start m-0 rounded-0 "
            style={{
              height: "100%",
              overflow: "scroll",
              backgroundColor: "#00a886",
            }}
          >
            <>
              {user.role_id === "1" ||
                user.role_id === "5" ||
                user.role_id === "7" ? (
                <motion.li
                  className="list-group-item col-12 row m-0 overflow-hidden border-0"
                  style={{ backgroundColor: "transparent" }}
                >
                  <Link
                    to="/mainpage/content/pqueue"
                    className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center  "
                  >
                    <motion.div className="w-25 ">
                      <RiListUnordered className="text-light fs-5 " />
                    </motion.div>
                    {isHovered && (
                      <motion.div
                        transition={{ duration: 0.3 }}
                        className="w-75 text-start text-white fs-6 "
                      >
                        Assortment Queue
                      </motion.div>
                    )}
                  </Link>
                </motion.li>
              ) : (
                ""
              )}
              {user.role_id === "1" ||
                user.role_id === "2" ||
                user.role_id === "7" ? (
                <motion.li
                  className="list-group-item col-12 row m-0 overflow-hidden border-0"
                  style={{ backgroundColor: "transparent" }}
                >
                  <Link
                    to="/mainpage/content/Aqueue"
                    className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center  "
                  >
                    <motion.div className="w-25 ">
                      <HiQueueList className="fs-5 text-light" />
                    </motion.div>
                    {isHovered && (
                      <motion.div
                        transition={{ duration: 0.3 }}
                        className="w-75 text-start text-white fs-6 "
                      >
                        Buying Queue
                      </motion.div>
                    )}
                  </Link>
                </motion.li>
              ) : (
                ""
              )}
              {user.role_id === "1" || user.role_id === "4" ? (
                <motion.li
                  className="list-group-item col-12 row m-0 overflow-hidden border-0"
                  style={{ backgroundColor: "transparent" }}
                >
                  <Link
                    to="/mainpage/content/Iqueue"
                    className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center  "
                  >
                    <motion.div className="w-25 ">
                      <BsCamera className="fs-5 text-light" />
                    </motion.div>
                    {isHovered && (
                      <motion.div
                        transition={{ duration: 0.3 }}
                        className="w-75 text-start text-white fs-6 "
                      >
                        Images Queue
                      </motion.div>
                    )}
                  </Link>
                </motion.li>
              ) : (
                ""
              )}
              {user.role_id === "1" || user.role_id === "3" ? (
                <motion.li
                  className="list-group-item col-12 row m-0 overflow-hidden border-0"
                  style={{ backgroundColor: "transparent" }}
                >
                  <Link
                    to="/mainpage/content/CRqueue"
                    className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center  "
                  >
                    <motion.div className="w-25 ">
                      <MdPreview className="fs-5 text-light" />
                    </motion.div>
                    {isHovered && (
                      <motion.div
                        transition={{ duration: 0.3 }}
                        className="w-75 text-start text-white fs-6 "
                      >
                        Content Review
                      </motion.div>
                    )}
                  </Link>
                </motion.li>
              ) : (
                " "
              )}
              {user.role_id === "1" || user.role_id === "6" ? (
                <motion.li
                  className="list-group-item col-12 row m-0 overflow-hidden border-0"
                  style={{ backgroundColor: "transparent" }}
                >
                  <Link
                    to="/mainpage/content/CAMqueue"
                    className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center  "
                  >
                    <motion.div className="w-25 ">
                      <SlSocialFacebook className="text-light fs-5" />
                    </motion.div>
                    {isHovered && (
                      <motion.div
                        transition={{ duration: 0.3 }}
                        className="w-75 text-start text-white fs-6 "
                      >
                        Media Buying Queue
                      </motion.div>
                    )}
                  </Link>
                </motion.li>
              ) : (
                ""
              )}
              {user.role_id === "1" ||
                user.role_id === "5" ||
                user.role_id === "6" ? (
                <motion.li
                  className="list-group-item col-12 row m-0 overflow-hidden border-0"
                  style={{ backgroundColor: "transparent" }}
                >
                  <Link
                    to="/mainpage/content/Mediaqueue"
                    className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center  "
                  >
                    <motion.div className="w-25 ">
                      <MdCampaign className="fs-5 text-light" />
                    </motion.div>
                    {isHovered && (
                      <motion.div
                        transition={{ duration: 0.3 }}
                        className="w-75 text-start text-white fs-6 "
                      >
                        Create Campaign
                      </motion.div>
                    )}
                  </Link>
                </motion.li>
              ) : (
                ""
              )}
              {user.role_id === "1" && user.name === "AhmedSaeed" ? (
                <motion.li
                  className="list-group-item col-12 row m-0 overflow-hidden border-0"
                  style={{ backgroundColor: "transparent" }}
                >
                  <Link
                    to={"/mainpage/adminview"}
                    className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center  "
                  >
                    <motion.div className="w-25 ">
                      <MdOutlineAdminPanelSettings className="fs-5 text-light" />
                    </motion.div>
                    {isHovered && (
                      <motion.div
                        transition={{ duration: 0.3 }}
                        className="w-75 text-start text-white fs-6 "
                      >
                        ADMIN VIEW
                      </motion.div>
                    )}
                  </Link>
                </motion.li>
              ) : (
                " "
              )}
              {user.role_id === "1" ||
                user.role_id === "2" ||
                user.role_id === "7" ? (
                <motion.li
                  className="list-group-item col-12 row m-0 overflow-hidden border-0"
                  style={{ backgroundColor: "transparent" }}
                >
                  <Link
                    to="/mainpage/addproduct"
                    className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center "
                  >
                    <motion.div className="w-25">
                      <RiAddFill className="fs-5 text-light" />
                    </motion.div>
                    {isHovered && (
                      <motion.div
                        transition={{ duration: 0.3 }}
                        className="w-75 text-start text-white fs-6 "
                      >
                        NEW PRODUCT
                      </motion.div>
                    )}
                  </Link>
                </motion.li>
              ) : (
                ""
              )}
              {user.role_id === "1" ||
                user.role_id === "2" ||
                user.role_id === "5" ||
                user.role_id === "7" ||
                user.role_id === "8"
                ? (
                  <motion.li
                    className="list-group-item col-12 row m-0 overflow-hidden border-0"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <Link
                      to="/mainpage/itemadjust/description"
                      className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center "
                    >
                      <motion.div className="w-25">
                        <HiAdjustments className="fs-5 text-light" />
                      </motion.div>
                      {isHovered && (
                        <motion.div
                          transition={{ duration: 0.3 }}
                          className="w-75 text-start text-white fs-6 "
                        >
                          ITEM ADJUSTMENT
                        </motion.div>
                      )}
                    </Link>
                  </motion.li>
                ) : (
                  ""
                )}
              {user.role_id === "1" || user.role_id === "3" ? (
                <motion.li
                  className="list-group-item col-12 row m-0 overflow-hidden border-0"
                  style={{ backgroundColor: "transparent" }}
                >
                  <Link
                    to="/mainpage/content/existing"
                    className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center "
                  >
                    <motion.div className="w-25">
                      <BiBookContent className="fs-5 text-light" />
                    </motion.div>
                    {isHovered && (
                      <motion.div
                        transition={{ duration: 0.3 }}
                        className="w-75 text-start text-white fs-6 "
                      >
                        CONTENT
                      </motion.div>
                    )}
                  </Link>
                </motion.li>
              ) : (
                ""
              )}

              <motion.li
                className="list-group-item col-12 row m-0 overflow-hidden border-0"
                style={{ backgroundColor: "transparent" }}
              >
                <Link
                  to="/mainpage/itemhistory"
                  className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center "
                >
                  <motion.div className="w-25">
                    <MdHistory className="fs-5 text-light" />
                  </motion.div>
                  {isHovered && (
                    <motion.div
                      transition={{ duration: 0.3 }}
                      className="w-75 text-start text-white fs-6 "
                    >
                      ITEM HISTORY
                    </motion.div>
                  )}
                </Link>
              </motion.li>

              <motion.li
                className="list-group-item col-12 row m-0 overflow-hidden border-0"
                style={{ backgroundColor: "transparent" }}
              >
                <Link
                  onClick={() => {
                    sessionStorage.removeItem("setIsAuth");
                    sessionStorage.removeItem("userData");
                  }}
                  to="/login"
                  refresh="true"
                  className="btn col-12 d-flex flex-nowrap overflow-hidden border-0 align-items-center "
                >
                  <motion.div className="w-25">
                    <MdOutlineLogout className="fs-5 text-light" />
                  </motion.div>
                  {isHovered && (
                    <motion.div
                      transition={{ duration: 0.3 }}
                      className="w-75 text-start text-white fs-6 "
                    >
                      LOG OUT
                    </motion.div>
                  )}
                </Link>
              </motion.li>
            </>
          </ul>
          <div
            className="  position-absolute"
            style={{
              width: "65vh",
              height: "90vh",
              backgroundColor: "#00000090",
            }}
          ></div>
        </Fragment>
      </motion.section>
    </React.Fragment>
  );
};

export default Sidebar;
