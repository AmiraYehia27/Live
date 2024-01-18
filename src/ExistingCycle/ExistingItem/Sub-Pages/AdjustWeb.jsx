import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../../Spinner/Spinner";
import axios from "axios";
import MainButton from "../../../Components/MainButton/MainButton";
import swal from "sweetalert";
import Frame from "../../../Components/MainFrame/Frame";
import { fetchDataItem } from "../CustomHooks/getItemData";
import { useCallback } from "react";
const AdjustWeb = () => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //This line gets the user data from the session storage and parses it into a JavaScript object.
  let { Id } = useParams();
  //his line extracts the ID parameter from the URL using the useParams() hook from React Router.
  let navigate = useNavigate();
  //This line gets the navigate function from the useNavigate() hook from React Router.
  const [isLoading, setIsLoading] = useState(false);
  //This line sets up the isLoading state variable to keep track of whether the form is currently submitting or not.
  const [webState, setWebState] = useState({
    loading: false,
    productData: {
      ID: "",
      ItemLookupCode: "",
      Description: "",
      ItemType: "",
      price: "",
    },
    webData: {
      ItemID: "",
      webitem: "",
      EnIngredients: "",
      EnDesc: "",
      reason: "",
      sWebName: "",
    },
    categories: [],
    wasWeb: false,
  });
  //This line sets up the webState state variable to keep track of the current state of the web item being updated. It has several properties, including loading, productData, webData, categories, and wasWeb.
  const [postLog, setPostLog] = useState({
    lookupcode: Id,
    action: `Web Adjustment`,
    user: user.id != null ? user.id : "",
  });
  //This line sets up the postLog state variable to keep track of the log data that will be sent to the server when the form is submitted.
  const getTheProduct = useCallback(async () => {
    try {
      setWebState((prev) => {
        return { ...prev, loading: true };
      });
      let response = await fetchDataItem(Id);
      let catResponse = await axios.get(
        `http://192.168.26.15/itemcreation-test/api/content/${Id}`
      );
      setWebState((prev) => {
        return {
          ...prev,
          loading: false,
          productData: response.data.description[0],
          webData: response.data.web[0],
          categories: catResponse.data.Categories,
          wasWeb: catResponse.data.Content[0].EnName && true,
        };
      });
    } catch (error) {
      swal({
        text: "Error while getting the data please refresh the page and try again",
        icon: "error",
      });
    }
  }, [Id]);
  //This line sets up a getTheProduct function that will fetch the data for the current web item using the fetchDataItem() function and the axios.get() function. It is memoized using the useCallback() hook with the Id parameter as a dependency.

  useEffect(() => {
    getTheProduct();
  }, [getTheProduct]);
  // This line runs the getTheProduct function when the component mounts using the useEffect() hook with getTheProduct as a dependency.
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let responseLog = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/log",
        postLog
      );
      let response = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/update-webitem",
        [webState.webData]
      );
      if (response) {
        swal({
          text: "Status updated successfully  ",
          icon: "success",
          button: false,
          timer: 1200,
        });
        setIsLoading(false);
        setTimeout(() => {
          navigate("/mainpage/itemadjust/web", { replace: true });
        }, 1500);
      }
    } catch (error) {
      swal({
        title: `Ops`,
        text: "An error occurred please refresh the page and try again ",
        icon: "error",
        button: false,
        timer: 1200,
      });

      setIsLoading(false);
    }
  }
  //This line sets up an async function that will be called when the form is submitted. It sends the updated web item data to the server using the axios.post() function and updates the postLog state variable.
  // Updating new web items
  const updateInput = (e) => {
    setWebState((prev) => {
      return {
        ...prev,
        webData: { ...prev.webData, [e.target.name]: e.target.value },
      };
    });
    if (e.target.name == "webitem") {
      setPostLog((prev) => {
        return {
          ...prev,
          action: `${user.name} adjusted the item ${Id} Web Status to ${
            e.target.value == "1" ? "Web Item" : "Non Web Item"
          }  `,
        };
      });
    }
  };
  // This line sets up an event handler function that will be called when the input fields in the form are updated. It updates the webData state variable and the postLog state variable depending on the input field that was updated.
  // Set MinDate to Today
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }
  today = yyyy + "-" + mm + "-" + dd;

  // Adding userId to webData
  if (webState.webData) {
    webState.webData.user = user.id;
    webState.webData.itemlookupcode = Id;
    webState.webData.date = today;
  }
  // This line sets the user, itemlookupcode, and date properties of the webData object in the webState state variable.
  // Destructing props
  let { loading, productData, webData, categories, wasWeb } = webState;
  return (
    <Frame headerLabel="Status Adjustment">
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <form
            onSubmit={formSubmit}
            className="row justify-content-evenly align-items-center g-4 p-5"
          >
            <div className="col-6">
              <label
                htmlFor="productCodet"
                className=" ms-2 my-1  fs-5  text-dark"
              >
                Item Lookup Code
              </label>
              <input
                readOnly
                id="productCode"
                name="ItemLookupCode"
                type="text"
                className="form-control "
                value={productData.ItemLookupCode}
              />
            </div>

            <div className="col-6">
              <label htmlFor="Des" className="ms-2 my-1 fs-5   text-dark">
                RMS Description
              </label>
              <input
                readOnly
                id="Des"
                type="text"
                className="form-control "
                value={productData.Description}
              />
            </div>

            <div className="col-12 row my-4  g-3 p-3 border rounded-3 border-color">
              <div className="col-4">
                <div className=" position-relative ">
                  <label
                    htmlFor="Active/Inactive"
                    className="  text-dark fw-bolder px-4"
                  >
                    Web/NonWeb
                  </label>
                  <select
                    required
                    value={webData.webitem || ""}
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    id="webitem"
                    name="webitem"
                    className="form-control  rounded-3  border-3 border   "
                  >
                    <option value="">Choose Web Or Non Web </option>
                    <option value="1">Web Item </option>
                    <option value="0">Non Web Item</option>
                  </select>
                </div>
              </div>

              <div className="col-4">
                <div className=" position-relative ">
                  <label
                    htmlFor="reason"
                    className="  text-dark fw-bolder px-4"
                  >
                    Reason <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    required
                    onChange={(e) => updateInput(e)}
                    id="reason"
                    name="reason"
                    value={webData.reason || ""}
                    type="text"
                    className="form-control  rounded-3 border-3 border"
                  />
                </div>
              </div>

              {webState.webData.webitem == "1" && (
                <>
                  <div className="col-6">
                    <label
                      htmlFor="type"
                      className="ms-2 my-1 fs-5   text-dark"
                    >
                      English Web Description{" "}
                      <span className=" fw-bolder text-danger">*</span>
                    </label>
                    <textarea
                      required
                      onChange={(e) => updateInput(e)}
                      name="EnDesc"
                      id="EnDesc"
                      rows="5"
                      cols="30"
                      className="form-control fs-3 "
                      value={webData.EnDesc || ""}
                    ></textarea>
                  </div>
                  <div className="col-6">
                    <label
                      htmlFor="type"
                      className="ms-2 my-1 fs-5   text-dark"
                    >
                      English Ingredients{" "}
                      <span className=" fw-bolder text-danger">*</span>
                    </label>
                    <textarea
                      required
                      onChange={(e) => updateInput(e)}
                      name="EnIngredients"
                      id="EnIngredients"
                      rows="5"
                      cols="30"
                      className="form-control fs-3 "
                      value={webData.EnIngredients || ""}
                    ></textarea>
                  </div>
                  <div className="col-6">
                    <div className=" position-relative ">
                      <label
                        htmlFor="Dunes"
                        className=" text-dark fw-bolder px-4"
                      >
                        Suggested Web Name{" "}
                        <span className=" fw-bolder text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => {
                          updateInput(e);
                        }}
                        value={webData.sWebName || ""}
                        placeholder="Suggest a web name  "
                        id="sWebName"
                        name="sWebName"
                        type="text"
                        className="form-control  rounded-3  border-3 border   "
                      />
                    </div>
                  </div>
                </>
              )}
              {wasWeb ? (
                <div className="badge bg-success">Has Content</div>
              ) : (
                <div className="badge bg-danger">Has No Content</div>
              )}
              {categories.length > 0 ? (
                <h6 className="my-2 text-center ">Categories</h6>
              ) : (
                ""
              )}
              {categories.map((cat, index) => {
                return (
                  <div key={index} className="col-2">
                    <button
                      disabled
                      type="button"
                      className=" badge bg-success border-0 "
                    >
                      {cat.label}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="col-12 ms-auto  d-flex justify-content-between my-4 ">
              <MainButton
                type="submit"
                value={
                  isLoading ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    "Submit"
                  )
                }
              />
            </div>

            <div className="col-12 p-1 row justify-content-between m-auto my-4 ">
              <Link
                to="/mainpage/itemadjust/web"
                className="G-link col-2 btn-hover text-center fs-3 text-decoration-none  text-dark border border-top-0 border-start-0 border-end-0"
              >
                New Search
              </Link>
              <Link
                to="/mainpage"
                className="G-link col-2 text-center btn-hover fs-3 text-decoration-none  text-dark border border-top-0 border-start-0 border-end-0"
              >
                Home
              </Link>
            </div>
          </form>
        </React.Fragment>
      )}
    </Frame>
  );
};

export default AdjustWeb;
