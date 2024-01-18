import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Joi from "joi";
import Spinner from "../../Spinner/Spinner";
import Axios from "axios";
import MainButton from "../../Components/MainButton/MainButton";
import swal from "sweetalert";

const Login = (props) => {
  let navigate = useNavigate();
  //This line declares a variable navigate using the useNavigate hook from the React Router library. useNavigate returns a navigate function which can be used to programmatically navigate to different routes in the application.

  const [errList, setErrList] = useState([]);
  //This line declares a state variable errList using the useState hook. The initial value of errList is an empty array, and setErrList is a function that can be used to update the value of errList.

  const [isLoading, setIsLoading] = useState(false);
  //This line declares a state variable isLoading using the useState hook. The initial value of isLoading is false, and setIsLoading is a function that can be used to update the value of isLoading.

  const [users, setUser] = useState({
    loading: false,
    user: { email: "", password: "" },
    errorMessage: "",
    groups: [],
  });
  //This line declares a state variable users using the useState hook. The initial value of users is an object with four properties: loading, user, errorMessage, and groups. loading is initially false, user is an object with properties email and password initially set to empty strings, errorMessage is an empty string, and groups is an empty array. setUser is a function that can be used to update the value of users.

  let { loading, user } = users;
  //This line declares two variables loading and user using object destructuring. loading is assigned the value of users.loading, and user is assigned the value of users.user.

  sessionStorage.removeItem("setIsAuth");
  sessionStorage.removeItem("userData");
  //These two lines remove the setIsAuth and userData keys from the session storage.

  async function formSubmut(e) {
    e.preventDefault();
    setIsLoading(true);
    let validationResults = ValidateForm();
    if (validationResults.error) {
      setErrList(validationResults.error.details);
      setIsLoading(false);
    } else {
      try {
        let response = await Axios.post(
          "http://192.168.26.15/itemcreation-test/api/auth/login",
          users.user
        );
        if (response.data) {
          if (
            response.data.user.status != 0 &&
            response.data.user.status != 2
          ) {
            setIsLoading(false);
            if (props.setIsAuth) {
              props.setIsAuth(true);
            }
            sessionStorage.setItem(
              "userData",
              // JSON.stringify({"id":8,"name":"amira yehia","email":"amira.yehia@gourmetegypt.com","role_id":"8","status":"1","reason":".","created_at":"2024-01-01T10:03:19.357000Z","updated_at":"2024-01-01T10:03:19.357000Z"})
              JSON.stringify(response.data.user)

            );
            swal({
              title: `Hi ${response.data.user.name}`,
              text: "You Logged in successfully  ",
              icon: "success",
              button: false,
              timer: 1200,
            });

            navigate("/mainpage", { replace: true });
          } else {
            swal({
              title: `Hi ${response.data.user.name}`,
              text: "Your Account is pending approval   ",
              icon: "warning",
              button: false,
              timer: 1200,
            });
            setIsLoading(false);
          }
        }
      } catch (error) {
        swal({
          title: `Error `,
          text: error.response.data.message,
          icon: "error",
          button: false,
          timer: 1200,
        });
        setIsLoading(false);
        navigate("/login", { replace: false });
      }
    }
  }
  //This function is an asynchronous function that is called when the user submits the form. It first prevents the default form submission behavior, then sets the isLoading state to true to indicate that the submission is in progress. It then calls the ValidateForm() function to validate the user's input values and assigns the result to a new variable validationResults. If there are any validation errors, the function sets the errList state to the details of the validation errors and sets the isLoading state to false. Otherwise, it proceeds to the next code block to submit the form data to the server.

  function getUserData(e) {
    setUser({
      ...users,
      user: { ...users.user, [e.target.name]: e.target.value },
    });
    setErrList([]);
  }
  function ValidateForm() {
    let scheme = Joi.object({
      email: Joi.string().pattern(
        new RegExp("^[A-Za-z0-9._%+-]+@gourmetegypt.com$")
      ),
      password: Joi.string().min(3).max(20).required(),
    });
    return scheme.validate(user, { abortEarly: false });
  }
  //This function uses the Joi library to define a validation schema that requires the email property to match a specific regular expression and the `password

  return (
    <React.Fragment>
      <section
        id="HomeSec"
        className="main-section w-100 vh-100   position-relative  overflow-hidden  "
      >
        <div className="HomeLayout"></div>

        <div className="row my-0 flex-wrap g-0 w-100 h-100 justify-content-center overflow-hidden  align-items-center position-relative ">
          <div className="col-6 row justify-content-center">
            <motion.div className="div text-white col-10 ">
              <h1 className="fw-bolder my-3 ">
                <Link to="/">
                  <img
                    src="/itemcreation/images/logo-01.svg"
                    alt="Logo is not here"
                    className=" w-100"
                  />
                </Link>
              </h1>
              {loading ? (
                <Spinner />
              ) : (
                <React.Fragment>
                  {Object.keys(user).length > 0 && (
                    <motion.form
                      onSubmit={formSubmut}
                      className=" row p-4 g-3 justify-content-evenly overflow-hidden"
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

                      <div className="mb-3 col-12 position-relative inputs-group">
                        <input
                          onChange={getUserData}
                          value={user.email}
                          placeholder="Email@gourmetegypt.com"
                          name="email"
                          type="email"
                          className="form-control rounded-3 w-75 m-auto "
                        />
                      </div>

                      <div className="mb-3 col-12 position-relative inputs-group">
                        <input
                          onChange={getUserData}
                          value={user.password}
                          name="password"
                          placeholder="Enter Your password"
                          type="password"
                          className="form-control rounded-3 w-75 m-auto"
                        />
                      </div>
                      <div className="col-12  mt-2 row text-center position-relative justify-content-center m-0 p-0">
                        <div className="col-6 ">
                          <MainButton
                            type="submit"
                            moreCSS="fs-6"
                            value={
                              isLoading ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                              ) : (
                                "Login"
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className=" col-12 text-end fw-bold ">
                        <Link to="/signup" className="text-dark">
                          Signup Page
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

export default Login;
