import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../Spinner/Spinner";
import axios from "axios";

import SubButton from "../../Components/SubButton/SubButton";
import Frame from "../../Components/MainFrame/Frame";
import MainButton from "../../Components/MainButton/MainButton";
import swal from "sweetalert";
const PlanningView = () => {
  let user = JSON.parse(sessionStorage.getItem("userData")); // Calling a user object from session storage
  let { Id } = useParams();
  // catching the params of the url using the hook useParams which returns and object with all url params /mainpage/id and used the syntax {id} to destruct that property from the params object
  let navigate = useNavigate();
  // This line uses the useNavigate hook provided by the react-router-dom package to get the navigate function, which can be used to navigate to different routes.
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  //These lines are using the useState hook to create state variables for departments, categories, and suppliers, which are initially set to empty arrays
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  let [isSubmitted, setIsSubmitted] = useState(false);
  //These lines are using the useState hook to create state variables for isLoadingReject and isLoadingApprove, which are initially set to false.
  const [planningApproval, setPlanningApproval] = useState({
    id: "",
    pAccepted: false,
    pRejected: false,
    reason: "",
    checkup: false,
  });
  //This line is using the useState hook to create a state variable for planningApproval, which is initially set to an object with properties for id, pAccepted, pRejected, reason, and checkup.
  let [state, setState] = useState({
    loading: false,
    products: [],
    errorMessage: "",
  });
  //This line is using the useState hook to create a state variable for state, which is initially set to an object with properties for loading, products, and errorMessage.

  const [postLog, setPostLog] = useState({
    lookupcode: Id,
    action: "",
    user: user.id !== null ? user.id : "",
  });
  // These lines define multiple state variables using the useState hook. Each state variable is initialized with an initial value.
  async function getTheProduct() {
    try {
      setState({ ...state, loading: true });
      let response = await axios.get(
        `http://192.168.26.15/itemcreation-test/api/show-product/${Id}`
      );
      let responseDepartments = await axios.get(
        "http://192.168.26.15/itemcreation-test/api/departments"
      );
      let responseCat = await axios.get(
        "http://192.168.26.15/itemcreation-test/api/category"
      );
      let responseSup = await axios.get(
        "http://192.168.26.15/itemcreation-test/api/supplier"
      );

      setDepartments(responseDepartments.data.departments);
      setCategories(responseCat.data.categories);
      setSuppliers(responseSup.data.suppliers);
      // console.log(response);
      if (response.data.data[0].online === "0") {
        setPlanningApproval({
          ...planningApproval,
          checkup: true,
        });
      }
      setPlanningApproval({
        ...planningApproval,
        id: response.data.data[0].id,
      });
      setState({
        ...state,
        loading: false,
        products: response.data.data,
      });
    } catch (error) {
      setState({ ...state, loading: false, errorMessage: error.message });
    }
  }
  //This line is using the useState hook to create a state variable for postLog, which is initially set to an object with properties for lookupcode, action, and user. The lookupcode property is set to the Id variable passed as a parameter, the action property is initially set to an empty string, and the user property is set to user.id if it is not null, otherwise it is set to an empty string.
  useEffect(() => {
    //
    getTheProduct();
  }, []);
  // This is an effect hook that calls the getTheProduct function when the component mounts. It has an empty dependency array [] which means it will only run once when the component mounts.

  // Submitting Form

  function formSubmitApprove(e) {
    e.preventDefault();
    planningApproval.pAccepted = 1;
    planningApproval.pRejected = 0;
    if (state.products[0].online === "0") {
      planningApproval.checkup = 1;
      planningApproval.publish = 2;
    } else {
      planningApproval.checkup = 0;
      planningApproval.publish = 2;
    }
    postLog.action = `${user.name} updated the product:${Id} to Approved`;
    setIsLoadingApprove(true);
    if (postLog.action.length > 0 && planningApproval.pAccepted == 1) {
      setTimeout(async () => {
        try {
          let response = await axios.post(
            "http://192.168.26.15/itemcreation-test/api/planning",
            {
              ...planningApproval,
              catez: choosedCategories, // Assuming 'categories' is the key expected by the backend
            }
          );
          if (response) {
            let responseLog = await axios.post(
              "http://192.168.26.15/itemcreation-test/api/log",
              postLog
            );
            setIsLoadingApprove(false);
            swal({
              title: `Hi ${user.name}`,
              text: "Product has been approved  ",
              icon: "success",
              button: false,
              timer: 1800,
            });
            setTimeout(() => {
              navigate("/mainpage/content/pqueue", {
                replace: true,
              });
            }, 1000);
          }
        } catch (error) {
          // console.log(error);
          swal({
            title: `Hi ${user.name}`,
            text: "An error occurred please refresh the page and try again  ",
            button: false,
            timer: 1500,
            icon: "error",
          });
          // console.log(error);
          setIsLoadingApprove(false);
          setState({ ...state, errorMessage: error.message });
        }
      }, 1000);
    }
  }
  /*

This function is triggered when the user submits the form to approve a product. It first prevents the default form submission behavior using e.preventDefault(). Then it sets the value of planningApproval.pAccepted to 1, which indicates that the product is approved. It also sets planningApproval.pRejected to 0 to indicate that the product is not rejected.

Next, it checks if the product was offline (state.products[0].online === "0") and if so, sets the value of planningApproval.checkup to 1 and planningApproval.publish to 2. If the product was already online, it sets planningApproval.checkup to 0 and planningApproval.publish to 2.

After that, it sets the action property of the postLog object to ${user.name} updated the product:${Id} to Approved, which will be logged to the database. Then, it sets the isLoadingApprove state to true to show a loading spinner while the form is being submitted.

If postLog.action has a length greater than 0 and planningApproval.pAccepted is 1, it sets a timeout function to submit the form data to the backend API. Inside the try block, it first sends a POST request to the API endpoint to update the product's planning approval status using the planningApproval object. If the response is successful, it logs the action to the database using the postLog object and shows a success message using the swal function from the SweetAlert library. Finally, it sets a timeout function to navigate the user to the product queue page.
 */
  function formSubmitReject(e) {
    e.preventDefault();
    postLog.action = `${user.name} updated the product:${Id} to Rejected`;
    planningApproval.pRejected = 1;
    planningApproval.pAccepted = 0;
    planningApproval.checkup = 0;
    planningApproval.publish = 0;
    setIsLoadingReject(true);
    if (postLog.action.length > 0 && planningApproval.pRejected == 1) {
      setTimeout(async () => {
        try {
          let response = await axios.post(
            "http://192.168.26.15/itemcreation-test/api/planning",
            planningApproval
          );

          if (response) {
            let responseLog = await axios.post(
              "http://192.168.26.15/itemcreation-test/api/log",
              postLog
            );
            setIsLoadingReject(false);
            swal({
              title: `Hi ${user.name}`,
              text: "Product has been rejected  ",
              icon: "info",
              button: false,
              timer: 1800,
            });
            setTimeout(() => {
              navigate("/mainpage/content/pqueue", {
                replace: true,
              });
            }, 1000);
          }
        } catch (error) {
          // console.log(error);
          swal({
            title: `Hi ${user.name}`,
            text: "An error occurred please refresh the page and try again  ",
            button: false,
            timer: 1500,
            icon: "error",
          });
          setIsLoadingReject(false);
          setState({ ...state, errorMessage: error.message });
        }
      }, 1000);
    }
  }

  const [webCategories, setWebCategories] = useState([]);
  const [CatChoices, setCatChoices] = useState({
    header: "",
    category: "",
    subCategory: "",
  });
  const [choosedCategories, setChoosedCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://192.168.26.15/itemcreation-test/api/get-cats"
      );
      const webcats = response.data.webcats;
      setWebCategories(webcats);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const categoryOnChangeHandler = (e) => {
    setCatChoices((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "header") {
      setCatChoices((prev) => ({
        ...prev,
        category: "",
        subCategory: "",
      }));
    }
  };

  const onAddCategoryHandler = () => {
    if (CatChoices.category !== "") {
      const existItem = choosedCategories.find(
        (item) => item.Categoryid === CatChoices.category
      );

      if (!existItem) {
        const selectedCategory = webCategories.find(
          (category) => category.CategoryID === CatChoices.category
        );

        if (selectedCategory) {
          setChoosedCategories((prev) => [
            ...prev,
            {
              lookupcode: products[0].lookupcode,
              itemid: products[0].id,
              Categoryid: selectedCategory.CategoryID,
              label: selectedCategory.EnglishName,
            },
          ]);
          setCatChoices({
            header: "",
            category: "",
            subCategory: "",
          });
        }
      } else {
        alert(`You already chose ${existItem.label} before`);
        setCatChoices({
          header: "",
          category: "",
          subCategory: "",
        });
      }
    }
  };

  const removeExistCat = (index) => {
    const list = [...choosedCategories];
    list.splice(index, 1);
    setChoosedCategories(list);
  };

  const handlingInputChange = (e) => {
    e.target.value = e.target.value.replace(
      /[’/`~!#*$@_%+=.^&(){}[\]|;:”<>?\\]/g,
      ""
    );
    setPlanningApproval({
      ...planningApproval,
      [e.target.name]: e.target.value,
    });
  };
  /*a handler function that is typically used to handle user input changes in a form field.

When the user types in the form field, this function is called with an event object (e) that contains information about the input change. The first line of the function removes any special characters from the input value using a regular expression.

Then, the function updates the state of the component using the setPlanningApproval function, which updates the planningApproval object with the new input value. The ...planningApproval syntax is used to create a copy of the planningApproval object, and then the [e.target.name] syntax is used to update the key-value pair of the object with the name of the input field and its new value.

By using setPlanningApproval to update the state of the component, React will re-render the component with the updated state, which will update the UI to reflect the user's input change. */

  if (state.products.length > 0) {
    state.products[0].salestax = Number(state.products[0].salestax).toFixed(2);
  }

  let { loading, products } = state;

  return (
    <React.Fragment>
      <Frame headerLabel="Product View">
        {" "}
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <form>
              {" "}
              <div className="row justify-content-evenly rounded-3 row-shadow g-3 border border-color   mt-5 p-4 my-3">
                <div className="col-12 text-center mb-3">
                  <h1 className="text-shadow fw-bolder ">
                    Please Review All Data
                  </h1>
                </div>
                {products.map((product, index) => {
                  //mapping the array of products and passing two parameters to it product as a single element of the array and index as the index 0 of the array and also to pass index param to the key value of the mapping function
                  return (
                    <div className="col-12 row " key={index}>
                      {/* key here is a key value that takes a unique value so map with react needs a unique value at every and each loop  */}
                      <div className="col-6">
                        <div className=" position-relative ">
                          <label
                            htmlFor="ProductNumber"
                            className=" text-dark fw-bolder px-4"
                          >
                            Item Lookup Code{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            id="ProductNumber"
                            name="lookupcode"
                            type="text"
                            className="form-control rounded-3  border-3 border   "
                            defaultValue={product.lookupcode}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className=" position-relative ">
                          <label
                            htmlFor="rms_desc"
                            className=" text-dark fw-bolder px-4"
                          >
                            RMS Description{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            id="rms_desc"
                            name="description"
                            type="text"
                            className="form-control rounded-3  border-3 border   "
                            value={
                              product.description.length <= 30 &&
                              product.description
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="supplier"
                            className=" text-dark fw-bolder px-4"
                          >
                            Supplier{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            id="supplier"
                            name="SupplierID"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                            value={product.SupplierID}
                            disabled
                          >
                            {suppliers.length > 0 &&
                              suppliers.map((supply) => {
                                return (
                                  <option
                                    key={supply.ID}
                                    name="supplier"
                                    value={supply.ID}
                                  >
                                    {supply.SupplierName}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="u_c"
                            className=" text-dark fw-bolder px-4"
                          >
                            Units/Carton
                          </label>
                          <input
                            id="u_c"
                            name="units_cartoon"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                            defaultValue={product.units_cartoon}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="s_life"
                            className=" text-dark fw-bolder px-4"
                          >
                            Shelf Life(Days){" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            id="s_life"
                            name="ShelfLife"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                            defaultValue={product.ShelfLife}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="Cost"
                            className=" text-dark fw-bolder px-4"
                          >
                            Cost(without Tax){" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            id="Cost"
                            name="Cost"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                            defaultValue={product.Cost}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="tax"
                            className=" text-dark fw-bolder px-4"
                          >
                            VAT{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.salestax}
                            readOnly
                            id="tax"
                            name="salestax"
                            type="text"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="cost_tax"
                            className=" text-dark fw-bolder px-4"
                          >
                            Cost (with Tax){" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.CostTax}
                            readOnly
                            id="cost_tax"
                            name="CostTax"
                            type="text"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="price"
                            className=" text-dark fw-bolder px-4"
                          >
                            Selling Price (with Tax){" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.RetailPrice}
                            readOnly
                            id="price"
                            name="RetailPrice"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="margin_percent"
                            className=" text-dark fw-bolder px-4"
                          >
                            Margin Percentage{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.Margin}
                            readOnly
                            id="margin_percent"
                            name="Margin"
                            type="text"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="counter"
                            className=" text-dark fw-bolder px-4"
                          >
                            Product Group{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.group}
                            readOnly
                            id="counter"
                            name="group"
                            type="text"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="StorageCondition"
                            className=" text-dark fw-bolder px-4"
                          >
                            Storing Condition{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.StorageCondition}
                            readOnly
                            id="StorageCondition"
                            name="StorageCondition"
                            autoComplete="off"
                            type="text"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="country"
                            className=" text-dark fw-bolder px-4"
                          >
                            Country Of Origin{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.country}
                            readOnly
                            id="country"
                            name="country"
                            type="text"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="rmsDepa"
                            className=" text-dark fw-bolder px-4"
                          >
                            RMS Department{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            id="rmsDepa"
                            name="DepartmentID"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                            value={product.DepartmentID}
                            disabled
                          >
                            {departments.length > 0 &&
                              departments.map((department) => {
                                return (
                                  <option
                                    key={department.ID}
                                    name="DepartmentID"
                                    value={department.ID}
                                  >
                                    {department.Name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="rmsCat"
                            className=" text-dark fw-bolder px-4"
                          >
                            RMS Category{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            id="rmsCat"
                            name="CategoryID"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                            value={product.CategoryID}
                            disabled
                          >
                            {categories.length > 0 &&
                              categories.map((category) => {
                                return (
                                  <option
                                    key={category.ID}
                                    name="CategoryID"
                                    value={category.ID}
                                  >
                                    {category.Name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="introductionDate"
                            className=" text-dark fw-bolder px-4"
                          >
                            Introduction Date{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.LaunchingDate}
                            readOnly
                            type="date"
                            id="introductionDate"
                            name="LaunchingDate"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="u_m"
                            className=" text-dark fw-bolder px-4"
                          >
                            Inventory Unit{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.UnitOfMeasure}
                            readOnly
                            id="u_m"
                            name="UnitOfMeasure"
                            type="text"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="pack_weight"
                            className=" text-dark fw-bolder px-4"
                          >
                            Pack Weight{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.pack_weight}
                            readOnly
                            min="0"
                            step="0.01"
                            id="pack_weight"
                            name="pack_weight"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="u_p"
                            className=" text-dark fw-bolder px-4"
                          >
                            Units/Package{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.units_pack}
                            readOnly
                            min="0"
                            step="0.01"
                            id="u_p"
                            name="units_pack"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="u_m"
                            className=" text-dark fw-bolder px-4"
                          >
                            Item Type{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            defaultValue={product.ItemType}
                            disabled
                            id="type"
                            name="ItemType"
                            type="text"
                            className="form-control rounded-3  border-3 border   "
                          >
                            <option value="0">Standard</option>
                            <option value="6">POS Weighted</option>
                            <option value="3">Kit</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="relex"
                            className=" text-dark fw-bolder px-4"
                          >
                            RELEX Item{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.relex == 1 ? "Yes" : "Yes"}
                            readOnly
                            id="relex"
                            name="relex"
                            type="text"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="primary_product"
                            className=" text-dark fw-bolder px-4"
                          >
                            Primary Product{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.primary_product}
                            readOnly
                            id="primary_product"
                            name="primary_product"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="private_brand"
                            className=" text-dark fw-bolder px-4"
                          >
                            Private Brand{" "}
                            <span
                              className=" fw-bolder text-
                                                            danger"
                            >
                              *
                            </span>
                          </label>
                          <select
                            defaultValue={product.private_brand}
                            disabled
                            id="private_brand"
                            name="private_brand"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          >
                            <option value=""></option>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="brand_type"
                            className=" text-dark fw-bolder px-4"
                          >
                            Brand Type{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.brand_type}
                            readOnly
                            id="brand_type"
                            name="brand_type"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="product_flow"
                            className=" text-dark fw-bolder px-4"
                          >
                            Product Flow{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            defaultValue={product.product_flow}
                            disabled
                            id="product_flow"
                            name="product_flow"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          >
                            {" "}
                            <option value=""></option>
                            <option value="0">Direct</option>
                            <option value="1">Indirect</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="warehouse_type"
                            className=" text-dark fw-bolder px-4"
                          >
                            Warehouse Type{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            defaultValue={product.warehouse_type}
                            readOnly
                            id="warehouse_type"
                            name="warehouse_type"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          >
                            <option value="0">Direct</option>
                            <option value="1">Dry</option>
                            <option value="2">Frozen</option>
                            <option value="3">Non-Food</option>
                            <option value="4">Consumables</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="batch_size"
                            className=" text-dark fw-bolder px-4"
                          >
                            Batch Size{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.batch_size}
                            readOnly
                            min="0"
                            step="1"
                            id="batch_size"
                            name="batch_size"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="min_order"
                            className=" text-dark fw-bolder px-4"
                          >
                            Minimum Delivery{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.minimum_delivery}
                            readOnly
                            min="0"
                            step="1"
                            id="min_order"
                            name="minimum_delivery"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="s_time"
                            className=" text-dark fw-bolder px-4"
                          >
                            Spoiling Time (Days){" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.spoiling_time}
                            readOnly
                            min="0"
                            step="1"
                            id="s_time"
                            name="spoiling_time"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="r_slife"
                            className=" text-dark fw-bolder px-4"
                          >
                            Remaining Shelf life{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            defaultValue={product.r_shelflife}
                            readOnly
                            min="0"
                            step="1"
                            id="r_slife"
                            name="r_shelflife"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="pallet_size"
                            className=" text-dark fw-bolder px-4"
                          >
                            Pallet Size
                          </label>
                          <input
                            defaultValue={product.pallet_size}
                            readOnly
                            min="0"
                            step="1"
                            id="pallet_size"
                            name="pallet_size"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="pallet_layer_size"
                            className=" text-dark fw-bolder px-4"
                          >
                            Pallet Layer Size
                          </label>
                          <input
                            defaultValue={product.pallet_lsize}
                            readOnly
                            min="0"
                            step="1"
                            id="pallet_layer_size"
                            name="pallet_lsize"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="s_space"
                            className=" text-dark fw-bolder px-4"
                          >
                            Shelf Space
                          </label>
                          <input
                            defaultValue={product.shelf_space}
                            readOnly
                            min="0"
                            step="1"
                            id="s_space"
                            name="shelf_space"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="u_spoint"
                            className=" text-dark fw-bolder px-4"
                          >
                            Ugly Shelf Point
                          </label>
                          <input
                            defaultValue={product.ugly_spoint}
                            readOnly
                            min="0"
                            step="1"
                            id="u_spoint"
                            name="ugly_spoint"
                            type="number"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>

                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="s_date"
                            className=" text-dark fw-bolder px-4"
                          >
                            Seasonal Start Date
                          </label>
                          <input
                            defaultValue={product.seasonal_start}
                            readOnly
                            type="date"
                            id="s_date"
                            name="seasonal_start"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="e_date"
                            className=" text-dark fw-bolder px-4"
                          >
                            Seasonal End Date
                          </label>
                          <input
                            defaultValue={product.seasonal_end}
                            readOnly
                            type="date"
                            id="e_date"
                            name="seasonal_end"
                            className="form-control rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div
                        className="w-100 my-5 border "
                        style={{
                          height: "5px",
                          backgroundColor: "black",
                        }}
                      ></div>
                      <div className="row g-3">
                        <div className="col-12 my-3 p-4 text-dark text-center">
                          <h2>Assortment Class</h2>
                          <div
                            className="w-25 mt-2 mb-5 m-auto"
                            style={{
                              height: "5px",
                              backgroundColor: "black",
                            }}
                          ></div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Warehouse"
                              className=" text-dark fw-bolder px-4"
                            >
                              Warehouse{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.Warehouse}
                              readOnly
                              id="Warehouse"
                              name="Warehouse"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Zamalek"
                              className=" text-dark fw-bolder px-4"
                            >
                              Zamalek{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.Zamalek}
                              readOnly
                              id="Zamalek"
                              name="Zamalek"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="GuizeraPlaza"
                              className=" text-dark fw-bolder px-4"
                            >
                              Guizera Plaza{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.GuizeraPlaza}
                              readOnly
                              id="GuizeraPlaza"
                              name="GuizeraPlaza"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Hacienda"
                              className=" text-dark fw-bolder px-4"
                            >
                              Hacienda{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.Hacienda}
                              readOnly
                              id="Hacienda"
                              name="Hacienda"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="CityStars"
                              className=" text-dark fw-bolder px-4"
                            >
                              City Stars{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.CityStars}
                              readOnly
                              id="CityStars"
                              name="CityStars"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Bouri"
                              className=" text-dark fw-bolder px-4"
                            >
                              Bouri{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.Bouri}
                              readOnly
                              id="Bouri"
                              name="Bouri"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="MaadiDegla"
                              className=" text-dark fw-bolder px-4"
                            >
                              Maadi Degla{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.MaadiDegla}
                              readOnly
                              id="MaadiDegla"
                              name="MaadiDegla"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Dokki"
                              className=" text-dark fw-bolder px-4"
                            >
                              Dokki{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.Dokki}
                              readOnly
                              id="Dokki"
                              name="Dokki"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Designia"
                              className=" text-dark fw-bolder px-4"
                            >
                              Designia{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.Designia}
                              readOnly
                              id="Designia"
                              name="Designia"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="WaterWay"
                              className=" text-dark fw-bolder px-4"
                            >
                              Water Way{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.WaterWay}
                              readOnly
                              id="WaterWay"
                              name="WaterWay"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Stella"
                              className=" text-dark fw-bolder px-4"
                            >
                              Stella{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.Stella}
                              readOnly
                              id="Stella"
                              name="Stella"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="KatameyaHeights"
                              className=" text-dark fw-bolder px-4"
                            >
                              Katameya Heights{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.KatameyaHeights}
                              readOnly
                              id="KatameyaHeights"
                              name="KatameyaHeights"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Maadi9"
                              className=" text-dark fw-bolder px-4"
                            >
                              Maadi 9{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.Maadi9}
                              readOnly
                              id="Maadi9"
                              name="Maadi9"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Sodic"
                              className=" text-dark fw-bolder px-4"
                            >
                              Sodic{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.Sodic}
                              readOnly
                              id="Sodic"
                              name="Sodic"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="ElSafwa"
                              className=" text-dark fw-bolder px-4"
                            >
                              El-Safwa{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.ElSafwa}
                              readOnly
                              id="ElSafwa"
                              name="ElSafwa"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="MaadiHub"
                              className=" text-dark fw-bolder px-4"
                            >
                              Maadi_Hub{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.MaadiHub}
                              readOnly
                              id="MaadiHub"
                              name="MaadiHub"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="ElTagamoaHub"
                              className=" text-dark fw-bolder px-4"
                            >
                              El-Tagamoa_Hub{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.ElTagamoaHub}
                              readOnly
                              id="ElTagamoaHub"
                              name="ElTagamoaHub"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Arkan"
                              className=" text-dark fw-bolder px-4"
                            >
                              Arkan{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.Arkan}
                              readOnly
                              id="Arkan"
                              name="Arkan"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="ElGouna"
                              className=" text-dark fw-bolder px-4"
                            >
                              El Gouna{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.ElGouna}
                              readOnly
                              id="ElGouna"
                              name="ElGouna"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="AlmazaBay"
                              className=" text-dark fw-bolder px-4"
                            >
                              Almaza Bay{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.AlmazaBay}
                              readOnly
                              id="AlmazaBay"
                              name="AlmazaBay"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="UptownCairo"
                              className=" text-dark fw-bolder px-4"
                            >
                              Uptown Cairo{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.UptownCairo}
                              readOnly
                              id="UptownCairo"
                              name="UptownCairo"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Dunes"
                              className=" text-dark fw-bolder px-4"
                            >
                              Dunes{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              defaultValue={product.Dunes}
                              readOnly
                              id="Dunes"
                              name="Dunes"
                              type="text"
                              className="form-control rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className="w-50  mt-5 mb-5 m-auto"
                        style={{
                          height: "5px",
                          backgroundColor: "black",
                        }}
                      ></div>
                      <div className="col-12 row justify-content-between">
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Available"
                              className=" text-dark fw-bolder px-4"
                            >
                              Available Online{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              defaultValue={product.online}
                              disabled
                              id="Available"
                              name="online"
                              type="number"
                              className="form-control rounded-3  border-3 border   "
                            >
                              {" "}
                              <option value=""></option>
                              <option value="0">No</option>
                              <option value="1">Yes</option>
                            </select>
                          </div>
                        </div>

                        {product.online == 1 && (
                          <div className="col-12 row justify-content-between g-4 mb-3">
                            {/* Start */}
                            <div className="col-4">
                              <label
                                htmlFor="webHeader"
                                className="ms-2 my-1 fs-5 text-dark"
                              >
                                Website Header{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                id="webHeader"
                                name="header"
                                type="text"
                                className="form-control"
                                style={{
                                  overflowY: "scroll",
                                }}
                                value={CatChoices.header}
                                onChange={categoryOnChangeHandler}
                              >
                                <option value="">Select Header</option>
                                {webCategories.map((option, index) =>
                                  option.ParentCategoryID === "0" ? (
                                    <option
                                      key={index}
                                      value={option.CategoryID}
                                    >
                                      {option.EnglishName}
                                    </option>
                                  ) : null
                                )}
                              </select>
                            </div>
                            <div className="col-4">
                              <label
                                htmlFor="webCat"
                                className="ms-2 my-1 fs-5 text-dark"
                              >
                                Website Category{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                id="webCat"
                                name="category"
                                type="text"
                                className="form-control"
                                value={CatChoices.category}
                                onChange={categoryOnChangeHandler}
                              >
                                <option value="">Select Category</option>
                                {webCategories.map((option, index) =>
                                  option.ParentCategoryID ===
                                  CatChoices.header ? (
                                    <option
                                      key={index}
                                      value={option.CategoryID}
                                    >
                                      {option.EnglishName}
                                    </option>
                                  ) : null
                                )}
                              </select>
                            </div>
                            <div className="col-4">
                              <label
                                htmlFor="webSubCat"
                                className="ms-2 my-1 fs-5 text-dark"
                              >
                                Website SubCategory{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                id="webSubCat"
                                name="subCategory"
                                type="text"
                                className="form-control"
                                onChange={categoryOnChangeHandler}
                              >
                                <option value="">Select Category</option>
                                {webCategories.map((option, index) =>
                                  option.ParentCategoryID ===
                                  CatChoices.category ? (
                                    <option
                                      key={index}
                                      value={option.CategoryID}
                                    >
                                      {option.EnglishName}
                                    </option>
                                  ) : null
                                )}
                              </select>
                            </div>
                            <div className="col-12 row g-4"></div>
                            <div className="col-12">
                              <button
                                type="button"
                                onClick={onAddCategoryHandler}
                                className="btn btn-primary px-3 my-3"
                              >
                                Add
                              </button>
                            </div>
                            <div className="col-12">
                              <div className="row m-0 p-0">
                                {choosedCategories.map((category, index) => (
                                  <div key={index} className="col-4">
                                    <button
                                      onClick={() => removeExistCat(index)}
                                      type="button"
                                      className="badge bg-success border-0"
                                    >
                                      {category.label}{" "}
                                      <i className="fa-solid fa-trash ms-2"></i>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* End */}
                            <div className="col-6 position-relative">
                              <label
                                htmlFor="EnIngredients"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                English Ingredients{" "}
                                <span className=" fw-bolder text-danger">
                                  *
                                </span>
                              </label>
                              <textarea
                                defaultValue={product.EnIngredients || ""}
                                name="EnIngredients"
                                id="EnIngredients"
                                rows="5"
                                disabled
                                cols="30"
                                className="form-control fs-3 "
                              ></textarea>
                            </div>
                            <div className="col-6 position-relative">
                              <label
                                htmlFor="EnWebDes"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                English Web Description{" "}
                                <span className=" fw-bolder text-danger">
                                  *
                                </span>
                              </label>
                              <textarea
                                defaultValue={product.EnWebDes || ""}
                                name="EnWebDes"
                                id="EnWebDes"
                                rows="5"
                                disabled
                                cols="30"
                                className="form-control fs-3 "
                              ></textarea>
                            </div>
                            <div className="col-6">
                              <div className=" position-relative ">
                                <label
                                  htmlFor="Dunes"
                                  className=" text-dark fw-bolder px-4"
                                >
                                  Suggested Web Name{" "}
                                  <span className=" fw-bolder text-danger">
                                    *
                                  </span>
                                </label>
                                <input
                                  disabled
                                  defaultValue={product.sWebName}
                                  placeholder="Suggest a web name  "
                                  id="sWebName"
                                  name="sWebName"
                                  type="text"
                                  className="form-control rounded-3  border-3 border   "
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="col-12 row justify-content-between mx-0 my-3">
                          <div className="  col-4 position-relative  ">
                            <MainButton
                              onClick={(e) => {
                                formSubmitApprove(e);
                              }}
                              value={
                                isLoadingApprove ? (
                                  <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                  "Approve"
                                )
                              }
                              disabled={
                                planningApproval.reason.length > 0
                                  ? true
                                  : false
                              }
                              type="button"
                            />
                          </div>
                          <div className="  col-4 position-relative  ">
                            <input
                              onChange={handlingInputChange}
                              type="text"
                              className="form-control text-dark rounded-3 fs-4 "
                              name="reason"
                              placeholder="Enter reason to reject"
                            />
                          </div>
                          <div className="  col-4 position-relative text-end ">
                            <SubButton
                              onClick={(e) => {
                                formSubmitReject(e);
                              }}
                              disabled={
                                planningApproval.reason.length < 5
                                  ? true
                                  : false
                              }
                              type="button"
                              value={
                                isLoadingReject ? (
                                  <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                  "Reject"
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-12 my-2 text-center">
                          <Link
                            to={`/mainpage/content/Aqueue/${Id}`}
                            className="btn btn-primary fs-5"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>

                      {isSubmitted ? (
                        <div className="col-12  m-auto text-center alert alert-success p-2 my-5">
                          Data Has been updated
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              </div>
            </form>
          </React.Fragment>
        )}
      </Frame>
    </React.Fragment>
  );
};

export default PlanningView;
