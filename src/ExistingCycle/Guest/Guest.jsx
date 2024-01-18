import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Guest = () => {
  let [query, setQuery] = useState({
    text: "",
  });
  //This declares a state variable called query using the useState hook. The initial state of query is an object with a single key text set to an empty string. The setQuery variable is a function that can be used to update the state of query.

  let [isSubmitted, setIsSubmitted] = useState(false);
  //This declares a state variable called isSubmitted with an initial value of false. The setIsSubmitted variable is a function that can be used to update the state of isSubmitted.

  let [isReady, setIsReady] = useState(false);
  //This declares a state variable called isReady with an initial value of false. The setIsReady variable is a function that can be used to update the state of isReady.

  let [state, setState] = useState({
    loading: false,
    products: [],
    filteredproduct: [],
    errorMessage: "",
  });
  //This declares a state variable called state with an initial value of an object with four keys: loading, products, filteredproduct, and errorMessage. The loading key is set to false, products is set to an empty array, filteredproduct is set to an empty array, and errorMessage is set to an empty string. The setState variable is a function that can be used to update the state of state.

  useEffect(() => {
    async function submitSearch() {
      try {
        if (isSubmitted && query.text != "") {
          setState({ ...state, loading: true });
          let response = await axios.get(
            `http://192.168.26.15/itemcreation-test/api/all-data/${query.text}`
          );
          setState({
            ...state,
            loading: false,
            products: response.data.description,
          });
          if (products.length > 0) {
            setIsReady(true);
          }
        }
      } catch (error) {
        setState({ loading: false, errorMessage: error.message });
      }
    }
    submitSearch();
  }, [isSubmitted, state.products.length]);
  //This sets up an useEffect hook with two dependencies: isSubmitted and state.products.length. The hook runs a function called submitSearch whenever either of these dependencies change. The submitSearch function is an asynchronous function that checks whether isSubmitted is true and whether the text key of the query object is not an empty string. If both conditions are met, the loading key of the state object is set to true. Then an HTTP GET request is made using Axios to a URL constructed with the text key of the query object. If the request is successful, the loading key of the state object is set to false, and the products key is set to the description field of the response data. If the products array is not empty, the isReady state variable is set to true. If there is an error, the loading key of the state object is set to false, and the errorMessage key is set to the error message.

  let searchContacts = (e) => {
    setQuery({ ...query, text: e.target.value });
    // setIsSubmitted(!isSubmitted);
  };
  //This declares a function called searchContacts that takes an event object as its argument. The function uses the setQuery function to update the `text

  let { products, loading, filteredproduct } = state;
  return (
    <React.Fragment>
      <nav
        className="navbar nav   w-100 fixed-top  row  mb-5 "
        style={{ backgroundColor: "#00a886", height: "10%" }}
      >
        <div className="container-fluid row">
          <div className="col"></div>
          <div className="logo-img col-2">
            <img
              src="/itemcreation/images/logo_white.png"
              alt="Logo"
              className="w-75"
            />
          </div>
          <div className="    col-8   ">
            <ul className="navbar-nav row align-items-center justify-content-evenly    list-group-horizontal">
              <li className=" col-5  d-flex    ">
                <input
                  disabled={isSubmitted ? true : false}
                  value={query.text}
                  onChange={searchContacts}
                  name="text"
                  type="text"
                  className="form-control rounded-3   "
                  placeholder="Search SKU"
                />

                <button
                  disabled={query.text.length == 0 ? true : false}
                  className="btn btn-success rounded-pill form-control  mx-3 "
                  onClick={() => {
                    setIsSubmitted(!isSubmitted);
                    setIsReady(!isReady);
                  }}
                >
                  {isSubmitted ? "New Search" : "Search"}
                </button>
              </li>
              <li className=" col  fs-5  text-center   ">
                <Link
                  to="/"
                  className=" active text-light text-decoration-none  navLink"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
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
                  {isReady ? (
                    <table className="table table-striped border round-3 ">
                      {products.length > 0 ? (
                        <>
                          {" "}
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
                                      <Link
                                        to={`/guest/${item.ItemLookupCode}`}
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
                          </tbody>
                        </>
                      ) : (
                        <>
                          {" "}
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
                    <motion.div
                      transition={{ repeat: 1000 }}
                      animate={{
                        opacity: [
                          1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
                        ],
                      }}
                      className="col-12 my-5 p-5 "
                    >
                      <h1 className=" text-center text-dark  fw-bolder">
                        Search a Product
                      </h1>
                    </motion.div>
                  )}

                  {/* {isReady && products.length ? (
                              products.map((product, index) => {
                                 return (
                                    <Link to={`/mainpage/itemadjust/${product.ItemLookupCode}`} className=" overflow-hidden col-12 text-decoration-none" key={index}>
                                       <motion.div whileHover={{ scale: 1.1 }} className="  w-100   ">
                                          <div className=" p-4 fs-5 text-white  row justify-content-evenly overflow-hidden " style={{ backgroundColor: "#00000080" }}>
                                             <h3 className="col-5 border rounded-3  ">Lookup Code: {product.ItemLookupCode}</h3>
                                             <h3 className="col-5    border rounded-3">Discription : {product.Description.length < 10 ? product.Description : product.Description.slice(0, 10) + `....`}</h3>
                                          </div>
                                       </motion.div>
                                    </Link>

                                 );
                              })
                           ) : (
                              <motion.div transition={{ repeat: 1000 }} animate={{ opacity: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }} className="col-12 my-5 p-5 ">
                                 <h1 className=" text-center text-dark  fw-bolder">Search a Product</h1>
                              </motion.div>
                           )} */}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
      {/* <section
                id=""
                className=" position-relative d-flex justify-content-center align-items-center vh-100 "
                style={{ overflowY: "scroll", overflowX: "hidden" }}
            >
                <div
                    className="layout h-100 d-flex justify-content-center align-items-center   "
                    style={{ overflowY: "scroll", overflowX: "hidden" }}
                >
                    <div className="container mt-5 rounded-3    ">
                        {loading === false ? (
                            <div className="viewPage">
                                <div className="row  ">
                                    {isReady && products.length ? (
                                        products.map((product) => {
                                            return (
                                                <Link
                                                    to={`/mainpage/content/${product.ItemLookupCode}`}
                                                    className=" p-5 col-12 text-decoration-none"
                                                    key={product.ID}
                                                >
                                                    <motion.div
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        className="  w-100 p-5  "
                                                    >
                                                        <div
                                                            className="border p-4 fs-5 text-white border-2 rounded-3 row g-3 justify-content-evenly "
                                                            style={{
                                                                backgroundColor:
                                                                    "#000000",
                                                            }}
                                                        >
                                                            <h3 className="col-5 p-2 border rounded-3  ">
                                                                Lookup Code:{" "}
                                                                {
                                                                    product.ItemLookupCode
                                                                }
                                                            </h3>
                                                            <h3 className="col-6 p-2   border rounded-3">
                                                                {
                                                                    product.Description
                                                                }
                                                            </h3>
                                                        </div>
                                                    </motion.div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <motion.div
                                            transition={{ repeat: 1000 }}
                                            animate={{
                                                opacity: [
                                                    1, 0.9, 0.8, 0.7, 0.6, 0.5,
                                                    0.6, 0.7, 0.8, 0.9, 1,
                                                ],
                                            }}
                                            className="col-12 my-5 p-5 "
                                        >
                                            <h1 className=" text-center text-dark  fw-bolder">
                                                Search a Product
                                            </h1>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </section> */}
    </React.Fragment>
  );
};

export default Guest;
