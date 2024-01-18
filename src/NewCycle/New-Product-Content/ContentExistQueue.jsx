import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Spinner from "../../Spinner/Spinner";
const ContentExistQueue = () => {
  const [contentQueue, setContentQueue] = useState([]);
  const [state, setState] = useState({
    loading: false,
    errorMessage: "",
  });
  useEffect(() => {
    async function getContentQueue() {
      try {
        setState({ ...state, loading: true });
        let responseData = await axios.get(
          "http://192.168.26.15/itemcreation-test/api/web-q"
        );
        console.log(responseData);
        setContentQueue(responseData.data.webQ);
        setState({ ...state, loading: false });
      } catch (error) {
        setState({ ...state, loading: false });
      }
    }
    getContentQueue();
  }, []);

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
            <div className="row justify-content-center   g-4">
              <div
                className="col-12 row   overflow-scroll align-content-start   justify-content-center   "
                style={{ height: "70vh" }}
              >
                <div className="col-12 text-center">
                  <h2 className="fs-4">
                    Existing Queue --{" "}
                    <span className="fs-4 text-danger">
                      {contentQueue.length}
                    </span>{" "}
                    New Products Found
                  </h2>
                </div>
                {contentQueue.map((item, index) => {
                  return (
                    <Link
                      to={`/mainpage/content/existing/${item.ItemLookupCode}`}
                      key={index}
                      className="card col-8 rounded-4 my-2  overflow-hidden text-decoration-none text-dark"
                    >
                      <motion.div
                        whileHover={{
                          scale: 1.1,
                        }}
                        className="card-body overflow-hidden fst-italic fs-5 p-4"
                      >
                        <h5 className="fs-6 card-title text-center">
                          Item Lookup Code:{" "}
                          <span className="fs-6 text-success fw-bolder">
                            {item.ItemLookupCode}
                          </span>{" "}
                        </h5>
                        <p className="fs-6 card-text text-center">
                          {item.Description}
                        </p>
                      </motion.div>
                    </Link>
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
/*The component is defined using the useState and useEffect hooks from React.

The useState hook is used to define two state variables: contentQueue and state.

The contentQueue state variable is an array that holds the list of products in the queue.

The state state variable is an object that has two properties: loading and errorMessage. The loading property is a boolean that indicates whether the data is being fetched or not, while the errorMessage property holds an error message if there is any.

The useEffect hook is used to fetch the list of products from an API endpoint when the component mounts.

Inside the useEffect hook, the getContentQueue function is defined using the async and await keywords. This function sends a GET request to an API endpoint and retrieves the list of products in the queue.

The axios library is used to send the GET request to the API endpoint.

The setState method is used to update the state variable to show that the data is being fetched.

The setContentQueue method is used to update the contentQueue state variable with the data received from the API endpoint.

The setState method is used again to update the state variable to show that the data has finished fetching.

The component returns a JSX template that displays the list of products in the queue.

If the state.loading property is true, a Spinner component is displayed.

If the state.loading property is false, the list of products in the queue is displayed.

The list of products is displayed inside a section element with the ID ContentQueue.

The contentQueue array is mapped over using the map method to display each product in the queue.

Each product is displayed as a Link component that navigates to the product details page when clicked.

The motion component from the framer-motion library is used to add a hover animation to each product.

The product details are displayed inside a card element that shows the product's ItemLookupCode and Description. */

export default ContentExistQueue;
