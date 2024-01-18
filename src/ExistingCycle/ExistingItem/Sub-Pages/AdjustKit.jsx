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

const AdjustKit = () => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  // retrieves the user data from session storage and parses it into a JavaScript object.
  let { Id } = useParams();
  //get the Id parameter from the URL.
  let navigate = useNavigate();
  // kit state
  const [kitState, setKitState] = useState({
    loading: false,
    kitType: { ItemID: "", ItemLookupCode: Id, Description: "", ItemType: "" },
    kitDetails: [],
  });
  /*
This sets the initial state of the component's state variable kitState. It is an object with three properties - loading, kitType, and kitDetails.
loading is a boolean that is initially set to false.
kitType is an object that has four properties - ItemID, ItemLookupCode, Description, and ItemType. ItemLookupCode is initialized to the value of the Id parameter extracted earlier, while the other properties are initially set to empty strings.
kitDetails is an empty array.
   */
  // end
  const [isLoading, setIsLoading] = useState(false);
  //This sets the initial state of the isLoading state variable to false.

  const getTheKit = useCallback(async () => {
    try {
      setKitState((prev) => {
        return { ...prev, loading: true };
      });
      let response = await fetchDataItem(Id);

      setKitState((prev) => {
        return {
          ...prev,
          kitType: {
            ItemID: response.data.description[0]["ID"],
            ItemLookupCode: response.data.description[0].ItemLookupCode,
            Description: response.data.description[0].Description,
            ItemType: response.data.description[0].ItemType,
          },
          kitDetails: response.data.kit,
          loading: false,
        };
      });
    } catch (error) {
      setKitState((prev) => {
        return { ...prev, loading: false };
      });
    }
  }, [Id]);
  /*
This defines a function getTheKit that will be used to fetch the details of a kit from the server.
The useCallback hook is used to memoize this function so that it is not recreated on every render unless the Id parameter changes.
The function sets the loading property of kitState to true, indicating that the data is being fetched.
It then calls the fetchDataItem function with the Id parameter to get the details of the kit.
Once the data is fetched successfully, it sets the kitType and kitDetails properties of kitState to the fetched data.
Finally, it sets the loading property of kitState back to false.
If there is an error while fetching the data, it sets the loading property of kitState to false.
*/
  useEffect(() => {
    getTheKit();
  }, [getTheKit]);
  //This uses the useEffect hook to call the getTheKit function when the component mounts, and whenever the getTheKit function changes (which happens when the Id parameter changes).
  // Submitting Form
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/update-kit-type",
        { header: kitState.kitType, details: kitState.kitDetails }
      );
      setIsLoading(false);
      swal({
        text: "Kit updated successfully  ",
        icon: "success",
        button: false,
        timer: 1200,
      });
      setTimeout(() => {
        navigate("/mainpage/itemadjust/kit", {
          replace: true,
        });
      }, 1500);
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
async function formSubmit(e): This is an asynchronous function that handles the form submission event. It takes an event object as a parameter.

e.preventDefault(): This prevents the default behavior of the form when it is submitted.

setIsLoading(true): This sets a state variable named isLoading to true.

try {...} catch (error) {...}: This is a try-catch block that catches any errors that may occur during the execution of the code inside the try block.

const response = await axios.post("http://192.168.26.15/itemcreation-test/api/update-kit-type", { header: kitState.kitType, details: kitState.kitDetails }): This sends a POST request to the specified API endpoint with the header and details data from the kitState object.

setIsLoading(false): This sets the isLoading state variable to false.

swal({...}): This displays a message using the swal library to notify the user that the kit has been updated successfully.

setTimeout(() => {...}, 1500): This sets a timeout to navigate the user to the kit page after 1.5 seconds.

} catch (error) {...}: This catch block handles any errors that may occur during the execution of the code inside the try block.
 */
  const handleTypeChange = (e) => {
    setKitState((prev) => {
      return {
        ...prev,
        kitType: { ...prev.kitType, ItemType: e.target.value },
      };
    });
  };
  /*
const handleTypeChange = (e) => {...}: This is an arrow function that handles the change event of the ItemType select input. It updates the kitState object with the new selected value.

setKitState((prev) => {...}): This sets the kitState object using the previous state as a base, and updating the relevant fields with new values.
*/
  // Handling New Added Kit Products
  const handleNewProduct = () => {
    setKitState((prev) => {
      return {
        ...prev,
        kitDetails: [
          ...prev.kitDetails,
          {
            ItemLookupCode: "",
            Description: "",
            ComponentItemID: "",
            Quantity: "",
          },
        ],
      };
    });
  };
  //This is a function that handles adding a new product to the kit. It updates the kitState object by adding a new object to the kitDetails array.
  // Handling remove kit
  const handleNewProductRemove = (index) => {
    const list = [...kitState.kitDetails];
    list.splice(index, 1);
    setKitState((prev) => {
      return { ...prev, kitDetails: list };
    });
  };
  // This is a function that handles removing a product from the kit. It updates the kitState object by removing the specified object from the kitDetails array.
  // validating new added kit products
  async function kitDetailsHandler(e, index) {
    try {
      if (kitState.kitDetails[index].Description == "") {
        let list = [...kitState.kitDetails];
        if (e.target.value !== "" && e.target.value != Id) {
          let response = await axios.get(
            `http://192.168.26.15/itemcreation-test/api/get-type/${e.target.value}`
          );
          if (response.data.item.length > 0) {
            const responseObject = response.data.item[0];
            let existLookupCode = kitState.kitDetails.find((item) => {
              return (
                item.ItemLookupCode == e.target.value && item.Description != ""
              );
            });
            if (!existLookupCode) {
              list[index].ItemLookupCode = responseObject.ItemLookupCode;
              list[index].Description = responseObject.Description;
              list[index].ComponentItemID = responseObject.ID;
            } else {
              list.splice(index, 1);
              swal({
                text: "Lookup Code already Exists",
                icon: "error",
              });
              setKitState((prev) => {
                return { ...prev, kitDetails: list };
              });
              return;
            }
            swal({
              icon: "success",
              timer: 700,
              button: false,
            });
            setKitState((prev) => {
              return { ...prev, kitDetails: list };
            });
          } else {
            let list = [...kitState.kitDetails];
            list.splice(index, 1);
            setKitState((prev) => {
              return { ...prev, kitDetails: list };
            });
            swal({
              text: "You can't add that item to the kit",
              icon: "error",
            });
          }
        } else {
          list.splice(index, 1);
          swal({
            text: "Add Valid Lookup Code",
            icon: "error",
          });
          setKitState((prev) => {
            return { ...prev, kitDetails: list };
          });
          return;
        }
      }
    } catch (error) {
      e.target.value = "";
    }
  }
  /*
    This is an asynchronous function that handles the validation of new products added to the kit. It takes an event object and an index as parameters.

if (kitState.kitDetails[index].Description == "") {...}: This checks if the description of the product being validated is empty.

let list = [...kitState.kitDetails];: This creates a new array list that is a copy of the kitDetails array from the kitState object.

if (e.target.value !== "" && e.target.value != Id) {...}: This checks if the input value is not empty and is not equal to Id.

let response = await axios.get(http://192.168.26.15/itemcreation-test/api/get-type/${e.target.value}`)`: This sends a GET request to the specified API endpoint with the lookup code value.

const responseObject = response.data.item[0];: This creates a new object responseObject and sets it to the first item in the response data array.

let existLookupCode = kitState.kitDetails.find((item) => {...}): This searches the kitDetails array for an existing item with the same lookup code.
   */
  // getting input data onchange
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...kitState.kitDetails];
    list[index][name] = value;
    setKitState((prev) => {
      return { ...prev, kitDetails: list };
    });
  };

  // handling quantity rounding and adding user and ItemID for kitDetails
  if (kitState.kitDetails) {
    kitState.kitDetails.forEach((item) => {
      item.user = user.id;
      item.ItemID = kitState.kitType.ItemID;
      item.Quantity = Number(item.Quantity);
    });
    kitState.kitType.user = user.id;
  }

  let { loading, kitType, kitDetails } = kitState;
  return (
    <Frame headerLabel="Kit Adjustment">
      {loading ? (
        <Spinner />
      ) : (
        <form
          onSubmit={formSubmit}
          className="row justify-content-evenly align-items-center p-5"
        >
          <div className="col-4">
            <label
              htmlFor="ItemLookupCode"
              className=" ms-2 my-1  fs-5  text-dark"
            >
              Item Lookup Code
            </label>
            <input
              readOnly
              id="ItemLookupCode"
              name="ItemLookupCode"
              type="text"
              className="form-control "
              value={kitType.ItemLookupCode}
            />
          </div>
          <div className="col-4">
            <label htmlFor="Description" className="ms-2 my-1 fs-5   text-dark">
              RMS Description
            </label>
            <input
              required
              readOnly
              id="Description"
              type="text"
              className="form-control "
              value={kitType.Description}
            />
          </div>
          <div className="col-2">
            <label htmlFor="itemType" className="ms-2 my-1 fs-5   text-dark">
              Item Type
            </label>
            <select
              onChange={(e) => {
                handleTypeChange(e);
              }}
              name="ItemType"
              id="itemType"
              className="form-control "
              value={kitType.ItemType}
            >
              <option value="0">Standard</option>
              <option value="3">Kit</option>
            </select>
          </div>
          <div
            className="w-100 mt-3 mb-2 m-auto"
            style={{
              height: "5px",
              backgroundColor: "black",
            }}
          ></div>
          {kitType.ItemType == "3" &&
            kitDetails.map((item, index) => {
              return (
                <div
                  key={index}
                  className="  col-12 row border-3  border-bottom p-2  justify-content-evenly"
                >
                  <div className="col-4">
                    <label
                      htmlFor="ItemLookupCode"
                      className=" ms-2 my-1  fs-5  text-dark"
                    >
                      Item Lookup Code
                    </label>
                    <input
                      id="ItemLookupCode"
                      name="ItemLookupCode"
                      type="text"
                      required
                      disabled={item.Description.length > 3 ? true : false}
                      value={item.ItemLookupCode}
                      className="form-control "
                      onChange={(e) => {
                        handleInputChange(e, index);
                      }}
                      onBlur={(e) => {
                        kitDetailsHandler(e, index);
                      }}
                    />
                  </div>

                  <div className="col-4">
                    <label
                      htmlFor="Description"
                      className="ms-2 my-1 fs-5   text-dark"
                    >
                      Description
                    </label>
                    <input
                      readOnly
                      required
                      name="Description"
                      value={item.Description}
                      id="Description"
                      type="text"
                      className="form-control "
                    />
                  </div>
                  <div className="col-2">
                    <label
                      htmlFor="Quantity"
                      className="ms-2 my-1 fs-5   text-dark"
                    >
                      Quantity
                    </label>
                    <input
                      onChange={(e) => {
                        handleInputChange(e, index);
                      }}
                      required
                      value={item.Quantity}
                      id="Quantity"
                      min={0}
                      step={0.0001}
                      type="number"
                      name="Quantity"
                      className="form-control "
                    />
                  </div>
                  <div className="col-1">
                    <motion.button
                      onClick={() => {
                        handleNewProductRemove(index);
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      type="button"
                      className="btn col-1 mt-4  border-0 fs-4 text-danger rounded-pill  "
                    >
                      <i className="fa-solid mt-2 fa-circle-minus fs-2 fw-bolder"></i>
                    </motion.button>
                  </div>
                </div>
              );
            })}

          <div className="col-12  ms-auto  d-flex justify-content-between my-4 ">
            <div className="col-12 ms-auto  d-flex justify-content-between my-4 ">
              {kitType.ItemType == "3" && (
                <motion.button
                  onClick={(e) => {
                    handleNewProduct();
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  type="button"
                  name="Description"
                  id="productCode"
                  className="btn border-0 fs-4  text-dark rounded-pill  "
                >
                  <i className="fa-solid fa-circle-plus fs-2 fw-bolder "></i>
                </motion.button>
              )}

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
          </div>

          <div className="col-12 p-1 row justify-content-between m-auto my-4 ">
            <Link
              to="/mainpage/itemadjust/kit"
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
      )}
    </Frame>
  );
};

export default AdjustKit;
