import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../../Spinner/Spinner";
import axios from "axios";
import MainButton from "../../../Components/MainButton/MainButton";
import swal from "sweetalert";
import Frame from "../../../Components/MainFrame/Frame";
import { useCallback } from "react";
import { fetchDataItem } from "../CustomHooks/getItemData";

const AdjustBypass = () => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //: retrieves user data from sessionStorage and parses it as a JSON object.
  let { Id } = useParams();
  // extracts the Id parameter from the URL path using the useParams hook from React Router.
  let navigate = useNavigate();
  //returns a navigate function that can be used to navigate to different pages in the application.
  const [isLoading, setIsLoading] = useState(false);
  // declares a state variable isLoading initialized to false. It is used to indicate whether a request is currently being made.
  const [bypassState, setBypassState] = useState({
    loading: false,
    productData: {
      ID: "",
      ItemLookupCode: "",
      Description: "",
      ItemType: "",
      price: "",
    },
    bypass: [],
  });
  // set the not bypass items 
  const [notFound, setNotFound] = useState('')
  //declares a state variable bypassState initialized to an object with properties loading, productData, and bypass. These properties are used to store data related to the product and its bypass status.
  const [postLog, setPostLog] = useState({
    lookupcode: Id,
    action: `Bypass Adjustment`,
    user: user.id != null ? user.id : "",
  });
  //declares a state variable postLog initialized to an object with properties lookupcode, action, and user. These properties are used to store data related to the bypass adjustment action made by the user.
  const makeInStock = () => {
    let list = [...bypassState.bypass];
    list.forEach((item) => {
      item.StoreStatus = "1";
    });
    setBypassState((prev) => {
      return { ...prev, bypass: list };
    });
    setPostLog((prev) => {
      return {
        ...prev,
        action: `${user.name} Bypassed the item ${Id} to instock }`,
      };
    });
    setNotFound('')
  };
  const makeOutStock = () => {
    let list = [...bypassState.bypass];
    list.forEach((item) => {
      item.StoreStatus = "0";
    });
    setBypassState((prev) => {
      return { ...prev, bypass: list };
    });
    setPostLog((prev) => {
      return {
        ...prev,
        action: `${user.name} Bypassed the item ${Id} to out of stock }`,
      };
    });
    setNotFound('')
  };
  // function for removing bypass.
  const bypassFunHandler = async (ID) => {
    console.log('hello world ', ID);
    let res = await axios.post(`http://192.168.26.15/itemcreation-test/api/remove-bypass/${ID}`);
    let result = await res.data;
    swal({
      text: "Item removed successfully from bypass",
      icon: "success",
      button: false,
      timer: 1200,
    });
    console.log(result);
    getTheProduct();
  };


  const getTheProduct = useCallback(async () => {
    try {
      setBypassState((prev) => {
        return { ...prev, loading: true };
      });
      let response = await fetchDataItem(Id);
      console.log('BYPASS', response.data.bypass);
      if (response.data.bypass.length == 0) {
        setNotFound('Not Found');
      }
      setBypassState((prev) => {
        return {
          ...prev,
          loading: false,
          productData: response.data.description[0],
          bypass:
            response.data.bypass.length > 0
              ? response.data.bypass
              : [
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "7",
                  Name: "Zamalek",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "11",
                  Name: "Hacienda",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "12",
                  Name: "City Stars",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "19",
                  Name: "Dokki",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "20",
                  Name: "Diplo",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "24",
                  Name: "Designia",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "28",
                  Name: "Water Way",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "27",
                  Name: "Stella",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "32",
                  Name: "Katameya Heights",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "36",
                  Name: "AL-Guezira Hub",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "38",
                  Name: "El-Safwa",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "39",
                  Name: "Maadi_Hub",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "40",
                  Name: "El-Tagamoa_Hub",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "41",
                  Name: "Arkan",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "42",
                  Name: "El Gouna",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "44",
                  Name: "Almaza Bay",
                  StoreStatus: "",
                },
                {
                  RMS_ID: response.data.description[0].ID,
                  StoreID: "47",
                  Name: "Dunes",
                  StoreStatus: "",
                },
              ],
        };
      });
    } catch (error) { }
  }, [Id]);
  // a memoized asynchronous function that fetches the product data from the API using fetchDataItem function and sets the bypassState object with the response data.
  useEffect(() => {
    getTheProduct();
  }, [getTheProduct]);
  //a hook that runs the getTheProduct function when the component is mounted.
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/update-bypass",
        bypassState.bypass
      );
      let responseLog = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/log",
        postLog
      );
      swal({
        text: "Bypass Updated successfully  ",
        icon: "success",
        button: false,
        timer: 1200,
      });
      setIsLoading(false);
      setTimeout(() => {
        navigate("/mainpage/itemadjust/bypass", { replace: true });
      }, 2000);
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
  //an asynchronous function that sends a POST request to update the bypass status of the product and a log of the action made by the user.
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const list = [...bypassState.bypass];
    list[index].StoreStatus = value;
    setBypassState((prev) => {
      return { ...prev, bypass: list };
    });
    setPostLog((prev) => {
      return {
        ...prev,
        action: `${prev.action}&&${user.name
          } Bypassed the item ${Id} at store ${e.target.name} to ${value == "1" ? "In Stock" : "Out of Stock"
          }`,
      };
    });
  };

  // Adding user to relex array
  if (bypassState.bypass.length > 0) {
    bypassState.bypass.forEach((item) => {
      item.user = user.id;
    });
  }

  // end
  let { loading, productData, bypass } = bypassState;

  //array of option to set the default value to current value .
  let options = [
    {
      header: 'Instock',
      value: '1'

    },
    {
      header: 'Outstock',
      value: '0'

    },
    {
      header: 'set Bypass',
      value: ''

    }
  ]

  return (
    <React.Fragment>
      <Frame headerLabel="Bypass Product">
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <form
              onSubmit={formSubmit}
              className="row justify-content-evenly mt-5"
            >
              <div className="col-5">
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

              <div className="col-5">
                <label
                  htmlFor="productCodet"
                  className="ms-2 my-1 fs-5   text-dark"
                >
                  RMS Description
                </label>
                <input
                  readOnly
                  id="productCode"
                  type="text"
                  className="form-control "
                  value={productData.Description}
                />
              </div>
              <div className="col-12 row justify-content-center  text-center mt-3">
                <div className="col-12 mt-3 mb-2">
                  <h4>Check any of below buttons to submit Bypass values</h4>
                </div>
                <div className="col position-relative">
                  <button
                    className="btn btn-success"
                    type="button"
                    onClick={() => {
                      makeInStock();
                    }}
                  >
                    InStock
                  </button>
                </div>

                <div className="col position-relative">
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => {
                      makeOutStock();
                    }}
                  >
                    Out of Stock
                  </button>
                </div>
                <div className="col position-relative">
                  <button
                    className="btn btn-dark"
                    type="button"
                    onClick={() => {
                      bypassFunHandler(productData.ID)
                    }}
                  >
                    Remove bypass
                  </button>
                </div>
              </div>
              <div className="col-12">
                <div className="row mt-4 p-3 g-3">
                  {bypass.map((item, index) => {
                    return (
                      <div key={index} className="col-3">
                        <label
                          htmlFor={item.StoreID}
                          className="ms-2 my-1 fs-5 text-dark"
                        >
                          {item.Name}
                          <span className="fs-6 ms-3 fst-italic fw-lighter">
                            {notFound ? 'This item is not Bypass' : ''}
                          </span>
                        </label>
                        <select
                          required={true}
                          className="form-control"
                          name={item.Name}
                          id={item.StoreID}
                          value={item.StoreStatus}
                          onChange={(e) => {
                            handleInputChange(e, index);
                          }}
                        >
                          {
                            options.map((option) => <option value={option.value}>{option.header} </option>)
                          }
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-12 ms-auto my-4  text-end">
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
                  to="/mainpage/itemadjust/bypass"
                  className=" G-link col-2 btn-hover text-center fs-3 text-decoration-none  text-dark border border-top-0 border-start-0 border-end-0"
                >
                  New Search
                </Link>
                <Link
                  to="/mainpage"
                  className=" G-link col-2 text-center btn-hover fs-3 text-decoration-none  text-dark border border-top-0 border-start-0 border-end-0"
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

export default AdjustBypass;
