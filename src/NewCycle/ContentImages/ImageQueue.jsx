import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Spinner from "../../Spinner/Spinner";
import Frame from "../../Components/MainFrame/Frame";
const ImageQueue = () => {
  let list = [];
  const [imageQueue, setImageQueue] = useState([]);
  const [state, setState] = useState({
    loading: false,
    errorMessage: "",
  });
  useEffect(() => {
    async function getContentQueue() {
      try {
        setState({ ...state, loading: true });
        let responseData = await axios.get(
          "http://192.168.26.15/itemcreation-test/api/content-queue"
        );

        setImageQueue(responseData.data.Content);
        setState({ ...state, loading: false });
      } catch (error) {}
    }
    getContentQueue();
  }, []);
  for (let i = 0; i < imageQueue.length; i++) {
    if (imageQueue[i].pAccepted == 1 && imageQueue[i].photo == 0) {
      list.push(imageQueue[i]);
    }
  }

  return (
    <React.Fragment>
      {state.loading ? (
        <Spinner />
      ) : (
        <Frame headerLabel="  Photography Queue">
          <div className="row justify-content-between py-5   ">
            <div
              className="col-12 row  overflow-scroll align-content-start "
              style={{ height: "70vh" }}
            >
              <div className="fs-4 col-12 text-center">
                <h2 className="fs-4">
                  Images Queue --{" "}
                  <span className="fs-4 text-danger">{list.length}</span> New
                  Products Found
                </h2>
              </div>
              {imageQueue.length > 0 &&
                imageQueue.map((item, index) => {
                  return item.pAccepted == 1 && item.photo == 0 ? (
                    <Link
                      to={`/mainpage/content/Iqueue/${item.lookupcode}`}
                      key={index}
                      className="fs-6 card col-12 rounded-4 my-2 text-center  overflow-hidden text-decoration-none text-dark"
                    >
                      <motion.div
                        whileHover={{
                          scale: 1.1,
                        }}
                        className="fs-6 card-body overflow-hidden fst-italic  p-4"
                      >
                        <h5 className="card-title">
                          Item Lookup Code:{" "}
                          <span className="fs-6 text-success fw-bolder">
                            {item.lookupcode}
                          </span>{" "}
                        </h5>

                        <p className="fs-6 card-text">{item.description}</p>
                      </motion.div>
                    </Link>
                  ) : (
                    ""
                  );
                })}
            </div>
          </div>
        </Frame>
      )}
    </React.Fragment>
  );
};

export default ImageQueue;
