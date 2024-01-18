import React, { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../../Spinner/Spinner";
import axios from "axios";
import MainButton from "../../../Components/MainButton/MainButton";
import swal from "sweetalert";
import Frame from "../../../Components/MainFrame/Frame";
import { fetchDataItem } from "../CustomHooks/getItemData";
const AdjustRelex = () => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //Retrieves user data from the browser's session storage and parses it as a JSON object. It assigns this object to the user variable.
  let { Id } = useParams();
  // Extracts the Id parameter from the URL using React Router's useParams hook. It assigns this value to the Id variable.
  let navigate = useNavigate();
  //Gets the navigate function from React Router's useNavigate hook, which allows you to navigate to other pages programmatically.
  const [isLoading, setIsLoading] = useState(false);
  ////Defines a state variable isLoading and its setter function setIsLoading, both initialized with the false value. This variable is used to indicate whether the form is currently submitting or not.
  const [relexState, setRelexState] = useState({
    loading: false,
    productDetails: { ID: "", ItemLookupCode: "", Description: "" },
    relexData: {
      ItemID: "",
      Primary_product: "",
      Product_flow: "",
      Private_brand: "",
      Brand_type: "",
      Warehouse_type: "",
      RELEX: "",
      SeasonStartDate: "",
      SeasonEndDate: "",
      Pallet_size: "",
      Pallet_layer_size: "",
      Spoiling_time: "",
      Required_remaining_shelf_life: "",
      Shelf_space: "",
      Ugly_shelf_point: "",
      Batch_size: "",
      MinimumDelivery: "",
      user: user.id,
    },
    relexAssortment: [],
  });
  // Defines a state variable relexState and its setter function setRelexState, both initialized with an object containing multiple properties that represent the current state of the Relex form.
  //  Posting new location
  const getRelexData = useCallback(async () => {
    try {
      setRelexState((prev) => {
        return { ...prev, loading: true };
      });
      const response = await fetchDataItem(Id);
      setRelexState((prev) => {
        return {
          ...prev,
          loading: false,
          productDetails: response.data.description[0],
          relexData: response.data.relex[0],
          relexAssortment: response.data.location,
        };
      });
    } catch (error) {
      swal({
        text: "Error while getting data please refresh page and try again",
        icon: "error",
      });
    }
  }, [Id]);
  //Defines a memoized callback function getRelexData that retrieves Relex data from an API endpoint using the fetchDataItem function. This function is only called when the Id parameter changes.
  useEffect(() => {
    getRelexData();
  }, [getRelexData]);
  // Calls the getRelexData function when the component mounts or when the getRelexData function changes.

  // Adding values to Assortment section
  const assortmentAuto = () => {
    let list = [...relexState.relexAssortment];
    list.forEach((item) => {
      item.Assortment_class = "AUTO";
    });
    setRelexState((prev) => {
      return { ...prev, relexAssortment: list };
    });
  };
  // Defines a function assortmentAuto that sets the Assortment_class property of each item in the relexState.relexAssortment array to "AUTO".
  const assortmentOut = () => {
    let list = [...relexState.relexAssortment];
    list.forEach((item) => {
      item.Assortment_class = "OUT";
    });
    setRelexState((prev) => {
      return { ...prev, relexAssortment: list };
    });
  };
  // Defines a function assortmentAuto that sets the Assortment_class property of each item in the relexState.relexAssortment array to "OUT".
  const assortmentSpot = () => {
    let list = [...relexState.relexAssortment];
    list.forEach((item) => {
      item.Assortment_class = "SPOT";
    });
    setRelexState((prev) => {
      return { ...prev, relexAssortment: list };
    });
  };
  // Defines a function assortmentAuto that sets the Assortment_class property of each item in the relexState.relexAssortment array to "SPOT".
  const assortmentZeroStock = () => {
    let list = [...relexState.relexAssortment];
    list.forEach((item) => {
      item.Assortment_class = "ZERO-STOCK";
    });
    setRelexState((prev) => {
      return { ...prev, relexAssortment: list };
    });
  };
  // Defines a function assortmentAuto that sets the Assortment_class property of each item in the relexState.relexAssortment array to "ZEROSTOCK".
  const assortmentFcst = () => {
    let list = [...relexState.relexAssortment];
    list.forEach((item) => {
      item.Assortment_class = "FCST";
    });
    setRelexState((prev) => {
      return { ...prev, relexAssortment: list };
    });
  };
  // Defines a function assortmentAuto that sets the Assortment_class property of each item in the relexState.relexAssortment array to "FCST".
  // End of it
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let responseDetails = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/update-relex",
        relexState.relexData
      );
      if (relexState.relexAssortment.length > 0) {
        let response = await axios.post(
          "http://192.168.26.15/itemcreation-test/api/update-location",
          relexState.relexAssortment
        );
      }
      setIsLoading(false);
      swal({
        text: "Relex Data updated successfully  ",
        icon: "success",
        button: false,
        timer: 1200,
      });
      setTimeout(() => {
        navigate("/mainpage/itemadjust/relex", { replace: true });
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      swal({
        title: `Ops`,
        text: "An error occurred please refresh the page and try again ",
        icon: "error",
        button: false,
        timer: 1200,
      });
    }
  }
  // Defines an asynchronous function formSubmit that is called when the Relex form is submitted. This function sends the updated Relex data to an API endpoint using the axios.post method, and navigates to the Relex page after a successful submission.

  // Handling product inputs onChange
  function updateInput(e) {
    setRelexState((prev) => {
      return {
        ...prev,
        relexData: { ...prev.relexData, [e.target.name]: e.target.value },
      };
    });
  }
  // Defines a function updateInput that updates the corresponding property in the relexData object when an input field is changed.
  // handling assortment class change
  const assortmentOnChangeHandler = (e, index) => {
    let list = [...relexState.relexAssortment];
    list[index].Assortment_class = e.target.value;
    setRelexState((prev) => {
      return { ...prev, relexAssortment: list };
    });
  };
  //: Defines a function assortmentOnChangeHandler that updates the Assortment_class property of a specific item in the relexState.relexAssortment array when a select field is changed.

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
  // handling added values to relex location and data
  if (relexState.relexAssortment.length > 0) {
    relexState.relexAssortment.forEach((item) => {
      item.user = user.id;
    });
    relexState.relexData.user = user.id;
    relexState.relexData.MinimumDelivery = Number(
      relexState.relexData.MinimumDelivery
    );
    relexState.relexData.Batch_size = Number(relexState.relexData.Batch_size);
    relexState.relexData.Pallet_layer_size = Number(
      relexState.relexData.Pallet_layer_size
    );
    relexState.relexData.Pallet_size = Number(relexState.relexData.Pallet_size);
    relexState.relexData.Shelf_space = Number(relexState.relexData.Shelf_space);
    relexState.relexData.Spoiling_time = Number(
      relexState.relexData.Spoiling_time
    );
    relexState.relexData.Required_remaining_shelf_life = Number(
      relexState.relexData.Required_remaining_shelf_life
    );
  }
  //Checks whether the relexState.relexAssortment array has at least one item. If so, it sets the user and MinimumDelivery properties of each item, and converts the Batch_size property to a number. It also sets the user, MinimumDelivery, and Batch_size properties of the relexData object.
  // Destructing props
  let { loading, productDetails, relexAssortment, relexData } = relexState;
  return (
    <Frame headerLabel="Relex Adjustment">
      {loading ? (
        <Spinner />
      ) : (
        <form
          onSubmit={formSubmit}
          className="row justify-content-evenly align-items-center p-5"
        >
          <div className="col-6">
            <label
              htmlFor="ItemLookupCode"
              className=" ms-2 my-1  fs-5  text-dark"
            >
              Item Lookup Code
            </label>
            <input
              readOnly
              value={productDetails.ItemLookupCode}
              id="ItemLookupCode"
              name="ItemLookupCode"
              type="text"
              className="form-control "
            />
          </div>

          <div className="col-6">
            <label htmlFor="Description" className="ms-2 my-1 fs-5   text-dark">
              RMS Description
            </label>
            <input
              readOnly
              value={productDetails.Description}
              id="Description"
              type="text"
              className="form-control "
            />
          </div>

          <div
            className="w-100 mt-3 mb-2 m-auto"
            style={{
              height: "5px",
              backgroundColor: "black",
            }}
          ></div>
          {relexAssortment.length > 0 ? (
            <>
              {" "}
              <div className="col-12 row g-3 border py-3 rounded-3 border-color">
                <div className="col-4">
                  <label htmlFor="RELEX" className="  text-dark fw-bolder px-4">
                    RELEX Item <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <select
                    id="RELEX"
                    readOnly
                    value={relexData.RELEX || ""}
                    name="RELEX"
                    type="text"
                    className="form-control  rounded-3  border-3 border   "
                  >
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div className="col-4">
                  <label
                    htmlFor="primary_product"
                    className="  text-dark fw-bolder px-4"
                  >
                    Primary Product{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <select
                    value={relexData.Primary_product || ""}
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    id="primary_product"
                    name="primary_product"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  >
                    <option value=""></option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <div className="col-4">
                  <label
                    htmlFor="private_brand"
                    className="  text-dark fw-bolder px-4"
                  >
                    Private Brand{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <select
                    value={relexData.Private_brand || ""}
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    id="private_brand"
                    name="Private_brand"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  >
                    <option value=""></option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div className="col-4">
                  <label
                    htmlFor="Brand_type"
                    className="  text-dark fw-bolder px-4"
                  >
                    Brand Type <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <select
                    value={relexData.Brand_type || ""}
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    id="Brand_type"
                    name="Brand_type"
                    className="form-control  rounded-3  border-3 border   "
                  >
                    <option value=""></option>
                    <option value="0">Local</option>
                    <option value="1">International</option>
                  </select>
                </div>
                <div className="col-4">
                  <label
                    htmlFor="Warehouse_type"
                    className="  text-dark fw-bolder px-4"
                  >
                    Warehouse Type{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <select
                    value={relexData.Warehouse_type || ""}
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    required
                    id="Warehouse_type"
                    name="Warehouse_type"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  >
                    <option value="0">Direct</option>
                    <option value="1">Dry</option>
                    <option value="2">Frozen</option>
                    <option value="3">Non-Food</option>
                    <option value="4">Consumables</option>
                  </select>
                </div>
                <div className="col-4">
                  <label
                    htmlFor="product_flow"
                    className="  text-dark fw-bolder px-4"
                  >
                    Product Flow{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <select
                    disabled
                    value={relexData.Product_flow || ""}
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    required
                    id="product_flow"
                    name="Product_flow"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  >
                    <option value=""></option>
                    <option value="0">Direct</option>
                    <option value="1">Indirect</option>
                  </select>
                </div>
                <div className="col-4">
                  <label
                    htmlFor="Batch_size"
                    className="  text-dark fw-bolder px-4"
                  >
                    Batch Size <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    value={relexData.Batch_size || ""}
                    min="0"
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    id="Batch_size"
                    name="Batch_size"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="MinimumDelivery"
                    className="  text-dark fw-bolder px-4"
                  >
                    Minimum Delivery{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    value={relexData.MinimumDelivery || ""}
                    min="0"
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    id="MinimumDelivery"
                    name="MinimumDelivery"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="Spoiling_time"
                    className="  text-dark fw-bolder px-4"
                  >
                    Spoiling Time (Days){" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    value={relexData.Spoiling_time || ""}
                    min="0"
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    required
                    id="Spoiling_time"
                    name="Spoiling_time"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="Required_remaining_shelf_life"
                    className="  text-dark fw-bolder px-4"
                  >
                    Remaining Shelf life{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    value={relexData.Required_remaining_shelf_life || ""}
                    min="0"
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    required
                    id="Required_remaining_shelf_life"
                    name="Required_remaining_shelf_life"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="Pallet_size"
                    className="  text-dark fw-bolder px-4"
                  >
                    Pallet Size
                  </label>
                  <input
                    value={relexData.Pallet_size || ""}
                    min="0"
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    required
                    id="Pallet_size"
                    name="Pallet_size"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="Pallet_layer_size"
                    className="  text-dark fw-bolder px-4"
                  >
                    Pallet Layer Size
                  </label>
                  <input
                    value={relexData.Pallet_layer_size || ""}
                    min="0"
                    required
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    id="Pallet_layer_size"
                    name="Pallet_layer_size"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="Shelf_space"
                    className="  text-dark fw-bolder px-4"
                  >
                    Shelf Space
                  </label>
                  <input
                    value={relexData.Shelf_space || ""}
                    min="0"
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    required
                    id="Shelf_space"
                    name="Shelf_space"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="u_spoint"
                    className="  text-dark fw-bolder px-4"
                  >
                    Ugly Shelf Point
                  </label>
                  <input
                    value={relexData.Ugly_shelf_point || ""}
                    min="0"
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    required
                    id="Ugly_shelf_point"
                    name="Ugly_shelf_point"
                    step=".001"
                    type="number"
                    className="form-control  rounded-3  border-3 border   "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="SeasonStartDate"
                    className="  text-dark fw-bolder px-4"
                  >
                    Seasonal Start Date
                  </label>
                  <input
                    value={relexData.SeasonStartDate || ""}
                    type="date"
                    id="SeasonStartDate"
                    name="SeasonStartDate"
                    min={today}
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    className="form-control  rounded-3  border-3 border   "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="SeasonEndDate"
                    className="  text-dark fw-bolder px-4"
                  >
                    Seasonal End Date
                  </label>
                  <input
                    value={relexData.SeasonEndDate || ""}
                    type="date"
                    id="SeasonEndDate"
                    name="SeasonEndDate"
                    onChange={(e) => {
                      updateInput(e);
                    }}
                    min={today}
                    className="form-control  rounded-3  border-3 border   "
                  />
                </div>
              </div>
              <div className="col-12 row g-3 my-3 border rounded-3 py-4 border-color">
                <div className="col-12 my-1 row justify-content-between g-3">
                  <div className="col-12">
                    <h4>
                      Check any of below buttons to submit Assortment values
                    </h4>
                  </div>
                  <div className="col-2 position-relative">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => {
                        assortmentAuto();
                      }}
                    >
                      AUTO
                    </button>
                  </div>
                  <div className="col-2 position-relative">
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => {
                        assortmentOut();
                      }}
                    >
                      OUT
                    </button>
                  </div>
                  <div className="col-2 position-relative">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => {
                        assortmentZeroStock();
                      }}
                    >
                      ZERO-STOCK
                    </button>
                  </div>
                  <div className="col-2 position-relative">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => {
                        assortmentFcst();
                      }}
                    >
                      FCST
                    </button>
                  </div>
                  <div className="col-2 position-relative">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => {
                        assortmentSpot();
                      }}
                    >
                      SPOT
                    </button>
                  </div>
                </div>
                {relexAssortment.map((item, index) => {
                  return (
                    <div key={index} className="col-3">
                      <div className=" position-relative ">
                        <label
                          htmlFor={item.StoreID}
                          className="  text-dark fw-bolder px-4"
                        >
                          {item.Name.toUpperCase()}{" "}
                          <span className=" fw-bolder text-danger">*</span>
                        </label>
                        <select
                          value={item.Assortment_class}
                          onChange={(e) => {
                            assortmentOnChangeHandler(e, index);
                          }}
                          required
                          id={item.StoreID}
                          name={item.Name}
                          type="text"
                          className="form-control  rounded-3  border-3 border   "
                        >
                          <option value="AUTO">AUTO</option>
                          <option value="SPOT">SPOT</option>
                          <option value="ZERO-STOCK">ZERO-STOCK</option>
                          <option value="FCST">FCST</option>
                          <option value="OUT">OUT</option>
                        </select>
                      </div>
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
            </>
          ) : (
            <div className="col-12 row justify-content-center text-center align-items-center p-5">
              <h1>We couldn't find any Relex data for that item</h1>
            </div>
          )}

          <div className="  col-12 p-1 row justify-content-between m-auto my-4 ">
            <Link
              to="/mainpage/itemadjust/relex"
              className=" G-link col-2 btn-hover text-center fs-3 text-decoration-none  text-dark border border-top-0 border-start-0 border-end-0"
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
      )}
    </Frame>
  );
};

export default AdjustRelex;
