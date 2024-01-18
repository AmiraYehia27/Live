import React from "react";
import {
  MdDescription,
  MdPriceChange,
  MdPriceCheck,
  MdOnlinePrediction,
} from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import { RiNumber0, RiNumber1 } from "react-icons/ri";
import { FaStore, FaLayerGroup } from "react-icons/fa";
import { BsBagCheckFill } from "react-icons/bs";
import { TbLetterR } from "react-icons/tb";
import { VscVmActive } from "react-icons/vsc";
import { AiOutlinePercentage } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../Components/Sidebar";

import MainButton from "../../Components/MainButton/MainButton";
import { useCallback } from "react";
import { fetchDataItem } from "./CustomHooks/getItemData";
import swal from "sweetalert";
import SidebarNew from "../../Components/SidebarNew";
const ItemAdjustment = () => {
  //get the user role.
  let user = JSON.parse(sessionStorage.getItem("userData"));
  console.log(user)

  let { Param } = useParams();
  // Using the useParams hook from React Router, we are extracting the value of the dynamic parameter from the URL and assigning it to the Param variable.
  const [itemAdjustState, SetItemAdjustmentState] = useState({
    loading: false,
    fetchedProduct: [],
    query: "",
    isHovered: false,
    paramName: Param,
    isFetched: false,
  });
  //We are initializing a state variable itemAdjustState using the useState hook, which has an object containing various properties and their initial values. The SetItemAdjustmentState function is used to modify the state value.
  const getProductData = useCallback(async () => {
    try {
      if (itemAdjustState.query !== "") {
        SetItemAdjustmentState((prev) => {
          return { ...prev, loading: true };
        });
        let response = await fetchDataItem(itemAdjustState.query);
        if (response) {
          SetItemAdjustmentState((prev) => {
            return {
              ...prev,
              loading: false,
              fetchedProduct: response.data.description,
              isFetched: true,
              query: "",
            };
          });
        }
      }
    } catch (err) {
      swal({
        text: "Couldn't Fetch The Data Please Try Again",
        icon: "error",
      });
      SetItemAdjustmentState((prev) => {
        return { ...prev, loading: false, query: "" };
      });
    }
  }, [itemAdjustState.query]);
  //We are defining a function getProductData using the useCallback hook. This function is used to fetch data from an API when itemAdjustState.query changes. This function is memoized and only re-created if itemAdjustState.query changes.
  useEffect(() => {
    SetItemAdjustmentState((prev) => {
      return { ...prev, paramName: Param };
    });
  }, [Param]);
  //We are using the useEffect hook to update the paramName property in the itemAdjustState state object when the value of Param changes.
  const handleQueryChange = (e) => {
    SetItemAdjustmentState((prev) => {
      return { ...prev, query: e.target.value, isFetched: false };
    });
  };
  //We are defining a function handleQueryChange that updates the query property in the itemAdjustState state object with the value entered in the input field.
  let { fetchedProduct, loading, query, paramName, isHovered, isFetched } =
    itemAdjustState;
  // We are extracting the properties from the itemAdjustState object using object destructuring and assigning them to variables.
  const reportsData = () => {
    console.log('helloworld')
 }
  return (
    <React.Fragment>
      <SidebarNew height="90vh" reportsData={reportsData} />
      <nav
        className="navbar fixed-top    "
        style={{ backgroundColor: "#00a886", height: "10vh" }}
      >
        <div className="container-fluid  row m-0 p-0 align-items-center">
          <div className="logo-img col d-none d-md-block   ">
            <img
              src="/itemcreation/images/logo_white.png"
              alt="Logo"
              className="w-100     "
            />
          </div>
          <div className="    col-10    ">
            <ul className="navbar-nav row align-items-center justify-content-evenly my- p-0  position-relative  list-group-horizontal">
              <li className="   col-4 col-md-5  fs-5  text-center   ">
                <input
                  value={query}
                  onChange={(e) => {
                    handleQueryChange(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getProductData();
                    }
                  }}
                  onBlur={() => {
                    getProductData();
                  }}
                  onClick={() => {
                    SetItemAdjustmentState((prev) => {
                      return { ...prev, isFetched: false };
                    });
                  }}
                  name="text"
                  type="text"
                  className="form-control rounded-3 p-0 m-0 px-1 "
                  placeholder=" Search SKU"
                />
              </li>
              <li className="  col-4 col-md-5  fs-5  text-center   "></li>
            </ul>
          </div>
        </div>
      </nav>
    
           <motion.ul
            initial={{ width: "5vw" }}
            whileHover={{ width: "20vw" }}
            onHoverStart={() => {
              SetItemAdjustmentState((prev) => {
                return { ...prev, isHovered: true };
              });
            }}
            onHoverEnd={() => {
              SetItemAdjustmentState((prev) => {
                return { ...prev, isHovered: false };
              });
            }}
            className="navbar-nav p-3 row align-items-center justify-content-evenly  position-fixed  end-0    list-group-virtical "
            style={{
              backgroundColor: "#00a886",
              height: "90vh",
              zIndex: "9999",
              top: "10vh",
            }}
          >
            <li className=" col  fs-5  text-center   ">
              <Link
                onClick={() => {
                  SetItemAdjustmentState((prev) => {
                    return { ...prev, isFetched: false };
                  });
                }}
                to="/mainpage/itemadjust/description"
                name="description"
                className={` text-light text-decoration-none  navLink`}
              >
                {isHovered ? "Description" : <MdDescription />}
              </Link>
            </li>
            <li className=" col   fs-5 text-center    ">
              <Link
                onClick={() => {
                  SetItemAdjustmentState((prev) => {
                    return { ...prev, isFetched: false };
                  });
                }}
                to="/mainpage/itemadjust/supplier"
                name="supplier"
                className={` text-light text-decoration-none  navLink`}
              >
                {isHovered ? "Supplier" : <FaStore />}
              </Link>
            </li>
            <li className=" col    fs-5  text-center   ">
              <Link
                onClick={() => {
                  SetItemAdjustmentState((prev) => {
                    return { ...prev, isFetched: false };
                  });
                }}
                to="/mainpage/itemadjust/kit"
                name="kit"
                className={` text-light text-decoration-none  navLink`}
              >
                {isHovered ? "KIT" : <FaLayerGroup />}
              </Link>
            </li>
            <li className=" col  fs-5  text-center   ">
              <Link
                onClick={() => {
                  SetItemAdjustmentState((prev) => {
                    return { ...prev, isFetched: false };
                  });
                }}
                to="/mainpage/itemadjust/bypass"
                name="bypass"
                className={` text-light text-decoration-none  navLink`}
              >
                {isHovered ? "Bypass" : <BsBagCheckFill />}
              </Link>
            </li>
            <li className=" col   fs-5  text-center   ">
              <Link
                onClick={() => {
                  SetItemAdjustmentState((prev) => {
                    return { ...prev, isFetched: false };
                  });
                }}
                to="/mainpage/itemadjust/relex"
                name="relex"
                className={` text-light text-decoration-none  navLink`}
              >
                {isHovered ? "Relex" : <TbLetterR />}
              </Link>
            </li>
            <li className=" col   fs-5  text-center   ">
              <Link
                onClick={() => {
                  SetItemAdjustmentState((prev) => {
                    return { ...prev, isFetched: false };
                  });
                }}
                to="/mainpage/itemadjust/cost"
                name="cost"
                className={` text-light text-decoration-none  navLink`}
              >
                {isHovered ? "Cost" : <MdPriceChange />}
              </Link>
            </li>
            <li className=" col   fs-5  text-center   ">
              <Link
                onClick={() => {
                  SetItemAdjustmentState((prev) => {
                    return { ...prev, isFetched: false };
                  });
                }}
                to="/mainpage/itemadjust/price"
                name="price"
                className={` text-light text-decoration-none  navLink`}
              >
                {isHovered ? "Price" : <MdPriceCheck />}
              </Link>
            </li>
            <li className=" col   fs-5  text-center   ">
              <Link
                onClick={() => {
                  SetItemAdjustmentState((prev) => {
                    return { ...prev, isFetched: false };
                  });
                }}
                to="/mainpage/itemadjust/pricePerStore"
                name="price"
                className={` text-light text-decoration-none  navLink`}
              >
                {isHovered ? "Price Per Store" : <AiOutlinePercentage />}
              </Link>
            </li>
            <li className=" col    fs-5  text-center   ">
              <Link
                onClick={() => {
                  SetItemAdjustmentState((prev) => {
                    return { ...prev, isFetched: false };
                  });
                }}
                to="/mainpage/itemadjust/active"
                name="active"
                className={` text-light text-decoration-none  navLink`}
              >
                {isHovered ? "Active" : <VscVmActive />}
              </Link>
            </li>
            <li className=" col    fs-5  text-center   ">
              <Link
                onClick={(e) => { }}
                to="/mainpage/itemadjust/web"
                name="web"
                className={`  text-light text-decoration-none  navLink`}
              >
                {isHovered ? "Web" : <MdOnlinePrediction />}
              </Link>
            </li>
            {/* <li className="col fs-5 text-center">
              <Link
                onClick={(e) => { }}
                to="/mainpage/itemadjust/customerId"
                name="customerId"
                className={`text-light text-decoration-none navLink`}
              >
                {isHovered ? (
                  "Customer ID"
                ) : (
                  <div className="d-flex align-items-center">
                    <FaUserLarge className="mr-5" />
                    <RiNumber0 />
                    <RiNumber1 />
                  </div>
                )}
              </Link>
            </li> */}
            {/* <li className="col fs-5 text-center">
              <Link
                onClick={(e) => { }}
                to="/mainpage/itemadjust/StarProducts"
                name="StarProducts"
                className={`text-light text-decoration-none navLink`}
              >
                {isHovered ? (
                  "Star Products"
                ) : (
                  <div className="d-flex align-items-center">
                    <RiNumber1 />
                  </div>
                )}
              </Link>
            </li> */}
          </motion.ul>

      

      <section
        id=""
        className=" position-relative d-flex justify-content-center align-items-center vh-100  "
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          backgroundColor: "#00a88610",
        }}
      >
        <div
          className=" h-100 d-flex justify-content-center align-items-center w-100   "
          style={{ overflowY: "scroll", overflowX: "hidden" }}
        >
          <div
            className="container mt-5 rounded-3 w-100    "
            style={{ overflowY: "scroll", maxHeight: "80vh" }}
          >
            {loading === false ? (
              <div className="">
                <div className="row   m-auto  ">
                  {isFetched ? (
                    <table className="table table-striped border rounded-3 ">
                      <>
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Lookup Code</th>
                            <th scope="col">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fetchedProduct.map((item, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                  <Link
                                    to={`/mainpage/itemadjust/${paramName}/${item.ItemLookupCode}`}
                                    className=" overflow-hidden col-12 text-decoration-none text-success"
                                    key={index}
                                  >
                                    {item.ItemLookupCode}
                                  </Link>
                                </td>
                                <td>{item.Description}</td>
                              </tr>
                            );
                          })}
                          {fetchedProduct.length === 0 && (
                            <tr>
                              <th scope="row">1</th>
                              <td>Not Found</td>
                              <td>Not Found</td>
                            </tr>
                          )}
                        </tbody>
                      </>
                    </table>
                  ) : (
                    <motion.h2
                      initial={{ x: "100vw", y: "-100vh" }}
                      animate={{ x: 0, y: 0 }}
                      transition={{ duration: ".5" }}
                      className="text-dark text-center"
                    >
                      {paramName.toLocaleUpperCase()}
                    </motion.h2>
                  )}
                  {paramName == "cost" && !isFetched && (
                    <motion.div
                      initial={{ x: "100vw", y: "-100vh" }}
                      animate={{ x: 0, y: 0 }}
                      transition={{ duration: ".5" }}
                      className=" text-center"
                    >
                      <Link
                        to="/mainpage/itemadjust/costbulk"
                        className=" text-dark  text-decoration-none"
                      >
                        <MainButton type="button" value="Adjust Bulk" />
                      </Link>
                    </motion.div>
                  )}

                  {paramName == "price" && !isFetched && (
                    <motion.div
                      initial={{ x: "100vw", y: "-100vh" }}
                      animate={{ x: 0, y: 0 }}
                      transition={{ duration: ".5" }}
                      className=" text-center"
                    >
                      <Link
                        to="/mainpage/itemadjust/pricebulk"
                        className=" text-dark  text-decoration-none"
                      >
                        <MainButton type="button" value="Adjust Bulk" />
                      </Link>
                    </motion.div>
                  )}
                  {paramName == "pricePerStore" && !isFetched && (
                    <motion.div
                      initial={{ x: "100vw", y: "-100vh" }}
                      animate={{ x: 0, y: 0 }}
                      transition={{ duration: ".5" }}
                      className=" text-center"
                    >
                      <Link
                        to="/mainpage/itemadjust/pricePerStore"
                        className=" text-dark  text-decoration-none"
                      >
                        <MainButton type="button" value="Adjust Bulk" />
                      </Link>
                    </motion.div>
                  )}
                  {paramName == "web" && !isFetched && (
                    <motion.div
                      initial={{ x: "100vw", y: "-100vh" }}
                      animate={{ x: 0, y: 0 }}
                      transition={{ duration: ".5" }}
                      className=" text-center"
                    >
                      <Link
                        to="/mainpage/itemadjust/webbulk"
                        className=" text-dark  text-decoration-none"
                      >
                        <MainButton type="button" value="Adjust Bulk" />
                      </Link>
                    </motion.div>
                  )}
                  {paramName == "active" && !isFetched && (
                    <motion.div
                      initial={{ x: "100vw", y: "-100vh" }}
                      animate={{ x: 0, y: 0 }}
                      transition={{ duration: ".5" }}
                      className=" text-center"
                    >
                      <Link
                        to="/mainpage/itemadjust/activebulk"
                        className=" text-dark  text-decoration-none"
                      >
                        <MainButton type="button" value="Adjust Bulk" />
                      </Link>
                    </motion.div>
                  )}
                  {paramName == "customerId" && !isFetched && (
                    <motion.div
                      initial={{ x: "100vw", y: "-100vh" }}
                      animate={{ x: 0, y: 0 }}
                      transition={{ duration: ".5" }}
                      className=" text-center"
                    >
                      <Link
                        to="/mainpage/itemadjust/customerId"
                        className=" text-dark  text-decoration-none"
                      >
                        <MainButton type="button" value="Customer ID" />
                      </Link>
                    </motion.div>
                  )}

                  {paramName == "StarProducts" && !isFetched && (
                    <motion.div
                      initial={{ x: "100vw", y: "-100vh" }}
                      animate={{ x: 0, y: 0 }}
                      transition={{ duration: ".5" }}
                      className=" text-center"
                    >
                      <Link
                        to="/mainpage/itemadjust/StarProducts"
                        className=" text-dark  text-decoration-none"
                      >
                        <MainButton type="button" value="Customer ID" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default ItemAdjustment;
