import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Spinner from "../../Spinner/Spinner";
const ContentQueue = () => {
  let list = [];
  let enList = [];
  let finalList = [];
  //nitializes three empty arrays: list, enList, and finalList. These arrays will be used to store the items from the contentQueue array that meet certain criteria.

  const [contentQueue, setContentQueue] = useState([]);
  const [state, setState] = useState({
    loading: false,
    errorMessage: "",
  });
  //The code then initializes two pieces of state using the useState hook. The contentQueue state variable will be used to store the array of content that is fetched from the server, and the state variable will be used to store loading and error state.

  useEffect(() => {
    async function getContentQueue() {
      try {
        setState({ ...state, loading: true });
        let responseData = await axios.get(
          "http://192.168.26.15/itemcreation-test/api/content-queue"
        );
        setContentQueue(responseData.data.Content);
        setState({ ...state, loading: false });
      } catch (error) {}
    }
    getContentQueue();
  }, []);
  //The code uses the useEffect hook to fetch the content queue data from the server when the component mounts. The getContentQueue function is an asynchronous function that sets the loading state to true, fetches the content queue data from the server using axios, sets the contentQueue state to the fetched data, and sets the loading state to false when the data is received. If there is an error, the loading state is still set to false.

  for (let i = 0; i < contentQueue.length; i++) {
    if (contentQueue[i].arabic_content == 0 && contentQueue[i].pAccepted == 1) {
      list.push(contentQueue[i]);
    }
  }
  for (let i = 0; i < contentQueue.length; i++) {
    if (
      contentQueue[i].english_content == 0 &&
      contentQueue[i].pAccepted == 1
    ) {
      enList.push(contentQueue[i]);
    }
  }
  //The code then loops through the contentQueue array and checks if each item meets the criteria for the list and enList arrays. If the item has no Arabic content and has been accepted for publication, it is added to the list array. If the item has no English content and has been accepted for publication, it is added to the enList array.

  for (let i = 0; i < contentQueue.length; i++) {
    if (
      contentQueue[i].english_content == 1 &&
      contentQueue[i].arabic_content == 1 &&
      contentQueue[i].photo == 1 &&
      contentQueue[i].checkup == 0 &&
      contentQueue[i].cRejected == 0
    ) {
      finalList.push(contentQueue[i]);
    }
  }
  //Finally, the code loops through the contentQueue array again and checks if each item meets the criteria for the finalList array. If the item has both English and Arabic content, has a photo, has not yet been checked by an editor, has not been rejected, and has been accepted for publication, it is added to the finalList array.

  return (
    <React.Fragment>
      {state.loading ? (
        <Spinner />
      ) : (
        <section
          className=" w-100  overflow-hidden  "
          style={{ height: "80vh" }}
          id="ContentQueue"
        >
          <div className="container p-5 ">
            <div className="row justify-content-between   g-4">
              <div
                className="col-4 row    overflow-scroll align-content-start    "
                style={{ height: "70vh" }}
              >
                <div className="col-12">
                  <h2 className="fs-4">
                    Arabic Queue --{" "}
                    <span className="fs-4 text-danger">{list.length}</span>{" "}
                    Product
                  </h2>
                </div>
                {contentQueue.length > 0 &&
                  contentQueue.map((item, index) => {
                    return item.arabic_content == 0 && item.pAccepted == 1 ? (
                      <Link
                        to={`/mainpage/content/arabic/${item.lookupcode}`}
                        key={index}
                        className="card col-12 rounded-4 my-2  overflow-hidden text-decoration-none text-dark"
                      >
                        <motion.div
                          whileHover={{
                            scale: 1.1,
                          }}
                          className="fs-6 card-body overflow-hidden fst-italic fs-6 p-4"
                        >
                          <h5 className="fs-6 card-title">
                            Item Lookup Code:{" "}
                            <span className="fs-6 text-success fw-bolder">
                              {item.lookupcode}
                            </span>{" "}
                          </h5>

                          <p className="fs-6 card-text">{item.description}</p>
                          <p className="fs-6 card-text">
                            Suggested Web Name:
                            <span className="fs-6 text-success fw-bolder">
                              {item.sWebName}
                            </span>{" "}
                          </p>
                        </motion.div>
                      </Link>
                    ) : (
                      ""
                    );
                  })}
              </div>
              <div
                className="col-4 row   overflow-scroll align-content-start    "
                style={{ height: "70vh" }}
              >
                <div className="col-12">
                  <h2 className="fs-4">
                    English Queue --{" "}
                    <span className="fs-4 text-danger">{enList.length}</span>{" "}
                    Product
                  </h2>
                </div>
                {contentQueue.length > 0 &&
                  contentQueue.map((item, index) => {
                    return item.english_content == 0 && item.pAccepted == 1 ? (
                      <Link
                        to={`/mainpage/content/english/${item.lookupcode}`}
                        key={index}
                        className="card col-12 rounded-4 my-2  overflow-hidden text-decoration-none text-dark"
                      >
                        <motion.div
                          whileHover={{
                            scale: 1.1,
                          }}
                          className="card-body overflow-hidden fst-italic fs-5 p-4"
                        >
                          <h5 className="fs-6 card-title">
                            Item Lookup Code:{" "}
                            <span className="fs-6 text-success fw-bolder">
                              {item.lookupcode}
                            </span>{" "}
                          </h5>

                          <p className="fs-6 card-text">{item.description}</p>
                          <p className="fs-6 card-text">
                            Suggested Web Name:
                            <span className="fs-6 text-success fw-bolder">
                              {item.sWebName}
                            </span>{" "}
                          </p>
                        </motion.div>
                      </Link>
                    ) : (
                      ""
                    );
                  })}
              </div>
              <div
                className="col-4 row    overflow-scroll align-content-start    "
                style={{ height: "70vh" }}
              >
                <div className="col-12">
                  <h2 className="fs-4">
                    Final Queue --{" "}
                    <span className="fs-4 text-danger">{finalList.length}</span>{" "}
                    Product
                  </h2>
                </div>
                {contentQueue.length > 0 &&
                  contentQueue.map((item, index) => {
                    return item.arabic_content == 1 &&
                      item.english_content == 1 &&
                      item.checkup == 0 &&
                      item.cRejected == 0 &&
                      item.photo == 1 ? (
                      <Link
                        to={`/mainpage/content/finalContent/${item.lookupcode}`}
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
                            Item Lookup Code:{" "}
                            <span className="fs-6 text-success fw-bolder">
                              {item.lookupcode}
                            </span>{" "}
                          </h5>

                          <p className="fs-6 card-text">{item.description}</p>
                          <p className="fs-6 card-text">
                            Suggested Web Name:
                            <span className="fs-6 text-success fw-bolder">
                              {item.sWebName}
                            </span>{" "}
                          </p>
                        </motion.div>
                      </Link>
                    ) : (
                      ""
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
      )}
    </React.Fragment>
  );
};

export default ContentQueue;
