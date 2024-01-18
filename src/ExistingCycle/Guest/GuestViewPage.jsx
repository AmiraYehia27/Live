import React from "react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../Spinner/Spinner";
import axios from "axios";
const GuestViewPage = () => {
  let { Id } = useParams();
  //This line uses the useParams hook from React Router to extract the Id parameter from the URL. The Id parameter is then stored in a variable using destructuring.

  const [imagesView, setImagesView] = useState([]);
  //This line initializes a state variable imagesView with an empty array, and setImagesView function that allows updating the imagesView state variable.

  let [state, setState] = useState({
    loading: false,
    products: [],
    errorMessage: "",
  });
  //This line initializes a state variable state with an object containing loading, products, and errorMessage properties, and a setState function that allows updating the state state variable.

  let [productUpdate, setProductUpdate] = useState({
    ItemID: "",
    ItemLookupCode: Id,
    old_description: "",
    new_description: "",
  });
  //This line initializes a state variable productUpdate with an object containing ItemID, ItemLookupCode, old_description, and new_description properties, and setProductUpdate function that allows updating the productUpdate state variable.

  async function getTheProduct() {
    try {
      setState({ ...state, loading: true });
      let response = await axios.get(
        `http://192.168.26.15/itemcreation-test/api/products/${Id}`
      );
      let imagesResponse = await axios.get(
        `http://192.168.26.15/itemcreation-test/api/photos/${Id}`
      );
      setImagesView(imagesResponse.data.photos);
      setState({ ...state, loading: false, products: response.data.Item });
    } catch (error) {
      setState({ ...state, loading: false, errorMessage: error.message });
    }
  }
  //This function getTheProduct is an asynchronous function that retrieves the product and its images from the server. It first sets the loading property in the state object to true and then makes two HTTP GET requests to retrieve the product and its images. Upon receiving the response, it sets the products and imagesView state variables with the response data, respectively. If there is an error, it sets the errorMessage and loading properties in the state object.

  useEffect(() => {
    getTheProduct();
  }, [Id]);

  //This effect hook is called every time the Id parameter changes. It calls the getTheProduct function to retrieve the product and its images from the server.

  let { loading, products } = state;
  return (
    <React.Fragment>
      <section
        className=" position-relative"
        style={{
          height: "100vh",
          backgroundColor: "#00A88610",
          overflowY: "scroll",
        }}
      >
        <div className="Layout  position-absolute top-0 start-0 end-0 bottom-0 d-flex justify-content-center align-items-center">
          <div className="container   ">
            <div className="grid h-100">
              <div className="row my-3 p-5  justify-content-center rounded-3 align-items-center inputs-section position-relative ">
                <div
                  className="col-12 nav  navbar w-100 fixed-top  row  mb-5 "
                  style={{ backgroundColor: "#00a886", height: "10%" }}
                >
                  <h3 className="  col-4 text-center text-light   fw-bold">
                    Guest Page
                  </h3>
                  <h3 className="  col-4 text-center text-light  fw-bold">
                    <img
                      src="/itemcreation/images/logo_white.png"
                      alt="Logo"
                      className="w-50"
                    />
                  </h3>
                </div>
                {loading ? (
                  <Spinner />
                ) : (
                  <React.Fragment>
                    {products.length > 0 &&
                      products.map((product, index) => {
                        if (productUpdate.new_description == "") {
                          productUpdate.new_description = product.Description;
                        }

                        return (
                          <form
                            className="row justify-content-evenly  p-5  "
                            key={product.ID}
                            style={{ maxHeight: "100vh" }}
                          >
                            <div className="col-6">
                              <label
                                htmlFor="productCodet"
                                className=" ms-2 my-1  fs-5 text-dark"
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
                            <div className="col-6 d-none">
                              <label
                                htmlFor="productId"
                                className=" ms-2 my-1  fs-5 text-dark "
                              >
                                Item ID
                              </label>
                              <input
                                readOnly
                                id="productID"
                                name="ID"
                                type="text"
                                className="form-control "
                                value={product.ID}
                              />
                            </div>
                            <div className="col-6">
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
                                value={product.Description}
                              />
                            </div>
                            <div className="col-6">
                              <label
                                htmlFor="Price"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                Price
                              </label>
                              <input
                                readOnly
                                id="Price"
                                type="text"
                                className="form-control "
                                value={product.Price}
                              />
                            </div>
                            <div className="col-6">
                              <label
                                htmlFor="cond"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                Storing Condition
                              </label>
                              <input
                                readOnly
                                id="cond"
                                type="text"
                                className="form-control "
                                value={product.SubDescription1}
                              />
                            </div>
                            <div className="col-6">
                              <label
                                htmlFor="Expiration"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                Expiration Days
                              </label>
                              <input
                                readOnly
                                id="Expiration"
                                type="text"
                                className="form-control "
                                value={product.SubDescription2}
                              />
                            </div>
                            <div className="col-6"></div>
                            <div className="col-6">
                              <label
                                htmlFor="englishName"
                                className=" ms-2 my-1  fs-5 text-dark"
                              >
                                English Web Name
                              </label>
                              <input
                                value={product.EnName}
                                readOnly
                                id="englishName"
                                name="new_EnName"
                                type="text"
                                className="form-control "
                              />
                            </div>
                            <div className="col-6">
                              <label
                                htmlFor="arabicName"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                Arabic Web Name
                              </label>
                              <input
                                value={product.ArName}
                                readOnly
                                name="new_ArName"
                                id="arabicName"
                                type="text"
                                className="form-control "
                              />
                            </div>

                            <div className="col-6">
                              <label
                                htmlFor="type"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                English Web Description
                              </label>
                              <textarea
                                readOnly
                                name="new_EnDesc"
                                id="ar_dsc"
                                rows="5"
                                cols="30"
                                className="form-control fs-3 "
                                value={product.EnDesc}
                              ></textarea>
                            </div>

                            <div className="col-6">
                              <label
                                htmlFor="type"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                Arabic Web Description
                              </label>
                              <textarea
                                readOnly
                                name="new_ArDesc"
                                id="ar_dsc"
                                rows="5"
                                cols="30"
                                className="form-control fs-3 "
                                value={product.ArDesc}
                              ></textarea>
                            </div>
                            <div className="col-6">
                              <label
                                htmlFor="type"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                English Ingredients
                              </label>
                              <textarea
                                readOnly
                                name="new_EnIngredients"
                                id="ar_dsc"
                                rows="5"
                                cols="30"
                                className="form-control fs-3 "
                                value={product.EnIngredients}
                              ></textarea>
                            </div>
                            <div className="col-6">
                              <label
                                htmlFor="type"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                Arabic Ingredients
                              </label>
                              <textarea
                                readOnly
                                name="new_ArIngredients"
                                id="ar_dsc"
                                rows="5"
                                cols="30"
                                className="form-control fs-3 "
                                value={product.ArIngredients}
                              ></textarea>
                            </div>
                            {imagesView.length ? (
                              imagesView.map((photo, index) => {
                                return (
                                  <div className="col-3" key={index}>
                                    <img
                                      src={`http://192.168.26.15/itemcreation-test/uploads/${photo.file}`}
                                      alt=""
                                      className="w-100"
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <h4 className="fw-bold mt-5 text-center">
                                There are no pictures for that item currently
                              </h4>
                            )}

                            <div className="col-12 p-1 row justify-content-between m-auto my-4 ">
                              <Link
                                to="/guest"
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default GuestViewPage;
