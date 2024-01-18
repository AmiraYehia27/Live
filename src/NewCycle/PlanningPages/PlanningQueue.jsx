import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Spinner from "../../Spinner/Spinner";
import Frame from "../../Components/MainFrame/Frame";
const PlanningQueue = () => {
  let list = [];
  let checkupList = [];
  //These are two arrays that will be used to store filtered data later in the code.
  const [contentQueue, setContentQueue] = useState([]);
  const [filterredArray, setFilterredArray] = useState([]);
  const [state, setState] = useState({
    loading: false,
    errorMessage: "",
    suppliers: [],
    DepartmentID: "",
  });
  /*These are three state variables declared using the useState hook. The contentQueue state variable will store the raw data received from the API, the filterredArray state variable will store the filtered data, and the state variable is used to store other state information such as whether the data is still being loaded (loading), any error messages received (errorMessage), and the list of available suppliers fetched from another API. */

  useEffect(() => {
    async function getContentQueue() {
      try {
        setState((prev) => {
          return { ...prev, loading: true };
        });
        let responseData = await axios.get(
          "http://192.168.26.15/itemcreation-test/api/new-non-web"
        );
        let response = await axios.get(
          "http://192.168.26.15/itemcreation-test/api/departments"
        );
        setContentQueue(responseData.data.Product);
        setState((prev) => {
          return {
            ...prev,
            loading: false,
            suppliers: response.data.departments,
          };
        });
      } catch (error) {}
    }
    getContentQueue();
  }, []);
  /*This is the useEffect hook that is called after the component has mounted. It is used to fetch data from two API endpoints using the axios library. The loading state variable is set to true initially, then set to false after the data has been received. The received data is stored in the contentQueue and suppliers state variables.
   */
  for (let i = 0; i < contentQueue.length; i++) {
    if (contentQueue[i].pAccepted == 0 && contentQueue[i].pRejected == 0) {
      list.push(contentQueue[i]);
    }
  }
  //This loop iterates through the contentQueue array and filters out items that have pAccepted and pRejected properties equal to 0. The filtered items are added to the list array.

  for (let i = 0; i < contentQueue.length; i++) {
    if (
      contentQueue[i].checkup == 1 &&
      contentQueue[i].ready == 0 &&
      contentQueue[i].photo == 1
    ) {
      checkupList.push(contentQueue[i]);
    }
  }
  //This loop iterates through the contentQueue array and filters out items that have checkup property equal to 1, ready property equal to 0, and photo property equal to 1. The filtered items are added to the checkupList array.

  const handleDepartmentOnChange = (e) => {
    setState((prev) => {
      return { ...prev, DepartmentID: e.target.value };
    });
    let list = [...contentQueue];
    let filteredlist = list.filter(
      (item) => item.DepartmentID == e.target.value
    );
    setFilterredArray(filteredlist);
  };
  //This is a function that is called when the value of a <select> element is changed.
  return (
    <React.Fragment>
      {state.loading ? (
        <Spinner />
      ) : (
        <Frame headerLabel={"Products Queue"}>
          <div className="row justify-content-between align-content-start py-5  g-4 fs-6">
            <div
              className="col-12 row  mb-5  overflow-scroll  align-content-start fs-6   "
              style={{ maxHeight: "90vh" }}
            >
              <div className="col-12 fs-4">
                <h2 className="text-center fs-4">
                  Products Queue --{" "}
                  <span className=" text-danger fs-4">{list.length}</span> New
                  Products Found
                </h2>
              </div>
              <div className="col-6 m-auto">
                <select
                  id="rmsDepa"
                  name="DepartmentID"
                  type="number"
                  value={state.DepartmentID}
                  className="form-control  rounded-3  border-3 border   "
                  onChange={(e) => {
                    handleDepartmentOnChange(e);
                  }}
                >
                  <option value="">All Departments</option>
                  {state.suppliers.map((department) => {
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
              {filterredArray.length > 0 || state.DepartmentID != ""
                ? filterredArray.map((item, index) => {
                    return (
                      item.pAccepted == 0 &&
                      item.pRejected == 0 && (
                        <Link
                          to={`/mainpage/content/pqueue/${item.lookupcode}`}
                          key={index}
                          className="card col-12 rounded-4 my-2 fs-6 overflow-hidden text-decoration-none text-dark text-center"
                        >
                          <motion.div
                            whileHover={{
                              scale: 1.1,
                            }}
                            className="card-body fs-6 overflow-hidden fst-italic fs-6 p-4"
                          >
                            <h5 className="card-title">
                              Item Lookup Code:{" "}
                              <span className=" text-success fw-bolder fs-6">
                                {item.lookupcode}
                              </span>{" "}
                            </h5>

                            <p className="card-text fs-6">{item.description}</p>
                          </motion.div>
                        </Link>
                      )
                    );
                  })
                : contentQueue.map((item, index) => {
                    return (
                      item.pAccepted == 0 &&
                      item.pRejected == 0 && (
                        <Link
                          to={`/mainpage/content/pqueue/${item.lookupcode}`}
                          key={index}
                          className="card col-12 rounded-4 my-2 fs-6 overflow-hidden text-decoration-none text-dark text-center"
                        >
                          <motion.div
                            whileHover={{
                              scale: 1.1,
                            }}
                            className="card-body fs-6 overflow-hidden fst-italic fs-6 p-4"
                          >
                            <h5 className="card-title">
                              Item Lookup Code:{" "}
                              <span className=" text-success fw-bolder fs-6">
                                {item.lookupcode}
                              </span>{" "}
                            </h5>

                            <p className="card-text fs-6">{item.description}</p>
                          </motion.div>
                        </Link>
                      )
                    );
                  })}
            </div>
          </div>
        </Frame>
      )}
    </React.Fragment>
  );
};

export default PlanningQueue;
