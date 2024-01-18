import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Spinner from "../../../Spinner/Spinner";
import axios from "axios";
import MainButton from "../../../Components/MainButton/MainButton";
import swal from "sweetalert";
import Frame from "../../../Components/MainFrame/Frame";
import { useCallback } from "react";
import { fetchDataItem } from "../CustomHooks/getItemData";

const AdjustCost = () => {
  // Getting user Data
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //This line retrieves user data from the session storage, parses it from a JSON string to an object, and assigns it to a variable named user.

  // States Manager
  let { Id } = useParams();
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [costState, setCostState] = useState({
    loading: false,
    costData: [],
    date: "",
  });
  /*
This section defines and initializes several state variables using the useState hook. The useParams hook is used to extract a parameter named Id from the URL. The useNavigate hook is used to navigate to a different page in response to user actions. The isLoading state variable is used to keep track of whether data is currently being loaded or not. The costState state variable is an object that contains several properties including loading (a boolean that indicates whether data is currently being loaded), costData (an array that contains cost data for the product), and date (a string that contains the date when the cost data was last updated).
*/
  const getTheProduct = useCallback(async () => {
    try {
      setCostState((prev) => {
        return { ...prev, loading: true };
      });
      let response = await fetchDataItem(Id);
      setCostState((prev) => {
        return { ...prev, loading: false, costData: response.data.cost };
      });
    } catch (error) {
      swal({
        text: "Error while getting price data please refresh the page ",
        icon: "error",
      });
      setCostState((prev) => {
        return { ...prev, loading: false };
      });
    }
  }, [Id]);
  useEffect(() => {
    getTheProduct();
  }, [getTheProduct]);
  //   //This section defines an asynchronous function named getTheProduct that retrieves cost data for a product with a given Id. The useCallback hook is used to memoize the function and prevent it from being redefined on every render. The useEffect hook is used to call the getTheProduct function once, when the component mounts.

  // Submiting data
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/update-cost",
        costState.costData
      );
      if (response) {
        setIsLoading(false);
        swal({
          text: "Cost updated successfully  ",
          icon: "success",
          button: false,
          timer: 1200,
        });
        setTimeout(() => {
          navigate("/mainpage/itemadjust/cost", { replace: true });
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
  //This function is called when the user submits a form, and it sends a POST request to update cost data for a product. The e.preventDefault() method is used to prevent the default form submission behavior, and setIsLoading(true) is used to set the isLoading state variable to true. The axios.post() method sends a POST request to a backend API

  // Getting inputs Data
  const inputOnChangeHandler = (e, index) => {
    let list = [...costState.costData];
    list[index][e.target.name] = e.target.value;
    setCostState((prev) => {
      return { ...prev, costData: list };
    });
  };
  //This function takes in an event object and an index as arguments. It then creates a copy of the costData array using the spread operator, modifies the item at the given index based on the name and value properties of the target element in the event object, and updates the state with the modified array.
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

  // Handling New Added Products
  const handleNewProduct = () => {
    setCostState((prev) => {
      return { ...prev, costData: [...prev.costData, { itemlookupcode: "" }] };
    });
  };
  //This function adds a new item object with an empty itemlookupcode property to the costData array using the spread operator and updates the state with the new array.
  const handleNewProductRemove = (index) => {
    const list = [...costState.costData];
    list.splice(index, 1);
    setCostState((prev) => {
      return { ...prev, costData: list };
    });
  };
  //This function takes in an index as an argument, creates a copy of the costData array using the spread operator, removes the item at the given index using the splice method, and updates the state with the modified array.
  const getDateHandler = (e) => {
    setCostState((prev) => {
      return { ...prev, date: e.target.value };
    });
  };
  // This function takes in an event object as an argument and updates the date property in the state with the value of the target element in the event object.
  // Getting new Added product on Blur
  async function getProductData(e, index) {
    let list = [...costState.costData];
    if (list[index].itemlookupcode == "") {
      try {
        if (e.target.value != "") {
          const existCode = list.find(
            (item) => item.itemlookupcode == e.target.value
          );
          if (!existCode) {
            let response = await axios.get(
              `http://192.168.26.15/itemcreation-test/api/all-data/${e.target.value}`
            );
            list[index].description = response.data.cost[0].description;
            list[index].SupplierName = response.data.cost[0].SupplierName;
            list[index].Cost = response.data.cost[0].Cost;
            list[index].itemlookupcode = e.target.value;
            setCostState((prev) => {
              return { ...prev, costData: list };
            });
          } else {
            swal({
              text: "Lookup code Exists",
              icon: "error",
            });
            list.splice(index, 1);
            setCostState((prev) => {
              return { ...prev, costData: list };
            });
          }
        } else {
          swal({
            text: "You cannot leave the lookup code empty",
            icon: "error",
          });
          list.splice(index, 1);
          setCostState((prev) => {
            return { ...prev, costData: list };
          });
        }
      } catch (error) {
        swal({
          text: "Cannot Find that Code",
          icon: "error",
        });
        list.splice(index, 1);
        setCostState((prev) => {
          return { ...prev, costData: list };
        });
      }
    }
  }
  // This function takes in an event object and an index as arguments. It creates a copy of the costData array using the spread operator, checks if the itemlookupcode property of the item at the given index is empty, and if it is not, makes an HTTP GET request to a server endpoint using the axios library. If the request is successful, it updates the description, SupplierName, Cost, and itemlookupcode properties of the item at the given index with the data returned from the server and updates the state with the modified array. If the request fails, it displays an error message and removes the item from the array.
  // Adding date to costData
  costState.costData.forEach((item) => {
    item.date = costState.date;
    item.user = user.id;
  });
  // loops through each item in the costData array and adds the date and user properties to it. The date property is set to the value of the date property in the state, and the user property is set to the id of a user object.
  // Destructing props
  let { loading, costData } = costState;
  return (
    <React.Fragment>
      <Frame headerLabel="Cost Adjustment">
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <form
              onSubmit={formSubmit}
              className="row  justify-content-evenly align-self-center p-3 "
              style={{ maxHeight: "90vh", overflowY: "scroll" }}
            >
              {costData.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="  col-12 row border-top p-2 my-1 justify-content-between"
                  >
                    <div className="col-3">
                      <label
                        htmlFor="productCodet"
                        className=" ms-2 my-1  fs-5 text-dark "
                      >
                        Item Lookup Code
                      </label>
                      <input
                        required
                        onBlur={(e) => {
                          getProductData(e, index);
                        }}
                        disabled={item.itemlookupcode != "" ? true : false}
                        defaultValue={item.itemlookupcode || ""}
                        id="productCode"
                        name="itemlookupcode"
                        type="text"
                        className="form-control "
                      />
                    </div>

                    <div className="col-3">
                      <label
                        htmlFor="productCodet"
                        className="ms-2 my-1 fs-5  text-dark"
                      >
                        Description
                      </label>
                      <input
                        readOnly
                        defaultValue={item.description || ""}
                        id="productCode"
                        type="text"
                        className="form-control "
                      />
                    </div>
                    <div className="col-3">
                      <label
                        htmlFor="SupplierName"
                        className="ms-2 my-1 fs-5  text-dark"
                      >
                        Supplier
                      </label>
                      <input
                        readOnly
                        id="SupplierName"
                        defaultValue={item.SupplierName || ""}
                        type="text"
                        className="form-control "
                      />
                    </div>
                    <div className="col-3">
                      <label
                        htmlFor="oldCost"
                        className="ms-2 my-1 fs-5  text-dark"
                      >
                        Old Cost
                      </label>
                      <input
                        readOnly
                        id="oldCost"
                        step=".000000000001"
                        type="number"
                        className="form-control "
                        name="old_cost"
                        value={item.Cost}
                      />
                    </div>
                    <div className="col-4">
                      <label
                        htmlFor="new_cost"
                        className="ms-2 my-1 fs-5  text-dark"
                      >
                        New Cost <span className="text-danger">*</span>
                      </label>
                      <input
                        required
                        onChange={(e) => inputOnChangeHandler(e, index)}
                        name="new_cost"
                        id="new_cost"
                        step=".01"
                        min={0}
                        type="number"
                        className="form-control "
                      />
                    </div>
                    <motion.button
                      onClick={() => {
                        handleNewProductRemove(index);
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      type="button"
                      name="Description"
                      id="productCode"
                      className="btn col-1 mt-4  border-0 fs-4 text-danger rounded-pill  "
                    >
                      <i className="mt-2 fa-solid fa-trash-can fs-2 fw-bolder"></i>
                    </motion.button>
                  </div>
                );
              })}

              <div className="col-12 my-2">
                <label
                  htmlFor="effective_date"
                  className="ms-2 my-1 fs-5  text-dark"
                >
                  Effective Date <span className="text-danger">*</span>
                </label>
                <input
                  required
                  min={today}
                  onChange={(e) => {
                    getDateHandler(e);
                  }}
                  name="effective_date"
                  id="effective_date"
                  type="date"
                  className="form-control "
                />
              </div>
              <div className="col-12 my-2 ">
                <motion.button
                  onClick={() => {
                    handleNewProduct();
                  }}
                  transition={{ duration: 0.3 }}
                  type="button"
                  name="Description"
                  id="productCode"
                  className="btn border-0 fs-4 text-dark rounded-pill  "
                >
                  {<i className="fa-solid fa-circle-plus fs-2 fw-bolder "></i>}
                </motion.button>
              </div>

              <div className="col-lg-8 col-10 p-1 text-lg-center text-start  my-4 alert-success alert">
                <p className=" my-1 fs-5  text-dark fw-bold">
                  Kindly note that any adjustment will affect only the primary
                  supplier .
                </p>
              </div>
              {costData.length > 0 && (
                <div className="col-12 my-2 text-end">
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
              )}

              <div className="col-12 p-1 row justify-content-between m-auto my-4 ">
                <Link
                  to="/mainpage/itemadjust/cost"
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

export default AdjustCost;
