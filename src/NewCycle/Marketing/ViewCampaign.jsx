import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Spinner from "../../Spinner/Spinner";

import axios from "axios";
import MainButton from "../../Components/MainButton/MainButton";
import swal from "sweetalert";
import Frame from "../../Components/MainFrame/Frame";
const ViewCampaign = () => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  let [state, setState] = useState({
    loading: false,
    products: [],
    errorMessage: "",
  });

  let [newProduct, setNewProduct] = useState([]);
  //    target Check Boxes
  const [reach, setReach] = useState(false);
  const [engagment, setEngagment] = useState(false);
  const [conversion, setConversion] = useState(false);
  // end
  const [postCampaign, setPostCampaign] = useState({
    product_id: "",
    enTitle: "",
    arTitle: "",
    cost: "",
    url: "",
    tReach: "",
    tConversion: "",
    tEngagement: "",
    start_date: "",
    end_date: "",
    user: user.id != null ? user.id : "",
    cName: "",
    upCampaign: 1,
    rCampaign: 0,
  });

  async function getTheProduct() {
    try {
    } catch (error) {
      setState({ ...state, loading: false, errorMessage: error.message });
    }
  }

  useEffect(() => {
    getTheProduct();
  }, []);
  // Getting data of check box
  postCampaign.tReach = reach;
  postCampaign.tEngagement = engagment;
  postCampaign.tConversion = conversion;
  // End

  // Submitting Form
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/campaign",
        postCampaign
      );
      if (newProduct.length > 0 && response.data.message) {
        for (let i = 0; i < newProduct.length; i++) {
          let responseCampaign = await axios.post(
            "http://192.168.26.15/itemcreation-test/api/post-lookups",
            newProduct[i]
          );
        }
      }

      if (response.data.message) {
        setIsLoading(false);

        swal({
          text: "You started the campaign successfully ",
          icon: "success",
          button: false,
          timer: 1800,
        });
        setTimeout(() => {
          navigate("/mainpage", {
            replace: true,
          });
        }, 2000);
      } else if (response.data.error == "campaign name already exists!") {
        swal({
          text: "campaign name already exists  ",
          button: false,
          timer: 1500,
          icon: "error",
        });
        setPostCampaign({
          ...postCampaign,
          enTitle: "",
          arTitle: "",
          cost: "",
          url: "",
          tReach: "",
          tConversion: "",
          tEngagement: "",
          start_date: "",
          end_date: "",
          cName: "",
          upCampaign: 1,
          rCampaign: 0,
        });
        setNewProduct([]);
        setReach(false);
        setEngagment(false);
        setConversion(false);
        setIsLoading(false);
      }
    } catch (error) {
      swal({
        text: "An error occurred please refresh the page and try again  ",
        button: false,
        timer: 1500,
        icon: "error",
      });
      setIsLoading(false);
    }
  }
  //  Handling input change
  const handleInputChange = (e) => {
    setPostCampaign({
      ...postCampaign,
      [e.target.name]: e.target.value,
    });
  };
  //    Handling new product
  const handleNewProduct = () => {
    setNewProduct([
      ...newProduct,
      {
        product_id: "",
        lookupcode: "",
        description: "",
        cName: postCampaign.cName.length > 0 ? postCampaign.cName : "",
      },
    ]);
  };

  //    Remove new item
  const handleNewProductRemove = (index) => {
    const list = [...newProduct];
    list.splice(index, 1);
    setNewProduct(list);
  };
  // handle Getting data of api to new product
  async function getProductData(e, index) {
    const existLookupCode = newProduct.find(
      (item) => item.lookupcode == e.target.value
    );
    if (!existLookupCode) {
      try {
        let response = await axios.get(
          `http://192.168.26.15/itemcreation-test/api/all-data/${
            e.target.value != "" && e.target.value
          }`
        );
        let list = [...newProduct];
        list[index].description = response.data.description[0].Description;
        list[index].product_id = response.data.description[0]["ID"];
        list[index].lookupcode = e.target.value;
        setNewProduct(list);
      } catch (error) {
        e.target.value = "";
      }
    } else {
      swal({
        text: `You already choosed ${e.target.value} before`,
        button: false,
        timer: 1500,
        icon: "error",
      });
      e.target.value = "";
    }
  }
  // Handle change of new item
  const handleNewInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...newProduct];
    list[index][name] = value;
    setNewProduct(list);
  };

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

  //updating flags
  if (postCampaign.start_date === today) {
    postCampaign.upCampaign = 0;
    postCampaign.rCampaign = 1;
  } else {
    postCampaign.upCampaign = 1;
    postCampaign.rCampaign = 0;
  }
  let { loading } = state;
  return (
    <React.Fragment>
      <Frame headerLabel="Start Campaign">
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <form
              onSubmit={formSubmit}
              className="row justify-content-evenly    align-items-center p-5"
            >
              <div className="col-4">
                <label
                  htmlFor="url"
                  className="ms-2 my-1 fs-5  text-dark fw-bold"
                >
                  Campaign Name
                </label>
                <input
                  disabled={newProduct.length > 0 ? true : false}
                  required
                  value={postCampaign.cName}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="cName"
                  id="cName"
                  type="text"
                  placeholder="Enter campaign  name"
                  className="form-control "
                />
              </div>

              {newProduct.length
                ? newProduct.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="  col-12 row   justify-content-evenly"
                      >
                        <div className="col-6 mt-3">
                          <label
                            htmlFor="productCode"
                            className=" ms-2 my-1  fs-5 text-dark"
                          >
                            Item Lookup Code
                          </label>
                          <input
                            onBlur={(e) => {
                              getProductData(e, index);
                            }}
                            id="productCode"
                            name="ItemLookupCode"
                            type="text"
                            className="form-control "
                          />
                        </div>

                        <div className="col-5 mt-3">
                          <label
                            htmlFor="productCodet"
                            className="ms-2 my-1 fs-5  text-dark"
                          >
                            Description
                          </label>
                          <input
                            readOnly
                            onChange={(e) => handleNewInputChange(e, index)}
                            defaultValue={item.description || ""}
                            id="productCode"
                            type="text"
                            className="form-control "
                          />
                        </div>
                        {newProduct.length - 1 === index ? (
                          <motion.button
                            key={index}
                            onClick={() => {
                              handleNewProductRemove(index);
                            }}
                            transition={{
                              duration: 0.3,
                            }}
                            type="button"
                            name="Description"
                            id="productCode"
                            className="btn col-1 mt-5  border-0 fs-4 text-danger rounded-pill  "
                          >
                            {
                              <i className="fa-solid mt-2 fa-circle-minus fs-2 fw-bolder"></i>
                            }
                          </motion.button>
                        ) : (
                          <div className="col-1 mt-3"></div>
                        )}
                      </div>
                    );
                  })
                : ""}
              <div className="col-12 mt-3">
                <motion.button
                  onClick={(e) => {
                    handleNewProduct();
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  disabled={postCampaign.cName.length >= 4 ? false : true}
                  type="button"
                  name="Description"
                  id="productCode"
                  className="btn border-0 fs-4 text-dark rounded-pill   "
                >
                  <i className="fa-solid fa-circle-plus fs-5 fw-thin  "></i>{" "}
                  <span>Add Lookup Code(s)</span>
                </motion.button>
              </div>

              <div className="col-4 mt-3">
                <label
                  htmlFor="productCodet"
                  className="ms-2 my-1 fs-5  text-dark"
                >
                  English Title
                </label>
                <input
                  required
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={postCampaign.enTitle}
                  name="enTitle"
                  id="enTitle"
                  type="text"
                  className="form-control "
                />
              </div>
              <div className="col-4 mt-3">
                <label
                  htmlFor="productCodet"
                  className="ms-2 my-1 fs-5  text-dark"
                >
                  Arabic Title
                </label>
                <input
                  required
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={postCampaign.arTitle}
                  name="arTitle"
                  id="arTitle"
                  type="text"
                  className="form-control "
                />
              </div>
              <div className="col-4 mt-3">
                <label
                  htmlFor="productCodet"
                  className="ms-2 my-1 fs-5  text-dark"
                >
                  Cost
                </label>
                <input
                  required
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={postCampaign.cost}
                  name="cost"
                  id="cost"
                  type="number"
                  min={0}
                  className="form-control "
                />
              </div>
              <fieldset className="col-12 row border border-success rounded-4 mt-4 mb-3 p-3 ">
                <legend className="legend">Objective</legend>
                <div className=" col-4">
                  <div className="fs-4 ">
                    <input
                      onChange={() => {
                        setReach(!reach);
                      }}
                      checked={reach}
                      className="mt-0  "
                      name="reach"
                      type="checkbox"
                      id="reach"
                    />{" "}
                    <span className="text-dark">Reach</span>
                  </div>
                </div>
                <div className=" col-4">
                  <div className="fs-4 ">
                    <input
                      onChange={() => {
                        setEngagment(!engagment);
                      }}
                      className="mt-0  "
                      checked={engagment}
                      name="engagment"
                      type="checkbox"
                      id="engagment"
                    />{" "}
                    <span className="text-dark">Engagment</span>
                  </div>
                </div>
                <div className=" col-4">
                  <div className="fs-4 ">
                    <input
                      onChange={() => {
                        setConversion(!conversion);
                      }}
                      className="mt-0  "
                      checked={conversion}
                      name="conversion"
                      type="checkbox"
                      id="conversion"
                    />{" "}
                    <span className="text-dark">Conversion</span>
                  </div>
                </div>
              </fieldset>

              <div className="col-4">
                <label htmlFor="url" className="ms-2 my-1 fs-5  text-dark">
                  URL
                </label>
                <input
                  required
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={postCampaign.url}
                  name="url"
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  pattern="https://.*"
                  size="30"
                  className="form-control "
                />
              </div>
              <div className="col-4">
                <label
                  htmlFor="start_date"
                  className="ms-2 my-1 fs-5  text-dark"
                >
                  Start Date
                </label>
                <input
                  required
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={postCampaign.start_date}
                  name="start_date"
                  id="start_date"
                  type="date"
                  min={today}
                  className="form-control "
                />
              </div>
              <div className="col-4">
                <label htmlFor="end_date" className="ms-2 my-1 fs-5  text-dark">
                  End Date
                </label>
                <input
                  disabled={postCampaign.start_date === "" ? true : false}
                  required
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={postCampaign.end_date}
                  name="end_date"
                  id="end_date"
                  type="date"
                  min={postCampaign.start_date}
                  className="form-control "
                />
              </div>

              <div className="col-12 d-flex justify-content-end mt-5 ">
                {" "}
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
                  to="/mainpage"
                  className="col-2 text-center G-link btn-hover fs-3 text-decoration-none border border-top-0   border-start-0 border-end-0"
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

export default ViewCampaign;
