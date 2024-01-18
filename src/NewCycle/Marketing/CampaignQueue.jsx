import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import axios from "axios";
import Spinner from "../../Spinner/Spinner";
import Frame from "../../Components/MainFrame/Frame";
const CampaignQueue = () => {
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
  //  End of it
  let list = [];
  let campaignList = [];
  let campaignListUp = [];
  let campaignListDone = [];
  const [campaignQueue, setCampaignQueue] = useState([]);
  const [state, setState] = useState({
    loading: false,
    errorMessage: "",
  });

  let user = JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    async function getContentQueue() {
      try {
        setState({ ...state, loading: true });
        let responseData = await axios.get(
          "http://192.168.26.15/itemcreation-test/api/campaigns"
        );
        setCampaignQueue(responseData.data.Marketing);
        setState({ ...state, loading: false });
      } catch (error) {}
    }
    getContentQueue();
  }, []);

  for (let i = 0; i < campaignQueue.length; i++) {
    if (
      campaignQueue[i].done == 0 &&
      campaignQueue[i].rCampaign == 1 &&
      campaignQueue[i].upCampaign == 0
    ) {
      campaignList.push(campaignQueue[i]);
    }
  }
  for (let i = 0; i < campaignQueue.length; i++) {
    if (
      campaignQueue[i].done == 0 &&
      campaignQueue[i].rCampaign == 0 &&
      campaignQueue[i].upCampaign == 1
    ) {
      campaignListUp.push(campaignQueue[i]);
    }
  }
  for (let i = 0; i < campaignQueue.length; i++) {
    if (campaignQueue[i].done == 1 && campaignQueue[i].rCampaign == 1) {
      campaignListDone.push(campaignQueue[i]);
    }
  }
  for (let i = 0; i < campaignQueue.length; i++) {
    if (today >= campaignQueue[i].start_date) {
      campaignQueue[i].upCampaign = 0;
      campaignQueue[i].rCampaign = 1;
    }
  }

  return (
    <React.Fragment>
      <Frame headerLabel="Campaigns Queue">
        {" "}
        {state.loading ? (
          <Spinner />
        ) : (
          <div className="row justify-content-between py-5  ">
            <div
              className="col-4 row text-center  overflow-scroll align-content-start     "
              style={{ height: "70vh" }}
            >
              <div className="col-12 ">
                <h2 className="fs-4">
                  Upcoming Campaigns --{" "}
                  <span className="fs-4 text-danger">
                    {campaignListUp.length}
                  </span>{" "}
                  Campaigns Found
                </h2>
              </div>
              {campaignQueue.length > 0 &&
                campaignQueue.map((item, index) => {
                  return item.done == 0 &&
                    item.rCampaign == 0 &&
                    item.upCampaign == 1 ? (
                    <Link
                      to={`/mainpage/content/UCAMqueue/${item.cName}`}
                      key={index}
                      className="card col-12 rounded-4 my-2  overflow-hidden text-decoration-none text-dark"
                    >
                      <motion.div
                        whileHover={{
                          scale: 1.1,
                        }}
                        className="fs-6 card-body overflow-hidden fst-italic fs-5 p-4"
                      >
                        <h5 className="fs-6 card-title">
                          Campaign Name:{" "}
                          <span className="fs-6  text-success fw-bolder">
                            {item.cName}
                          </span>{" "}
                        </h5>
                        <h5 className="fs-6 card-title">
                          Start Date:{" "}
                          <span className="fs-6  text-success fw-bolder">
                            {item.start_date}
                          </span>{" "}
                        </h5>
                        <h5 className="fs-6 card-title">
                          End Date:{" "}
                          <span className="fs-6 text-success fw-bolder">
                            {item.end_date}
                          </span>{" "}
                        </h5>

                        {/* <p className="card-text">Arabic Name : {item.arTitle}</p> */}
                      </motion.div>
                    </Link>
                  ) : (
                    ""
                  );
                })}
            </div>
            <div
              className="fs-4 col-4 row text-center  overflow-scroll align-content-start     "
              style={{ height: "70vh" }}
            >
              <div className="col-12 fs-4 ">
                <h2 className="fs-4">
                  Running Campaigns --{" "}
                  <span className="fs-4 text-danger">
                    {campaignList.length}
                  </span>{" "}
                  Campaigns Found
                </h2>
              </div>
              {campaignQueue.length > 0 &&
                campaignQueue.map((item, index) => {
                  return item.done == 0 && item.rCampaign == 1 ? (
                    <Link
                      to={`/mainpage/content/RCAMqueue/${item.cName}`}
                      key={index}
                      className="card col-12 rounded-4 my-2  overflow-hidden text-decoration-none text-dark"
                    >
                      <motion.div
                        whileHover={{
                          scale: 1.1,
                        }}
                        className="card-body overflow-hidden fst-italic fs-6 p-4"
                      >
                        <h5 className="fs-6 card-title">
                          Campaign Name:{" "}
                          <span className="fs-6 text-success fw-bolder">
                            {item.cName}
                          </span>{" "}
                        </h5>
                        <h5 className="fs-6 card-title">
                          Start Date:{" "}
                          <span className="fs-6 text-success fw-bolder">
                            {item.start_date}
                          </span>{" "}
                        </h5>
                        <h5 className="fs-6 card-title">
                          End Date:{" "}
                          <span className="fs-6 text-success fw-bolder">
                            {item.end_date}
                          </span>{" "}
                        </h5>

                        {/* <p className="card-text">Arabic Name : {item.arTitle}</p> */}
                      </motion.div>
                    </Link>
                  ) : (
                    ""
                  );
                })}
            </div>
            <div
              className="col-4 row text-center  overflow-scroll align-content-start     "
              style={{ height: "70vh" }}
            >
              <div className="col-12 ">
                <h2 className="fs-4">
                  Ended Campaigns --{" "}
                  <span className="fs-4 text-danger">
                    {campaignListDone.length}
                  </span>{" "}
                  Campaigns Found
                </h2>
              </div>
              {campaignQueue.length > 0 &&
                campaignQueue.map((item, index) => {
                  return item.done == 1 && item.rCampaign == 1 ? (
                    <Link
                      to={`/mainpage/content/ECAMqueue/${item.cName}`}
                      key={index}
                      className="card col-12 rounded-4 my-2  overflow-hidden text-decoration-none text-dark"
                    >
                      <motion.div
                        whileHover={{
                          scale: 1.1,
                        }}
                        className="fs-6 card-body overflow-hidden fst-italic fs-5 p-4"
                      >
                        <h5 className="fs-6 card-title">
                          Campaign Name:{" "}
                          <span className="fs-6 text-success fw-bolder">
                            {item.cName}
                          </span>{" "}
                        </h5>
                        <h5 className="fs-6 card-title">
                          Start Date:{" "}
                          <span className="fs-6 text-success fw-bolder">
                            {item.start_date}
                          </span>{" "}
                        </h5>
                        <h5 className="fs-6 card-title">
                          End Date:{" "}
                          <span className="fs-6 text-success fw-bolder">
                            {item.end_date}
                          </span>{" "}
                        </h5>

                        {/* <p className="card-text">Arabic Name : {item.arTitle}</p> */}
                      </motion.div>
                    </Link>
                  ) : (
                    ""
                  );
                })}
            </div>
          </div>
        )}
      </Frame>
    </React.Fragment>
  );
};

export default CampaignQueue;
