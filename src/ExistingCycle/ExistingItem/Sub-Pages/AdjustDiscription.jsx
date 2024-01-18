import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../../Spinner/Spinner";
import axios from "axios";
import MainButton from "../../../Components/MainButton/MainButton";
import Frame from "../../../Components/MainFrame/Frame";
import swal from "sweetalert";
import { fetchDataItem } from "../CustomHooks/getItemData";
import { useCallback } from "react";
const AdjustDiscription = () => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //This line declares a variable user and initializes it with the parsed value of the userData key from the sessionStorage object.

  let { Id } = useParams();
  //This line uses the useParams hook from React Router to extract the Id parameter from the current URL.

  let navigate = useNavigate();
  //This line uses the useNavigate hook from React Router to get a function that can be used to navigate to different pages in the application.

  const [isLoading, setIsLoading] = useState(false);
  //This line uses the useState hook from React to declare and initialize a state variable isLoading to false, and a function setIsLoading to update its value.

  let [state, setState] = useState({
    loading: false,
    products: [],
    errorMessage: "",
  });
  //This line uses the useState hook from React to declare and initialize a state variable state to an object containing loading, products, and errorMessage properties, and a function setState to update its value.

  let [productUpdate, setProductUpdate] = useState({
    ItemID: "",
    ItemLookupCode: Id,
    old_description: "",
    new_description: "",
    user: user.id != null ? user.id : "",
  });
  //This line uses the useState hook from React to declare and initialize a state variable productUpdate to an object containing ItemID, ItemLookupCode, old_description, new_description, and user properties, and a function setProductUpdate to update its value. The ItemLookupCode property is set to the Id parameter extracted earlier, and the user property is set to the id property of the user object if it is not null, or an empty string otherwise.

  const [postLog, setPostLog] = useState({
    lookupcode: Id,
    action: `action`,
    user: user.id != null ? user.id : "",
  });
  //This line uses the useState hook from React to declare and initialize a state variable postLog to an object containing lookupcode, action, and user properties, and a function setPostLog to update its value. The lookupcode property is set to the Id parameter extracted earlier, the action property is set to the string "action", and the user property is set to the id property of the user object if it is not null, or an empty string otherwise.

  const getTheProduct = useCallback(async () => {
    try {
      setState({ ...state, loading: true });
      let response = await fetchDataItem(Id);
      setState({
        ...state,
        loading: false,
        products: response.data.description,
      });
      setProductUpdate({
        ...productUpdate,
        ItemID: response.data.description[0].ID,
        ItemLookupCode: response.data.description[0].ItemLookupCode,
        old_description: response.data.description[0].Description,
      });
    } catch (error) {
      setState({ ...state, loading: false, errorMessage: error.message });
    }
  }, [Id]);
  //This line uses the useCallback hook from React to declare a memoized callback function getTheProduct that fetches the product data using the fetchDataItem function, updates the state and productUpdate state variables based on the response data,

  useEffect(() => {
    getTheProduct();
  }, [getTheProduct]);
  //The useEffect hook is used to run the getTheProduct function when the component mounts and whenever getTheProduct changes. It has two parameters, a function and a dependency array. The function passed to useEffect is executed after the component is rendered, and the dependency array contains the variables that are watched for changes. When a variable in the dependency array changes, the function is executed again. In this case, getTheProduct is passed as the only variable in the dependency array, so the getTheProduct function will be executed whenever it changes.
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let responseLog = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/log",
        postLog
      );
      let response = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/description",
        productUpdate
      );
      if (response.data.description) {
        setIsLoading(false);
        swal({
          title: `Hi ${user.name}`,
          text: "Description Updated successfully  ",
          icon: "success",
          button: false,
          timer: 1200,
        });
        setTimeout(() => {
          navigate("/mainpage/itemadjust/description", { replace: true });
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
  //The formSubmit function is an async function that is executed when the user submits the form. It prevents the default form submission behavior, sets the isLoading state to true, sends a POST request to the log endpoint with the postLog object as the data, and sends another POST request to the description endpoint with the productUpdate object as the data. If the response from the description endpoint contains a description property, isLoading is set to false, a success message is displayed using the swal function, and the user is redirected to the /mainpage/itemadjust/description page after a 1.5 second delay. If an error occurs, an error message is displayed using the swal function and isLoading is set to false.
  function updateInput(e) {
    setProductUpdate({ ...productUpdate, [e.target.name]: e.target.value });
    setPostLog((prev) => {
      return {
        ...prev,
        action: `${user.name} adjusted the item ${Id} Description from ${productUpdate.old_description} to ${productUpdate.new_description}  `,
      };
    });
  }
  //The updateInput function is executed whenever an input field's value changes. It sets the productUpdate state to a new object with all the previous properties and the new property that has the same name as the changed input's name attribute and the new value as the value. It also sets the postLog state to a new object with all the previous properties and a new action property that describes what action the user performed, including their name, the item ID, the old description, and the new description.
  let { loading, products, errorMessage } = state;
  return (
    <React.Fragment>
      <Frame headerLabel={"Adjust Description"}>
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {products.length > 0 &&
              products.map((product) => {
                if (productUpdate.new_description == "") {
                  productUpdate.new_description = product.Description;
                }

                return (
                  <form
                    className="row w-100 justify-content-lg-evenly overflow-hidden justify-content-start m-0 p-0 "
                    key={product.ID}
                  >
                    <div className="col-lg-5 col-10">
                      <label
                        htmlFor="productCodet"
                        className="  my-1  fs-5 text-dark"
                      >
                        Item Lookup Code
                      </label>
                      <input
                        readOnly
                        id="productCode"
                        name="ItemLookupCode"
                        type="text"
                        className="form-control "
                        value={product.ItemLookupCode}
                      />
                    </div>

                    <div className="col-lg-5 col-10">
                      <label
                        htmlFor="productCodet"
                        className=" my-1 fs-5  text-dark"
                      >
                        RMS Description
                      </label>
                      <input
                        readOnly
                        id="productCode"
                        type="text"
                        className="form-control "
                        value={product.Description}
                      />
                    </div>
                    <div className="col-lg-8 m-lg-auto col-10 my-4">
                      <label
                        htmlFor="productCodet"
                        className=" my-1 fs-5  text-dark"
                      >
                        New RMS Description
                      </label>
                      <input
                        onChange={updateInput}
                        maxLength={30}
                        name="new_description"
                        id="productCode"
                        type="text"
                        className="form-control "
                        value={productUpdate.Description}
                      />
                    </div>
                    <div className="col-12 ms-auto my-4  text-lg-end text-center">
                      <MainButton
                        onClick={formSubmit}
                        value={
                          isLoading ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            "Submit"
                          )
                        }
                        type="submit"
                      />
                    </div>

                    <div className="col-lg-8 col-10 p-1 text-lg-center text-start  my-4 alert-success alert">
                      <p className=" my-1 fs-5  text-dark fw-bold">
                        NOTE: Leave The Field Empty If You Don't Wish To Adjust
                        It.
                      </p>
                    </div>
                    <div className="col-lg-12 col-10 p-1 row justify-content-lg-between justify-content-evenly my-4 ">
                      <Link
                        to="/mainpage/itemadjust/description"
                        className="col-2 G-link btn-hover text-center fs-3 text-decoration-none text-dark border border-top-0 border-start-0 border-end-0"
                      >
                        New Search
                      </Link>
                      <Link
                        to="/mainpage"
                        className="col-2 G-link text-center btn-hover fs-3 text-decoration-none text-dark border border-top-0 border-start-0 border-end-0"
                      >
                        Home
                      </Link>
                    </div>
                  </form>
                );
              })}
          </React.Fragment>
        )}
      </Frame>
    </React.Fragment>
  );
};

export default AdjustDiscription;
