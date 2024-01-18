import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Spinner from "../../Spinner/Spinner";
import Frame from "../../Components/MainFrame/Frame";
const ContentRejection = () => {
  let list = [];
  //A variable list is declared and initialized to an empty array.
  const [rejectionQueue, setRejectionQueue] = useState([]);
  //Declare a state variable rejectionQueue and its corresponding setter function setRejectionQueue, initialized with an empty array using the useState hook:

  const [state, setState] = useState({
    loading: false,
    errorMessage: "",
  });
  //Declare a state variable state and its corresponding setter function setState, initialized with an object containing two properties loading and errorMessage, both set to empty strings:

  let user = JSON.parse(sessionStorage.getItem("userData"));
  //Parse the userData from the sessionStorage and assign it to the user variable:

  useEffect(() => {
    async function getContentQueue() {
      try {
        setState({ ...state, loading: true });
        let responseData = await axios.get(
          "http://192.168.26.15/itemcreation-test/api/content-queue"
        );

        setRejectionQueue(responseData.data.Content);
        setState({ ...state, loading: false });
      } catch (error) {}
    }
    getContentQueue();
  }, []);
  //Declare an effect hook using useEffect that fetches data from an API endpoint when the component mounts:
  //This effect hook executes a function that sends a GET request to the API endpoint http://192.168.26.15/itemcreation-test/api/content-queue using the axios library. The response data is then stored in the rejectionQueue state variable using the setRejectionQueue function. If an error occurs during the request, the error is caught and nothing happens.

  for (let i = 0; i < rejectionQueue.length; i++) {
    if (rejectionQueue[i].cRejected == 1) {
      list.push(rejectionQueue[i]);
    }
  }
  //Use a for loop to iterate through each element in the rejectionQueue array and check if its cRejected property is equal to 1. If it is, push the element to the list array:

  /*
   This code checks if the cRejected property of the current element in the rejectionQueue array is equal to 1. If it is, the element is added to the list array using the push method.

In summary, the code fetches data from an API endpoint and stores it in a state variable. It then loops through the data and checks for specific conditions, adding matching elements to an array called list.
   */
  return (
    <React.Fragment>
      <Frame headerLabel="Rejected Content">
        {state.loading ? (
          <Spinner />
        ) : (
          <div className="row justify-content-between py-5  ">
            <div
              className="col-12 row  overflow-scroll align-content-start  "
              style={{ height: "70vh" }}
            >
              <div className="fs-4 col-12 text-center">
                <h2 className="fs-4">
                  Rejected items --{" "}
                  <span className="fs-4 text-danger">{list.length}</span>{" "}
                  Rejected Products Found
                </h2>
              </div>
              {rejectionQueue.length > 0 &&
                rejectionQueue.map((item, index) => {
                  return item.cRejected == 1 ? (
                    <Link
                      to={`/mainpage/content/existing/${item.lookupcode}`}
                      key={index}
                      className="fs-6 card col-12 rounded-4 my-2 text-center  overflow-hidden text-decoration-none text-dark"
                    >
                      <motion.div
                        whileHover={{
                          scale: 1.1,
                        }}
                        className="fs-6 card-body overflow-hidden fst-italic  p-4"
                      >
                        <h5 className="fs-6 card-title">
                          Item Lookup Code:{" "}
                          <span className="fs-6 text-success fw-bolder">
                            {item.lookupcode}
                          </span>{" "}
                        </h5>

                        <p className="card-text">{item.description}</p>
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

export default ContentRejection;
