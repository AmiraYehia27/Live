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
import moment from "moment";

const AdjustPrice = () => {
  let [mainPrice, setMainPrice] = useState('');
  let [errorEdit, setErrorEdit] = useState(false);

  // Getting user Data 
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //This line declares a variable called user and assigns it the value of the user data stored in the browser's sessionStorage. The sessionStorage.getItem("userData") method retrieves the user data from the sessionStorage as a string, which is then parsed into a JavaScript object using JSON.parse().

  // States Manager
  let { Id } = useParams();
  //This line extracts the value of the Id parameter from the URL using the useParams() hook from the react-router-dom library. The extracted value is destructured into a variable called Id.

  let navigate = useNavigate();

  //This line declares a variable called navigate and assigns it the value of the useNavigate() hook from the react-router-dom library. This hook provides a way to navigate to different routes within the application.

  const [isLoading, setIsLoading] = useState(false);
  //This line declares a state variable called isLoading using the useState() hook. The isLoading variable is initialized with a value of false, and the setIsLoading function is used to update its value.

  const [priceState, setPriceState] = useState({
    loading: false,
    priceData: [],
    date: "",
  });
  //This line declares a state variable called priceState using the useState() hook. The priceState variable is initialized with an object that contains three properties: loading, priceData, and date. The loading property is initialized with a value of false, priceData is initialized with an empty array, and date is initialized with an empty string. The setPriceState function is used to update the state of the priceState variable.

  const [postLog, setPostLog] = useState({
    lookupcode: Id,
    action: `Price Adjustment`,
    user: user.id != null ? user.id : "",
  });
  //This line declares a state variable called postLog using the useState() hook. The postLog variable is initialized with an object that contains three properties: lookupcode, action, and user. The lookupcode property is initialized with the value of the Id variable, action is initialized with the string "Price Adjustment", and user is initialized with the id property of the user object, if it exists, or an empty string if it doesn't. The setPostLog

  const getTheProduct = useCallback(async () => {
    try {
      setPriceState((prev) => {
        return { ...prev, loading: true };
      });
      let response = await fetchDataItem(Id);
      setPriceState((prev) => {
        return {
          ...prev,
          loading: false,
          priceData: response.data.description,
        };
      });
    } catch (error) {
      swal({
        text: "Error while getting price data please refresh the page ",
        icon: "error",
      });
      setPriceState((prev) => {
        return { ...prev, loading: false };
      });
    }
  }, [Id]);
  /*
const declares a new constant named getTheProduct
useCallback() is a React Hook that returns a memoized callback function
The callback function contains an async function that updates the priceState state based on the result of the fetchDataItem() function
fetchDataItem() function is not shown in the provided code and is presumably an asynchronous function that fetches data
   */
  useEffect(() => {
    getTheProduct();
  }, [getTheProduct]);
  /*
useEffect() is a React Hook that runs a side effect
getTheProduct() function is called when the component mounts and whenever getTheProduct changes
   */

  // Submiting data
  async function formSubmit(e) {
    e.preventDefault();
    if (errorEdit) {
      swal({
        title: `Ops`,
        text: "please check of price updates ",
        icon: "error",
        button: false,
        timer: 1200,
      });
    }
    else {
      setIsLoading(true);
      try {
        let responseLog = await axios.post(
          "http://192.168.26.15/itemcreation-test/api/log",
          postLog
        );
        let response = await axios.post(
          "http://192.168.26.15/itemcreation-test/api/update-price",
          priceState.priceData
        );
        if (response) {
          setIsLoading(false);
          swal({
            title: `Hi ${user.name}`,
            text: "Cost updated successfully  ",
            icon: "success",
            button: false,
            timer: 1200,
          });
          setTimeout(() => {
            navigate("/mainpage/itemadjust/price", { replace: true });
          }, 1500);
        } else {
          swal({
            title: `Hi ${user.name}`,
            text: "please enter valid data  ",
            icon: "warning",
            button: false,
            timer: 1200,
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
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
  }


/*
 async function formSubmit(e): Defines an asynchronous function called formSubmit that takes an event object as its argument.

e.preventDefault();: Prevents the default behavior of the event object from occurring. In this case, it prevents the form from being submitted and the page from being refreshed.

setIsLoading(true);: Sets a state variable called isLoading to true, indicating that the form is currently being submitted and the user should wait for a response.

try {...} catch (error) {...}: Wraps the code inside a try block that attempts to execute the code within it. If there is an error, it is caught and handled by the catch block.

let responseLog = await axios.post("http://192.168.26.15/itemcreation-test/api/log", postLog);: Makes a POST request using Axios to the specified endpoint with the postLog data. The await keyword is used to indicate that the code should wait for the response from the server before proceeding.

let response = await axios.post("http://192.168.26.15/itemcreation-test/api/update-price", priceState.priceData);: Makes another POST request using Axios to a different endpoint with the priceState.priceData data.

if (response) {...} else {...}: Checks if the response from the second POST request is truthy. If it is, it means that the request was successful and the user is notified of the successful update. If it is falsy, the user is notified of the invalid data input.

setIsLoading(false);: Sets the isLoading state variable to false, indicating that the form submission is complete.

setTimeout(() => {...}, 1500);: Sets a timeout of 1.5 seconds before navigating to a new page.
 */
// Getting inputs Data
const inputOnChangeHandler = (e, index) => {
  console.log(e)
  if (e.target.name == 'new_tierPriceC' || e.target.name == 'new_orangePriceA') {
    if (e.target.value > mainPrice) {
      console.log(e.target.value, typeof e.target.value);
      console.log(mainPrice, typeof mainPrice);
      setErrorEdit(true);
    } else {
      console.log(e.target.value > mainPrice)
      setErrorEdit(false);
      let list = [...priceState.priceData];
      list[index][e.target.name] = e.target.value;
      setPriceState((prev) => {
        return { ...prev, priceData: list };
      });
      setPostLog((prev) => {
        return {
          ...prev,
          action: `${user.name} adjusted the item ${Id} Price from ${priceState.priceData[index].price} to ${priceState.priceData[index].new_price}  `,
        };
      });
    }
  } else {
    let list = [...priceState.priceData];
    list[index][e.target.name] = e.target.value;
    setPriceState((prev) => {
      return { ...prev, priceData: list };
    });
    setPostLog((prev) => {
      return {
        ...prev,
        action: `${user.name} adjusted the item ${Id} Price from ${priceState.priceData[index].price} to ${priceState.priceData[index].new_price}  `,
      };
    });
  }
}


/*
Defines a function called inputOnChangeHandler that takes an event object and an index as its arguments. The function is used to handle changes made to the inputs on the form.
 
setPriceState((prev) => {...});: Sets the priceState state variable to a new value using the setPriceState function. The function is used to update the priceData array with the new data input.
 
setPostLog((prev) => {...});: Sets the postLog state variable to a new value using the setPostLog function. The function is used to update the action property of the postLog object with information about the action performed by the user.
 */
// Set MinDate to Today
// let today = new Date();
// let dd = today.getDate() + 1;
// let mm = today.getMonth() + 1; //January is 0!
// let yyyy = today.getFullYear();

// if (dd < 10) {
//    dd = "0" + dd;
// }

// if (mm < 10) {
//    mm = "0" + mm;
// }

// today = yyyy + "-" + mm + "-" + dd;
//\\------------------------------------------------------------//\\//
const [minValue, setMinValue] = useState("");

useEffect(() => {
  const updateMinValue = () => {
    const now = moment();
    const sixPM = moment("18:00:00", "HH:mm:ss");
    const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
    const afterTomorrow = moment().add(2, "days").format("YYYY-MM-DD");

    if (now.isAfter(sixPM, "second")) {
      setMinValue(afterTomorrow);
    } else {
      setMinValue(tomorrow);
    }
  };

  updateMinValue(); // Initial update

  const interval = setInterval(updateMinValue, 1000); // Update every second

  return () => {
    clearInterval(interval); // Cleanup the interval on unmount
  };
}, []);

//\\------------------------------------------------------------//\\//

// Handling New Added Products
const handleNewProduct = () => {
  setPriceState((prev) => {
    return {
      ...prev,
      priceData: [...prev.priceData, { ItemLookupCode: "" }],
    };
  });
};
// Defines a function called handleNewProduct that adds a new item to the priceData array in the priceState state variable.
const handleNewProductRemove = (index) => {
  const list = [...priceState.priceData];
  list.splice(index, 1);
  setPriceState((prev) => {
    return { ...prev, priceData: list };
  });
};
// Defines a function called handleNewProductRemove that removes an item from the priceData array in the priceState state variable.
const getDateHandler = (e) => {
  setPriceState((prev) => {
    return { ...prev, date: e.target.value };
  });
};
// Getting new Added product on Blur
async function getProductData(e, index) {
  let list = [...priceState.priceData];
  if (list[index].ItemLookupCode == "") {
    try {
      if (e.target.value != "") {
        const existCode = list.find(
          (item) => item.ItemLookupCode == e.target.value
        );
        if (!existCode) {
          let response = await axios.get(
            `http://192.168.26.15/itemcreation-test/api/all-data/${e.target.value}`
          );
          list[index].Description = response.data.description[0].Description;
          list[index].price = response.data.description[0].price;
          list[index].tierPriceC = response.data.description[0].PriceC;
          list[index].orangePriceA = response.data.description[0].PriceA;
          list[index].ItemLookupCode = e.target.value;
          setPriceState((prev) => {
            return { ...prev, priceData: list };
          });
        } else {
          swal({
            text: "Lookup code Exists",
            icon: "error",
          });
          list.splice(index, 1);
          setPriceState((prev) => {
            return { ...prev, priceData: list };
          });
        }
      } else {
        swal({
          text: "You cannot leave the lookup code empty",
          icon: "error",
        });
        list.splice(index, 1);
        setPriceState((prev) => {
          return { ...prev, priceData: list };
        });
      }
    } catch (error) {
      swal({
        text: "Cannot Find that Code",
        icon: "error",
      });
      list.splice(index, 1);
      setPriceState((prev) => {
        return { ...prev, priceData: list };
      });
    }
  }
}
//edit price for comparasion

useEffect(() => {
  console.log("priceData", priceState.priceData)
  if (priceState.priceData.length) {
    if (priceState.priceData[0].new_price) {
      setMainPrice(priceState.priceData[0].new_price)

    } else {
      setMainPrice(priceState.priceData[0].price)
    }
  }
}, [priceState])
//Defines a function called getDateHandler that sets the date property in the priceState state variable to the selected date.
// Adding date to priceData
priceState.priceData.forEach((item) => {
  item.date = priceState.date;
  item.user = user.id;
});
// Destructing props
let { loading, priceData } = priceState;
console.log("priceData", priceData)
console.log("mainPrice", mainPrice);
console.log('error', errorEdit)
return (
  <React.Fragment>
    <Frame headerLabel="Price Adjustment">
      {" "}
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <form
            onSubmit={formSubmit}
            className="row  justify-content-evenly align-self-center p-3 "
            style={{ maxHeight: "80vh", overflowY: "scroll" }}
          >
            {priceData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="row border-top p-2 my-1 justify-content-between">
                  <div className="col">
                    <label
                      htmlFor="ItemLookupCode"
                      className=" ms-2 my-1  fs-5 text-dark "
                    >
                      Item Lookup Code
                    </label>
                    <input
                      onBlur={(e) => {
                        getProductData(e, index);
                      }}
                      disabled={item.ItemLookupCode != "" ? true : false}
                      defaultValue={item.ItemLookupCode || ""}
                      id="ItemLookupCode"
                      name="ItemLookupCode"
                      type="text"
                      className="form-control "
                    />
                  </div>

                  <div className="col">
                    <label
                      htmlFor="Description"
                      className="ms-2 my-1 fs-5  text-dark"
                    >
                      Description
                    </label>
                    <input
                      readOnly
                      defaultValue={item.Description || ""}
                      id="Description"
                      type="text"
                      className="form-control "
                    />
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label
                        htmlFor="price"
                        className="ms-2 my-1 fs-5  text-dark"
                      >
                        Current Price
                      </label>
                      <input
                        readOnly
                        id="price"
                        step=".000000000001"
                        type="number"
                        className="form-control "
                        name="price"
                        defaultValue={item.price}
                      />
                    </div>
                    <div className="col-6">
                      <label
                        htmlFor="new_price"
                        className="ms-2 my-1 fs-5  text-dark"
                      >
                        New Price
                      </label>
                      <input
                        onChange={(e) => {
                          inputOnChangeHandler(e, index);
                        }}
                        name="new_price"
                        step=".01"
                        min={0}
                        type="number"
                        className="form-control "
                      />
                    </div>
                    <div className="col-6">
                      <label
                        htmlFor="tierPriceC"
                        className="ms-2 my-1 fs-5  text-dark"
                      >
                        Current Gourmet Gold/VIP Price
                      </label>
                      <input
                        readOnly
                        id="tierPrice"
                        step=".01"
                        type="number"
                        className="form-control "
                        name="tierPriceC"
                        defaultValue={item.PriceC}
                      />
                    </div>
                    <div className="col-6">
                      <label
                        htmlFor="new_tierPriceC"
                        className="ms-2 my-1 fs-5  text-dark"
                      >
                        New Gourmet Gold/VIP Price
                      </label>
                      <input

                        onChange={(e) => {
                          inputOnChangeHandler(e, index);
                        }}
                        name="new_tierPriceC"
                        step=".01"
                        min={0}
                        type="number"
                        className="form-control "
                      />
                    </div>
                    <div className="col-6">
                      <label
                        htmlFor="orangePriceA"
                        className="ms-2 my-1 fs-5  text-dark"
                      >
                        Current Orange Gold/VIP Price
                      </label>
                      <input
                        readOnly
                        id="tierPrice"
                        step=".01"
                        type="number"
                        className="form-control "
                        name="orangePriceA"
                        defaultValue={item.PriceA}
                      />
                    </div>

                    <div className="col-6">
                      <label
                        htmlFor="new_orangePriceA"
                        className="ms-2 my-1 fs-5  text-dark"
                      >
                        New Orange Gold/VIP Price
                      </label>
                      <input

                        onChange={(e) => {
                          inputOnChangeHandler(e, index);
                        }}
                        name="new_orangePriceA"
                        step=".01"
                        min={0}
                        type="number"
                        className="form-control "
                      />
                    </div>

                  </div>
                  {
                    errorEdit ? <div className="bg-danger text-white p-3 rounded mt-3">New Gourmet Gold/VIP Price OR New Orange Gold/VIP Price  must not exceed the price</div> : ""
                  }


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
            {/* effective date */}
            <div className="col-12 my-2  ">
              <span
                htmlFor="effective_date"
                className="  fs-5  text-dark d-block"
              >
                Effective Date :
              </span>
              <input

                min={minValue}
                onChange={(e) => {
                  getDateHandler(e);
                }}
                className="form-control"
                name="effective_date"
                id="effective_date"
                type="date"
              />
            </div>
            <div className="col-12 ms-auto  d-flex justify-content-between my-4 align-items-center">
              <motion.button
                onClick={() => {
                  handleNewProduct();
                }}
                transition={{
                  duration: 0.3,
                }}
                type="button"
                name="Description"
                id="productCode"
                className="btn border-0 fs-4 text-dark rounded-pill  "
              >
                {<i className="fa-solid fa-circle-plus fs-2 fw-bolder "></i>}
              </motion.button>
            </div>
            {priceData.length > 0 && (
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
                to="/mainpage/itemadjust/price"
                className="G-link col-6 btn-hover text-center fs-3 text-decoration-none text-dark border border-top-0 border-start-0 border-end-0"
              >
                New Search
              </Link>
              <Link
                to="/mainpage"
                className="G-link col-6 text-center btn-hover fs-3 text-decoration-none text-dark border border-top-0 border-start-0 border-end-0"
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

export default AdjustPrice;
