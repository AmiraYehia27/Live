import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Spinner from "../../Spinner/Spinner";

import axios from "axios";
import Frame from "../../Components/MainFrame/Frame";
const ViewUpcomingCampaign = () => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  let { Id } = useParams();
  let navigate = useNavigate();
  const [existProducts, setExistProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let [isSubmitted, setIsSubmitted] = useState(false);
  let [state, setState] = useState({
    loading: false,
    products: [],
    errorMessage: "",
  });
  const [postLog, setPostLog] = useState({
    action: `${user.name} added a campaign details to Campaign: ${Id} `,
    user: user.id != null ? user.id : "",
    lookupcode: Id,
  });
  const [postCampaign, setPostCampaign] = useState([]);
  async function getTheProduct() {
    try {
      setState({ ...state, loading: true });
      let response = await axios.get(
        `http://192.168.26.15/itemcreation-test/api/show-product/${Id}`
      );
      let campaignResponse = await axios.get(
        `http://192.168.26.15/itemcreation-test/api/campaign/${Id}`
      );
      let itemsResponse = await axios.get(
        `http://192.168.26.15/itemcreation-test/api/campaign-items/${Id}`
      );
      setExistProducts(itemsResponse.data.campaign);
      setPostCampaign(campaignResponse.data.campaign);
      setState({
        ...state,
        loading: false,
        products: response.data.data,
      });
    } catch (error) {
      setState({ ...state, loading: false, errorMessage: error.message });
    }
  }

  useEffect(() => {
    getTheProduct();
  }, [Id]);

  // Submitting Form
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/update-campaign",
        postCampaign[0]
      );
      let responseLog = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/log",
        postLog
      );
      if (response) {
        setIsLoading(false);
        setIsSubmitted(true);
        setTimeout(() => {
          navigate("/mainpage/content/CAMqueue", {
            replace: true,
          });
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      setState({ ...state, errorMessage: error.message });
    }
  }
  //  Handling input change

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...postCampaign];
    list[index][name] = value;
    setPostCampaign(list);
  };
  postCampaign.forEach((item) => {
    return (item.user = user.id != null ? user.id : "");
  });
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

  let { loading, products } = state;
  return (
    <React.Fragment>
      <Frame headerLabel="Upcoming Campaings">
        {" "}
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <form
              onSubmit={formSubmit}
              className="row   justify-content-evenly align-items-center "
            >
              {existProducts.length > 0
                ? existProducts.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="  col-12 row m-0  justify-content-evenly"
                      >
                        <div className="col-6 mt-3">
                          <label
                            htmlFor="productCode"
                            className=" ms-2 my-1  fs-5 text-dark"
                          >
                            Item Lookup Code
                          </label>
                          <input
                            value={item.lookupcode}
                            readOnly
                            id="productCode"
                            name="ItemLookupCode"
                            type="text"
                            className="form-control "
                          />
                        </div>

                        <div className="col-6 mt-3">
                          <label
                            htmlFor="productCodet"
                            className="ms-2 my-1 fs-5  text-dark"
                          >
                            Description
                          </label>
                          <input
                            readOnly
                            value={item.description}
                            id="productCode"
                            type="text"
                            className="form-control "
                          />
                        </div>
                      </div>
                    );
                  })
                : ""}
              {loading == false &&
                products.map((item, index) => {
                  return (
                    <div key={index} className="col-6">
                      <label
                        htmlFor="productCodet"
                        className="ms-2 my-1 fs-5  text-dark"
                      >
                        RMS Description
                      </label>
                      <input
                        readOnly
                        id="productCode"
                        type="text"
                        className="form-control "
                        defaultValue={item.description}
                      />
                    </div>
                  );
                })}
              {postCampaign.length &&
                postCampaign.map((item, index) => {
                  return (
                    <div
                      className="col-12 row m-0 p-0 border-color border my-3 p-4 rounded-3 justifiy-content-evenly "
                      key={index}
                    >
                      <div className="col-4">
                        <label
                          htmlFor="productCodet"
                          className="ms-2 my-1 fs-5  text-dark"
                        >
                          English Title
                        </label>
                        <input
                          defaultValue={item.enTitle || ""}
                          disabled
                          autoComplete="off"
                          name="enTitle"
                          id="enTitle"
                          type="text"
                          className="form-control "
                        />
                      </div>
                      <div className="col-4">
                        <label
                          htmlFor="productCodet"
                          className="ms-2 my-1 fs-5  text-dark"
                        >
                          Arabic Title
                        </label>
                        <input
                          defaultValue={item.arTitle || ""}
                          disabled
                          name="arTitle"
                          id="arTitle"
                          type="text"
                          className="form-control "
                        />
                      </div>
                      <div className="col-4">
                        <label
                          htmlFor="productCodet"
                          className="ms-2 my-1 fs-5  text-dark"
                        >
                          Cost
                        </label>
                        <input
                          defaultValue={item.cost || ""}
                          disabled
                          autoComplete="off"
                          name="cost"
                          id="cost"
                          type="number"
                          min={0}
                          className="form-control "
                        />
                      </div>
                      <div className="col-4">
                        <label
                          htmlFor="productCodet"
                          className="ms-2 my-1 fs-5  text-dark"
                        >
                          URL
                        </label>
                        <input
                          defaultValue={item.url || ""}
                          disabled
                          autoComplete="off"
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
                          htmlFor="productCodet"
                          className="ms-2 my-1 fs-5  text-dark"
                        >
                          Start Date
                        </label>
                        <input
                          defaultValue={item.start_date || ""}
                          disabled
                          autoComplete="off"
                          name="start_date"
                          id="start_date"
                          type="date"
                          className="form-control "
                        />
                      </div>
                      <div className="col-4">
                        <label
                          htmlFor="productCodet"
                          className="ms-2 my-1 fs-5  text-dark"
                        >
                          End Date
                        </label>
                        <input
                          defaultValue={item.end_date || ""}
                          disabled
                          autoComplete="off"
                          name="start_date"
                          id="start_date"
                          type="date"
                          className="form-control "
                        />
                      </div>

                      <fieldset className="col-12 row border border-success rounded-3 m-0 p-0 my-2 ">
                        <legend className="legend">Objective</legend>
                        <div className=" col-4">
                          <div className="fs-4 ">
                            <input
                              disabled
                              defaultChecked={item.tReach == 1 ? true : false}
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
                              disabled
                              defaultChecked={
                                item.tEngagement == 1 ? true : false
                              }
                              className="mt-0  "
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
                              disabled
                              className="mt-0  "
                              defaultChecked={
                                item.tConversion == 1 ? true : false
                              }
                              name="conversion"
                              type="checkbox"
                              id="conversion"
                            />{" "}
                            <span className="text-dark">Conversion</span>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  );
                })}

              <div className="col-12 p-1 row justify-content-between m-auto my-4 ">
                <Link
                  to="/mainpage/content/CAMqueue"
                  className="col-2 btn-hover text-center G-link  fs-3 text-decoration-none text-dark border border-top-0 border-start-0 border-end-0"
                >
                  New Search
                </Link>
                <Link
                  to="/mainpage"
                  className="col-2 text-center G-link  btn-hover fs-3 text-decoration-none text-dark border border-top-0 border-start-0 border-end-0"
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

export default ViewUpcomingCampaign;
