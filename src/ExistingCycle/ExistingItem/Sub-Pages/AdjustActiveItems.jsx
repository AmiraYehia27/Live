import React, { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../../Spinner/Spinner";
import axios from "axios";
import MainButton from "../../../Components/MainButton/MainButton";
import swal from "sweetalert";
import Frame from "../../../Components/MainFrame/Frame";
import { fetchDataItem } from "../CustomHooks/getItemData";

const AdjustActiveItems = () => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //This line is declaring a variable user and assigning it the parsed value of the userData key from the sessionStorage object.
  let { Id } = useParams();
  //This line is using the useParams() hook from React Router to extract the Id parameter from the URL and assigning it to a variable Id using destructuring.

  let navigate = useNavigate();
  //This line is using the useNavigate() hook from React Router to get a function that can be used to navigate to different pages within the application.

  const [isLoading, setIsLoading] = useState(false);
  //This line is declaring a state variable isLoading and its corresponding update function setIsLoading using the useState() hook. The initial value of isLoading is set to false.

  const [activeState, setActiveState] = useState({
    loading: false,
    productData: {
      ID: "",
      ItemLookupCode: "",
      Description: "",
      ItemType: "",
      price: "",
    },
    activeData: {
      inactive: 0,
      ItemID: "",
      BlockSale: "",
      DoNotOrder: "",
      itemlookupcode: "",
      description: "",
      reason: "",
    },
  });
  //This line is declaring a state variable activeState and its corresponding update function setActiveState using the useState() hook. The initial value of activeState is an object with three properties: loading, productData, and activeData. productData and activeData are both objects with multiple properties.

  const [postLog, setPostLog] = useState({
    lookupcode: Id,
    action: `${user.name} Adjusted The Item ${Id} status`,
    user: user.id != null ? user.id : "",
  });
  //This line is declaring a state variable postLog and its corresponding update function setPostLog using the useState() hook. The initial value of postLog is an object with three properties: lookupcode, action, and user. lookupcode is assigned the value of Id. action is assigned a string that includes the user name and Id parameter. user is assigned the user.id value if it exists, otherwise an empty string.

  // Updating new active items

  function updateInput(e) {
    setActiveState((prev) => {
      return {
        ...prev,
        activeData: { ...prev.activeData, [e.target.name]: e.target.value },
      };
    });
    if (e.target.name == "inactive")
      setPostLog((prev) => {
        return {
          ...prev,
          action: `${user.name} changed the item ${Id} status to ${
            e.target.value == "0" ? "Active" : "InActive"
          }`,
        };
      });
  }
  //This is a function updateInput that takes an event object e as its parameter. It updates the activeData property of the activeState state object with the name-value pair extracted from the e.target object. If the name property of the target object is "inactive", it also updates the action property of the postLog state object with a string that includes the user name, Id parameter, and the value of the e.target.value.

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
  // Data Submitting anf fetching
  const getTheProduct = useCallback(async () => {
    try {
      setActiveState((prev) => {
        return { ...prev, loading: true };
      });
      let response = await fetchDataItem(Id);
      setActiveState((prev) => {
        return {
          ...prev,
          loading: false,
          productData: response.data.description[0],
          activeData: response.data.active[0],
        };
      });
    } catch (error) {
      swal({
        text: "Error while getting data please refresh and try again",
        icon: "error",
      });
      setActiveState((prev) => {
        return { ...prev, loading: false };
      });
    }
  }, [Id]);

  useEffect(() => {
    getTheProduct();
  }, [getTheProduct]);

  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      let responseLog = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/log",
        postLog
      );
      let response = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/update-active",
        [activeState.activeData]
      );
      if (response) {
        setIsLoading(false);
        swal({
          text: "Status Updated successfully  ",
          icon: "success",
          button: false,
          timer: 1200,
        });
        setTimeout(() => {
          navigate("/mainpage/itemadjust/active", { replace: true });
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
  /*
The getTheProduct function is a useCallback hook that is defined with an asynchronous function. It uses the fetchDataItem function to fetch some data and updates the state of the activeState object with the data received from the server. The useCallback hook is used to memoize the function so that it does not get re-created on every render.

The useEffect hook is used to call the getTheProduct function when the component mounts or when the getTheProduct function changes.

The formSubmit function is an asynchronous function that is called when a form is submitted. It updates some data on the server using the axios.post function and updates the state of the component based on the response from the server.
*/
  // Adding user to activeData object
  if (activeState.activeData) {
    activeState.activeData.itemlookupcode = Id;
    activeState.activeData.user = user.id;
    activeState.activeData.date = today;
  }

  // Destructing props
  let { loading, productData, activeData } = activeState;
  return (
    <React.Fragment>
      <Frame headerLabel="Product Status">
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
                  className=" ms-2 my-1  fs-5 text-dark"
                >
                  Item Lookup Code
                </label>
                <input
                  readOnly
                  id="productCode"
                  name="ItemLookupCode"
                  type="text"
                  className="form-control "
                  defaultValue={productData.ItemLookupCode}
                />
              </div>

              <div className="col-6">
                <label htmlFor="Des" className="ms-2 my-1 fs-5  text-dark">
                  RMS Description
                </label>
                <input
                  readOnly
                  id="Des"
                  type="text"
                  className="form-control "
                  defaultValue={productData.Description}
                />
              </div>

              <div className="col-12 row my-4 g-3 p-3 border rounded-3">
                <div className="col-4">
                  <div className=" position-relative ">
                    <label
                      htmlFor="Active/Inactive"
                      className="  text-dark fw-bolder px-4"
                    >
                      Active/Inactive
                    </label>
                    <select
                      required
                      defaultValue={activeData.inactive}
                      onChange={(e) => {
                        updateInput(e);
                      }}
                      id="Active/Inactive"
                      name="inactive"
                      step=".001"
                      type="number"
                      className="form-control rounded-3  border-3 border   "
                    >
                      <option value="1">Inactive </option>
                      <option value="0">Active</option>
                    </select>
                  </div>
                </div>
                <div className="col-4">
                  <div className=" position-relative ">
                    <label
                      htmlFor="cannotPlace"
                      className="  text-dark fw-bolder px-4"
                    >
                      Cannot be Places in Purchase Order
                    </label>
                    <select
                      required
                      value={activeData.DoNotOrder}
                      onChange={(e) => updateInput(e)}
                      id="cannotPlace"
                      name="DoNotOrder"
                      className="form-control rounded-3  border-3 border   "
                    >
                      <option value="0">✘ </option>
                      <option value="1">✔</option>
                    </select>
                  </div>
                </div>
                <div className="col-4">
                  <div className=" position-relative ">
                    <label
                      htmlFor="blockSale"
                      className="  text-dark fw-bolder px-4"
                    >
                      Block Sale
                    </label>
                    <select
                      required
                      value={activeData.BlockSale}
                      onChange={(e) => updateInput(e)}
                      id="blockSale"
                      name="BlockSale"
                      className="form-control rounded-3  border-3 border   "
                    >
                      <option value="0">✘ </option>
                      <option value="1">✔</option>
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
                      value={activeData.reason}
                      name="reason"
                      type="text"
                      className="form-control rounded-3  border-3 border   "
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 ms-auto  d-flex justify-content-between my-4 ">
                <MainButton
                  type="submit"
                  value={
                    isLoading ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      "MODIFY"
                    )
                  }
                />
              </div>

              <div className="col-12 p-1 row justify-content-between m-auto my-4 ">
                <Link
                  to="/mainpage/itemadjust/active"
                  className="G-link col-2 btn-hover text-center fs-3 text-decoration-none text-dark border border-top-0 border-start-0 border-end-0"
                >
                  New Search
                </Link>
                <Link
                  to="/mainpage"
                  className="G-link col-2 text-center btn-hover fs-3 text-decoration-none text-dark border border-top-0 border-start-0 border-end-0"
                >
                  Home
                </Link>
              </div>
            </form>
          </React.Fragment>
        )}
      </Frame>
    </React.Fragment>
  );
};

export default AdjustActiveItems;
