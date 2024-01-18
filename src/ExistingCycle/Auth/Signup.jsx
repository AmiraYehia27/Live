import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Joi from "joi";
import Spinner from "../../Spinner/Spinner";
import Axios from "axios";
import MainButton from "../../Components/MainButton/MainButton";
const Signup = () => {
  let navigate = useNavigate();
  //Here, we are using the useNavigate hook from the React Router library to get the navigation object. This allows us to programmatically navigate to different pages within our application.

  const [errList, setErrList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExist, setIsExist] = useState(false);
  //Here, we are using the useState hook to create state variables for errList, isLoading, isSubmitted, and isExist. The useState hook returns an array with two elements: the current value of the state variable and a function to update that value.

  const [users, setUser] = useState({
    loading: false,
    user: { name: "", email: "", password: "", role_id: "0" },
    errorMessage: "",
    roles: [],
  });
  //Here, we are using the useState hook to create a state variable for users. The initial value of users is an object that contains a loading property set to false, a user property that is an object with name, email, password, and role_id fields, and errorMessage and roles properties set to empty strings and an empty array, respectively.

  async function getTheContact() {
    try {
      setUser({ ...users, loading: true });
      let response = await Axios.get("http://192.168.26.15/itemcreation-test/api/roles");

      setUser({ ...users, loading: false, roles: response.data.roles });
    } catch (error) {
      setUser({ ...users, loading: false, errorMessage: error.message });
    }
  }
  useEffect(() => {
    getTheContact();
  }, []);
  //Here, we are defining an async function named getTheContact that sets the loading property of users to true and makes a GET request to the URL specified in Axios.get to retrieve a list of roles. If successful, the roles property of users is updated with the response data, and the loading property is set to false. If the request fails, the errorMessage property of users is set to the error message. We are also using the useEffect hook to call this function only once when the component mounts.

  function getUserData(e) {
    setUser({
      ...users,
      user: { ...users.user, [e.target.name]: e.target.value },
    });
    setErrList([]);
    setIsSubmitted(false);
    setIsExist(false);
  }
  async function formSubmut(e) {
    e.preventDefault();
    setIsLoading(true);
    let validationResults = ValidateForm();

    if (validationResults.error) {
      setErrList(validationResults.error.details);
      setIsLoading(false);
    } else {
      try {
        if (users.user.role_id != null) {
          let response = await Axios.post(
            "http://192.168.26.15/itemcreation-test/api/auth/register",
            users.user
          );

          if (
            response.data.message ==
            "User created successfully and waiting for manager approval"
          ) {
            setIsLoading(false);
            setIsSubmitted(true);
            setUser({
              ...users,
              user: {
                ...users.user,
                name: "",
                email: "",
                password: "",
                role_id: "0",
              },
            });
          } else {
            setIsLoading(false);
            setIsSubmitted(false);
            setIsExist(true);
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setUser({ ...users, errorMessage: error.data.message });
        setIsLoading(false);
        setIsSubmitted(false);
        navigate("/signup", { replace: false });
      }
    }
  }
  function ValidateForm() {
    let scheme = Joi.object({
      name: Joi.string().min(3).max(20).required(),
      email: Joi.string().pattern(
        new RegExp("^[A-Za-z0-9._%+-]+@gourmetegypt.com$")
      ),
      password: Joi.string().min(6).max(20).required(),
      role_id: Joi.string().min(0).max(20).required(),
    });
    return scheme.validate(user, { abortEarly: false });
  }
  /*
The formSubmit function is an asynchronous function that is called when the user submits a form. It first prevents the default form submission behavior, then sets the isLoading state to true to indicate that the form is being submitted.

The ValidateForm function uses the Joi library to define a validation schema for the form data. It checks that the name, email, password, and role_id fields are all present, meet certain length requirements, and that the email is in a specific format.

If the form data passes validation, the code sends a POST request to a backend API endpoint using Axios. If the server responds with a specific message indicating that the user was created successfully, the isLoading state is set to false, the isSubmitted state is set to true, and the user state is reset to an empty form.

If the server responds with a message indicating that the user could not be created, the isLoading state is set to false, and the isSubmitted and isExist states are updated accordingly.

If there is an error with the request, the isLoading state is set to false, the isSubmitted state is set to false, and the user is redirected to the signup page with an error message.
   */
  let { loading, user, errorMessage, roles } = users;

  return (
    <React.Fragment>
      <section
        id="HomeSec"
        className="main-section w-100 vh-100   position-relative  overflow-hidden   "
      >
        <div className="row align-items-center align-content-center h-100 ">
          <div className="col-6  row justify-content-center m-auto text-center align-items-center align-content-center">
            <motion.div className="div col-8 text-white">
              <h2 className="fw-bolder mt-1 h3  ">
                <Link to="/">
                  <img
                    src="images/logo-01.svg"
                    alt="Logo is not here"
                    className=" w-100"
                  />
                </Link>
              </h2>
              {loading ? (
                <Spinner />
              ) : (
                <React.Fragment>
                  {" "}
                  {Object.keys(user).length > 0 && (
                    <motion.form
                      onSubmit={formSubmut}
                      className=" row m-0   overflow-hidden"
                      style={{ zIndex: "9990000" }}
                    >
                      {errList.map((error) =>
                        errList.length === 1 &&
                        error.message.includes("email") ? (
                          <div className="col-8 m-auto text-center alert alert-danger p-2 my-1">
                            Invalid Email
                          </div>
                        ) : (
                          <div className="col-8 m-auto text-center alert alert-danger p-2 my-1">
                            {error.message}
                          </div>
                        )
                      )}
                      {isExist ? (
                        <div className="col-8 m-auto text-center alert alert-danger p-2 my-1">
                          User already exists
                        </div>
                      ) : (
                        ""
                      )}
                      {isSubmitted ? (
                        <div className="col-8 m-auto text-center alert alert-success p-2 my-1">
                          Pending Admin Approval
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="mb-3 col-12 position-relative inputs-group">
                        <input
                          required
                          placeholder="Enter Your Name"
                          onChange={getUserData}
                          value={user.name}
                          name="name"
                          type="text"
                          className="form-control rounded-3    w-75 m-auto "
                        />
                      </div>

                      <div className="mb-3 col-12 position-relative inputs-group">
                        <input
                          required
                          placeholder="Email@gourmetegypt.com"
                          onChange={getUserData}
                          value={user.email}
                          name="email"
                          type="email"
                          className="form-control rounded-3   w-75 m-auto "
                        />
                      </div>

                      <div className="mb-3 col-12 position-relative inputs-group">
                        <input
                          required
                          placeholder="Enter password"
                          onChange={getUserData}
                          value={user.password}
                          name="password"
                          type="password"
                          className="form-control rounded-3  w-75 m-auto"
                        />
                      </div>
                      <div className="mb-3 col-12 position-relative inputs-group">
                        <select
                          required={true}
                          type="text"
                          onChange={getUserData}
                          value={user.role_id}
                          name="role_id"
                          className="form-control rounded-3 w-75 m-auto"
                        >
                          <option value="">Select your team</option>
                          {roles.length > 0 &&
                            roles.map((role) => {
                              return role.id != 1 && role.id != 7 ? (
                                <option
                                  type="text"
                                  name="role_id"
                                  key={role.id}
                                  value={role.id}
                                >
                                  {role.name}
                                </option>
                              ) : (
                                ""
                              );
                            })}
                        </select>
                      </div>
                      <div
                        className="  row justify-content-center position-relative  m-0 w-100  px-3 "
                        style={{ zIndex: 99999999999 }}
                      >
                        <div className="col-12 ">
                          <MainButton
                            moreCSS="fs-6"
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
                      </div>

                      <div className=" col-12 text-end fw-bold ">
                        <Link to="/login" className="text-dark   ">
                          Login Page
                        </Link>
                      </div>
                    </motion.form>
                  )}
                </React.Fragment>
              )}
            </motion.div>
          </div>
          <div className="col-6"></div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Signup;
