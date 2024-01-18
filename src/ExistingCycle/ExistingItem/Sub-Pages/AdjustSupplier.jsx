import React, { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Spinner from "../../../Spinner/Spinner";
import axios from "axios";
import MainButton from "../../../Components/MainButton/MainButton";
import swal from "sweetalert";
import Frame from "../../../Components/MainFrame/Frame";
import { fetchDataItem } from "../CustomHooks/getItemData";
const AdjustSupplier = () => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //This line retrieves the user data from session storage, which was previously saved as a JSON object.
  let { Id } = useParams();
  //This line uses the useParams() hook from React Router to extract the ID parameter from the URL.
  let navigate = useNavigate();
  //This line uses the useNavigate() hook from React Router to get a function for programmatically navigating to other pages.
  const [isLoading, setIsLoading] = useState(false);
  //This line uses the useState() hook to initialize a state variable isLoading to false, and a function setIsLoading for updating the state.
  // Supplier State
  const [supplierState, setSupplierState] = useState({
    loading: false,
    productDetails: { ID: "", Description: "", ItemLookupCode: "" },
    suppliersList: [],
    suppliersDetails: [],
    newSupplierAdded: false,
  });
  // This line uses the useState() hook to initialize a state variable supplierState to an object with several properties and default values.
  // Fetching data using effect hook
  const getSuppliers = useCallback(async () => {
    try {
      setSupplierState((prev) => {
        return { ...prev, loading: true };
      });
      let response = await fetchDataItem(Id);
      let responseSup = await axios.get(
        "http://192.168.26.15/itemcreation-test/api/supplier"
      );
      setSupplierState((prev) => {
        return {
          ...prev,
          loading: false,
          productDetails: response.data.description[0],
          suppliersList: responseSup.data.suppliers,
          suppliersDetails: response.data.supplier,
        };
      });
      console.log();
      // Setting suppliers change objects
    } catch (error) {}
  }, [Id]);
  //This line uses the useCallback() hook to define a memoized callback function getSuppliers that fetches data from an API and updates the supplierState object. The Id parameter is used as a dependency for the memoization.
  useEffect(() => {
    getSuppliers();
  }, [getSuppliers]);
  //This line uses the useEffect() hook to run the getSuppliers() function when the component mounts, and whenever the getSuppliers function changes (i.e. when the Id parameter changes).
  // Submitting supplier form
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(supplierState.suppliersDetails);
      const response = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/supplier-add",
        supplierState.suppliersDetails
      );

      setIsLoading(false);
      swal({
        text: "Supplier Data updated successfully  ",
        icon: "success",
        button: false,
        timer: 1200,
      });
      setTimeout(() => {
        navigate("/mainpage/itemadjust/supplier", { replace: true });
      }, 1500);
    } catch (error) {
      console.log(error);
      if (error.response.data.message.includes("Item_Supplier_Adjustment")) {
        setIsLoading(false);
        swal({
          text: "Supplier Data updated successfully  ",
          icon: "success",
          button: false,
          timer: 1200,
        });
        setTimeout(() => {
          navigate("/mainpage/itemadjust/supplier", { replace: true });
        }, 1500);
      } else {
        swal({
          title: `Ops`,
          text: "An error occurred please refresh the page and try again ",
          icon: "error",
          button: false,
          timer: 1200,
        });
      }

      setIsLoading(false);

      console.log(error);
      console.log(supplierState.suppliersDetails);
    }
  }

  // This is an asynchronous function that handles form submission. It sends a POST request to an API and updates the isLoading state variable and supplierState object based on the response.
  // getting input data onchange
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...supplierState.suppliersDetails];
    list[index][name] = value;
    if (name == "supplierID") {
      list[index].SupplierName = e.target.selectedOptions[0].innerText;
    }
    setSupplierState((prev) => {
      console.log(list);
      return { ...prev, suppliersDetails: list };
    });
  };
  //This function handles input change events for the form inputs. It updates the supplierState object based on the user input.
  // Handling New suppliers
  const handleNewSupplier = () => {
    setSupplierState((prev) => {
      return {
        ...prev,
        newSupplierAdded: true,
        suppliersDetails: [
          ...prev.suppliersDetails,
          {
            isNew: 1,
            supplierID: "",
            SupplierName: "",
            Cost: "",
            MasterPackQuantity: "",
            TaxRate: "",
            ItemID: supplierState.productDetails.ID,
            primary: "",
          },
        ],
      };
    });
  };

  //This function handles the addition of a new supplier to the supplierState object.
  // Handling remove kit
  const handleSupplierDelete = (index) => {
    const list = [...supplierState.suppliersDetails];
    if (list[index].isNew) {
      list.splice(index, 1);
      setSupplierState((prev) => {
        return { ...prev, newSupplierAdded: false, suppliersDetails: list };
      });
    } else {
      list.splice(index, 1);
      setSupplierState((prev) => {
        return { ...prev, suppliersDetails: list };
      });
    }
    console.log(list);
  };
  //This function handles the deletion of a supplier from the supplierState object.
  // Validating for new Supplier
  const newSupplierValidator = (e, index) => {
    if (supplierState.suppliersDetails[index].Cost == "") {
      if (e.target.value != "") {
        let existSupplier = supplierState.suppliersDetails.find((item) => {
          return item.supplierID == e.target.value && item.Cost != "";
        });
        const list = [...supplierState.suppliersDetails];
        if (existSupplier) {
          list.splice(index, 1);
          swal({
            text: "Supplier already exists",
            icon: "error",
          });
          setSupplierState((prev) => {
            return { ...prev, suppliersDetails: list };
          });
        }
      }
    }
  };
  // This function validates the input for new suppliers.
  // handling Primary supplier
  const handlePrimary = (e, index) => {
    if (e.target.value == "1") {
      const list = [...supplierState.suppliersDetails];
      list.forEach((item) => {
        if (item != supplierState.suppliersDetails[index]) {
          item.primary = 0;
        }
      });
      setSupplierState((prev) => {
        return { ...prev, suppliersDetails: list };
      });
    }
  };
  // This function handles the selection of a primary supplier.
  // adding user ti supplier object
  if (supplierState.suppliersDetails.length > 0) {
    supplierState.suppliersDetails.forEach((item) => {
      item.user = user.id;
      // item.TaxRate = item.TaxRate
      item.Cost = Number(item.Cost);
    });
  }
  //This block of code updates the supplierState object by adding the user ID to each supplier object and converting the Cost property to a number.

  const [taxes, setTaxes] = useState([]);
  const [selectedTax, setSelectedTax] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://192.168.26.15/itemcreation-test/api/taxes");
      setTaxes(response.data.taxes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTaxChange = (event) => {
    setSelectedTax(event.target.value);
  };

  // Destructing props from Supplier State
  let { loading, suppliersDetails, suppliersList, productDetails } =
    supplierState;

  return (
    <Frame headerLabel="Supplier Adjustment">
      {loading ? (
        <Spinner />
      ) : (
        <form className="row justify-content-evenly" onSubmit={formSubmit}>
          <div className="col-5">
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
              value={productDetails.ItemLookupCode}
            />
          </div>

          <div className="col-5">
            <label htmlFor="productCodet" className="ms-2 my-1 fs-5  text-dark">
              RMS Description
            </label>
            <input
              readOnly
              id="productCode"
              type="text"
              className="form-control "
              value={productDetails.Description}
            />
          </div>
          <div
            className="w-100 mt-3 mb-2 m-auto"
            style={{ height: "5px", backgroundColor: "black" }}
          ></div>
          {suppliersDetails.map((supplier, index) => {
            return (
              <div key={index} className="col-12 my-2 row align-items-center">
                <div className="col-2 ">
                  <label
                    htmlFor="primary"
                    className="ms-2 my-1 fs-5  text-dark"
                  >
                    Primary
                  </label>
                  <select
                    required
                    onChange={(e) => {
                      handleInputChange(e, index);
                      handlePrimary(e, index);
                    }}
                    value={supplier.primary}
                    name="primary"
                    id="primary"
                    className="form-control rounded-3  border-3 border  "
                  >
                    <option value=""></option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
                <div className="col-3">
                  <label
                    htmlFor="supplierID"
                    className="ms-2 my-1 fs-5  text-dark"
                  >
                    Supplier
                  </label>
                  <select
                    onChange={(e) => {
                      handleInputChange(e, index);
                      newSupplierValidator(e, index);
                    }}
                    id="supplierID"
                    disabled={supplier.Cost.length > 0 ? true : false}
                    value={supplier.supplierID}
                    name="supplierID"
                    type="number"
                    required
                    className="form-control rounded-3  border-3 border   "
                  >
                    <option value="">Select Supplier</option>
                    {suppliersList.map((supply) => {
                      return (
                        <option key={supply.ID} value={supply.ID}>
                          {supply.SupplierName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-2">
                  <label htmlFor="Cost" className="ms-2 my-1 fs-5  text-dark">
                    Cost
                  </label>
                  <input
                    min={0}
                    required
                    step=".01"
                    onChange={(e) => {
                      handleInputChange(e, index);
                    }}
                    value={supplier.Cost}
                    name="Cost"
                    id="Cost"
                    type="number"
                    className="form-control "
                  />
                </div>
                <div className="col-2">
                  <label
                    htmlFor="MasterPackQuantity"
                    className="ms-2 my-1 fs-5  text-dark"
                  >
                    MPQ
                  </label>
                  <input
                    step=".01"
                    required
                    min={0}
                    onChange={(e) => {
                      handleInputChange(e, index);
                    }}
                    value={supplier.MasterPackQuantity}
                    name="MasterPackQuantity"
                    id="MasterPackQuantity"
                    type="number"
                    className="form-control "
                  />
                </div>
                <div className="col-2">
                  <label
                    htmlFor="TaxRate"
                    className="ms-2 my-1 fs-5  text-dark"
                  >
                    Tax (<span>Current Tax {suppliersDetails[0].TaxRate}</span>)
                  </label>
                  <select
                    step=".01"
                    required
                    min={0}
                    onChange={(e) => {
                      handleInputChange(e, index);
                    }}
                    //   value={Number(supplier.TaxRate) || ""}
                    name="TaxRate"
                    id="TaxRate"
                    type="number"
                    className="form-control"
                  >
                    <option defaultValue>Select Tax</option>
                    {taxes.map((tax) => (
                      <option defaultValue key={tax.ID} value={tax.Percentage}>
                        {tax.Description}
                      </option>
                    ))}
                  </select>
                </div>
                {index > 0 && (
                  <div className="col-1">
                    <motion.button
                      onClick={() => {
                        handleSupplierDelete(index);
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
                )}
              </div>
            );
          })}

          <div className="col-12 ms-auto  d-flex justify-content-between my-4 ">
            {!supplierState.newSupplierAdded && (
              <motion.button
                onClick={() => {
                  handleNewSupplier();
                }}
                transition={{ duration: 0.3 }}
                type="button"
                name="Description"
                id="productCode"
                className="btn border-0 fs-4 text-success rounded-3  "
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

          <div className="col-8 p-1 text-center m-auto my-4 alert-success alert">
            <p className=" my-1  fs-5  text-dark fw-bold">
              NOTE: Adjustments Made To Tax Will be Effective Starting From the
              Next Day (Sales Tax).
            </p>
          </div>
          <div className="col-12 p-1 row justify-content-between m-auto my-4 ">
            <Link
              to="/mainpage/itemadjust/supplier"
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
      )}
    </Frame>
  );
};

export default AdjustSupplier;
