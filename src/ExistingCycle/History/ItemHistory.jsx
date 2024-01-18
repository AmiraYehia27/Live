import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";


import axios from "axios";
import SidebarNew from "../../Components/SidebarNew";
const ItemHistory = () => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  // This line retrieves the user data from the session storage and parses it as a JavaScript object.
  let [query, setQuery] = useState({
    text: "",
  });
  //This line declares a state variable query and a function setQuery to update it, and initializes query to an object with a property text set to an empty string.
  let [state, setState] = useState({
    loading: false,
    products: [],
    filteredproduct: [],
    errorMessage: "",
  });
  //This line declares a state variable state and a function setState to update it, and initializes state to an object with properties loading, products, filteredproduct, and errorMessage, all initially set to empty values or false.
  let [isSubmitted, setIsSubmitted] = useState(false);
  // This line declares a state variable isSubmitted and a function setIsSubmitted to update it, and initializes isSubmitted to false.
  useEffect(() => {
    async function submitSearch() {
      try {
        if (query.text != "") {
          setState({ ...state, loading: true });
          let response = await axios.get(
            `http://192.168.26.15/itemcreation-test/api/log/${query.text}`
          );
          setState({ ...state, loading: false, products: response.data.log });
        }
      } catch (error) {
        setState({ loading: false, errorMessage: error.message });
      }
    }
    submitSearch();
  }, [isSubmitted, state.products.length]);
  // This line declares an effect that runs whenever isSubmitted or the length of state.products changes. It contains an asynchronous function submitSearch() that sends a GET request to a specific URL with the query.text value as a parameter, updates the state variable with the response data, and catches any errors that may occur.
  let searchContacts = (e) => {
    setQuery({ ...query, text: e.target.value });
    // setIsSubmitted(!isSubmitted);
  };
  //This line declares a function searchContacts that updates the query state variable with the text value of the event target whenever it is called.
  const reportsData = () => {
    console.log('helloworld')
 }
  return (
    <React.Fragment>
      <SidebarNew height="90vh"  reportsData={reportsData} />
      <section className="  vh-100 ">
        <div className="Layout position-absolute top-0 start-0 end-0 bottom-0 vh-100"></div>
        <div className=" w-100 ">
          <div className="grid ">
            <div
              className="row  p-5  justify-content-center w-100 align-items-center inputs-section position-relative vh-100 m-0 "
              style={{ backgroundColor: "#00A88610" }}
            >
              <div
                className="col-12 nav  navbar position-absolute w-100 fixed-top  row m-0 "
                style={{ backgroundColor: "#00a886", height: "10vh" }}
              >
                <h3 className="  col-4 text-center text-light   fw-bold">
                  History
                </h3>
                <h3 className="  col-4 text-center text-dark d-flex  fw-bold">
                  <input
                    value={query.text}
                    onChange={searchContacts}
                    name="text"
                    type="text"
                    className="form-control rounded-3  "
                    placeholder="Search SKU"
                  />
                  <button
                    disabled={query.text.length < 5 ? true : false}
                    className="btn btn-dark rounded-pill form-control  mx-3 "
                    onClick={() => {
                      setIsSubmitted(!isSubmitted);
                    }}
                  >
                    {isSubmitted ? "New Search" : "Search"}
                  </button>
                </h3>
                <h3 className="  col-4 text-center text-light fw-bold">
                  User: {user.name != null ? user.name : ""}
                </h3>
              </div>
              <div className="container m-auto w-75">
                <div className="row w-100 justify-content-center  text-center">
                  {isSubmitted ? (
                    <table className="table table-striped border round-3 ">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">User</th>
                          <th scope="col">Action</th>
                          <th scope="col">Date </th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.products.length > 0 ? (
                          state.products.map((item, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index}</th>
                                <td>{item.user}</td>
                                <td>{item.action}</td>
                                <td>{item.created_at}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <th scope="row">1</th>
                            <td>Not Found</td>
                            <td>Not Found</td>
                            <td>Not Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <div className="row justify-content-center align-content-center">
                      <div className="logo-img col-5 ">
                        <img
                          src="/itemcreation/images/logo_5.png"
                          alt="Logo"
                          className="w-75"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* {state.loading ? (
            <Spinner />
         ) : (
          
         )} */}
    </React.Fragment>
  );
};

export default ItemHistory;
