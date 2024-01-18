import React from "react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import ContentQueue from "./ContentQueue";
import ContentExistQueue from "./ContentExistQueue";
import swal from "sweetalert";
import { useCallback } from "react";
import { fetchDataItem } from "../../ExistingCycle/ExistingItem/CustomHooks/getItemData";
import SidebarNew from "../../Components/SidebarNew";
const Content = () => {
  let { Param } = useParams();
  const [itemAdjustState, SetItemAdjustmentState] = useState({
    loading: false,
    fetchedProduct: [],
    query: "",
    isHovered: false,
    paramName: Param,
    isFetched: false,
  });
  const getProductData = useCallback(async () => {
    try {
      if (itemAdjustState.query.trim() !== "") {
        SetItemAdjustmentState((prev) => {
          return { ...prev, loading: true };
        });
        let response = await fetchDataItem(itemAdjustState.query);
        let responseData = await axios.get(
          "http://192.168.26.15/itemcreation-test/api/content-queue"
        );

        if (response.data.description.length > 0) {
          if (responseData.data.Content.length > 0) {
            const newItem = responseData.data.Content.find((item) => {
              if (item.photo == "0")
                return (
                  item.lookupcode == response.data.description[0].ItemLookupCode
                );
            });
            if (!newItem) {
              SetItemAdjustmentState((prev) => {
                return {
                  ...prev,
                  loading: false,
                  fetchedProduct: response.data.description,
                  isFetched: true,
                  query: "",
                };
              });
              return;
            } else {
              swal({
                text: "This is a new product go to Item Queue to finish its data ",
                icon: "warning",
              });
              SetItemAdjustmentState((prev) => {
                return {
                  ...prev,
                  loading: false,
                  fetchedProduct: [],
                  isFetched: false,
                  query: "",
                };
              });
            }
          } else {
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
        } else {
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
  useEffect(() => {
    SetItemAdjustmentState((prev) => {
      return { ...prev, paramName: Param };
    });
  }, [Param]);
  const handleQueryChange = (e) => {
    SetItemAdjustmentState((prev) => {
      return { ...prev, query: e.target.value, isFetched: false };
    });
  };
  let { fetchedProduct, loading, query, paramName, isHovered, isFetched } =
    itemAdjustState;

  const reportsData = () => {
    console.log('helloworld')
  }
  return (
    <React.Fragment>
      <nav
        className="navbar nav   w-100 fixed-top  row m-0 mb-5 "
        style={{ backgroundColor: "#00a886", height: "10vh" }}
      >
        <div className="container-fluid row">
          <div className="logo-img col-2">
            <img
              src="/itemcreation/images/logo_white.png"
              alt="Logo"
              className="w-75"
            />
          </div>
          <div className="    col-10    ">
            <ul className="navbar-nav row align-items-center justify-content-evenly    list-group-horizontal">
              {Param === "existing" ? (
                <li className=" col-5  d-flex    ">
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
                  {/* <button
                              className="btn btn-success rounded-pill form-control  mx-3 "
                              onClick={(e) => {
                                 if (query.text.trim() != "") {
                                    setIsSubmitted(true);
                                    setIsReady(true);
                                    setQuery({ text: "" });
                                 }
                              }}>
                              Search
                              {isSubmitted ? "New Search" : "Search"}
                           </button> */}
                </li>
              ) : (
                <div className="col-5"></div>
              )}

              <li className=" col  fs-5  text-center   ">
                <Link
                  to="/mainpage/content/existing"
                  className={`${Param === "existing" ? "active" : ""
                    } text-light text-decoration-none  navLink`}
                >
                  Existing Item
                </Link>
              </li>

              <li className=" col  fs-5  text-center   ">
                <Link
                  to="/mainpage/content/Equeue"
                  className={`${Param === "Equeue" ? "active" : ""
                    } text-light text-decoration-none  navLink`}
                >
                  Existing Queue
                </Link>
              </li>

              <li className=" col  fs-5  text-center   ">
                <Link
                  to="/mainpage/content/queue"
                  className={`${Param === "queue" ? "active" : ""
                    } text-light text-decoration-none  navLink`}
                >
                  Item Queue
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarNew height="90vh" reportsData={reportsData} />
      {Param === "existing" ? (
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
                  <div className="row  w-75 m-auto  ">
                    {/* {isReady ? (
                                 <table className="table table-striped border round-3 ">
                                    {products.length > 0 ? (
                                       <>
                                          <thead>
                                             <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Lookup Code</th>
                                                <th scope="col">Description</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {products.length > 0 &&
                                                products.map((item, index) => {
                                                   return (
                                                      <tr key={index}>
                                                         <th scope="row">{index + 1}</th>
                                                         <td>
                                                            {" "}
                                                            <Link to={`/mainpage/content/existing/${item.ItemLookupCode}`} className=" overflow-hidden col-12 text-decoration-none text-success" key={index}>
                                                               {item.ItemLookupCode}
                                                            </Link>
                                                         </td>
                                                         <td>{item.Description}</td>
                                                      </tr>
                                                   );
                                                })}
                                          </tbody>
                                       </>
                                    ) : (
                                       <>
                                          <thead>
                                             <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Lookup Code</th>
                                                <th scope="col">Description</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             <tr>
                                                <th scope="row">1</th>
                                                <td>Not Found</td>
                                                <td>Not Found</td>
                                             </tr>
                                          </tbody>
                                       </>
                                    )}
                                 </table>
                              ) : (
                                 <motion.div transition={{ repeat: 1000 }} animate={{ opacity: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }} className="col-12 my-5 p-5 ">
                                    <h1 className=" text-center text-dark  fw-bolder">Search a Product</h1>
                                 </motion.div>
                              )} */}
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
                                      to={`/mainpage/content/existing/${item.ItemLookupCode}`}
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
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </section>
      ) : Param === "queue" ? (
        <section
          id=""
          className=" position-relative d-flex justify-content-center align-items-center vh-100 bg-light "
          style={{ overflowY: "scroll", overflowX: "hidden" }}
        >
          <div
            className="layout h-100 d-flex justify-content-center align-items-center   "
            style={{ overflowY: "scroll", overflowX: "hidden" }}
          >
            <div className="container mt-5 rounded-3    ">
              {loading === false ? <ContentQueue /> : ""}
            </div>
          </div>
        </section>
      ) : (
        <section
          id=""
          className=" position-relative d-flex justify-content-center align-items-center vh-100 bg-light "
          style={{ overflowY: "scroll", overflowX: "hidden" }}
        >
          <div
            className="layout h-100 d-flex justify-content-center align-items-center   "
            style={{ overflowY: "scroll", overflowX: "hidden" }}
          >
            <div className="container mt-5 rounded-3    ">
              {loading === false ? <ContentExistQueue /> : ""}
            </div>
          </div>
        </section>
      )}
    </React.Fragment>
  );
};

export default Content;
