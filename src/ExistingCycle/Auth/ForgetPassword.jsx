import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Joi from "joi";
import Spinner from "../../Spinner/Spinner";
import Axios from "axios";
import MainButton from "../../Components/MainButton/MainButton";

export default function ForgetPassword() {
  let navigate = useNavigate();
  //Importing the useNavigate hook from the react-router-dom package.

  const [errList, setErrList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [users, setUser] = useState({
    loading: false,
    user: { email: "" },
    errorMessage: "",
  });
  /*
Declaring multiple state variables using the useState hook, including:
errList and setErrList: for handling errors that occur during form validation.
isLoading and setIsLoading: for toggling a loading spinner.
isSubmitted and setIsSubmitted: for tracking whether or not the form has been submitted.
users and setUser: for storing user data, including email, and any errors that may occur.
*/
  let { loading, user } = users;
  //Destructuring the users state variable to extract the loading and user properties.

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
          "http://192.168.26.15/itemcreation-testlr/api/forgot-password",
          users.user
        );
        if (
          response.data.status == "We have emailed your password reset link!"
        ) {
          setIsLoading(false);
          setIsSubmitted(true);
          setUser({
            ...users,
            user: {
              ...users.user,
              email: "",
            },
          });
        } else if (response.data.errors.email) {
          window.alert("error sha8al ");
        } else {
          setIsLoading(false);
          setIsSubmitted(false);
        }
      } catch (error) {
        setIsLoading(false);
        setIsSubmitted(false);
        navigate("/forgetpassword", { replace: false });
      }
    }
  }
  /*
Defining an asynchronous function called formSubmut that handles form submission.
Preventing the default form submission behavior using e.preventDefault().
Calling the ValidateForm() function to validate the user's email.
If there are errors, setting the error list using setErrList and stopping the loading spinner using setIsLoading.
Otherwise, proceeding with form submission logic.
   */
  function getUserData(e) {
    setUser({
      ...users,
      user: { ...users.user, [e.target.name]: e.target.value },
    });
    setErrList([]);
    setIsSubmitted(false);
  }
  /*
   Defining a function called getUserData that updates the users state variable when a user inputs their email.
Using the setUser function to update the users state variable.
Setting the error list and submission status to their initial values.
csharp

   */
  function ValidateForm() {
    let scheme = Joi.object({
      email: Joi.string().pattern(
        new RegExp("^[A-Za-z0-9._%+-]+@gourmetegypt.com$")
      ),
    });
    return scheme.validate(user, { abortEarly: false });
  }
  /*
Defining a function called ValidateForm that uses the Joi library to validate the user's email.
The email must match a regular expression pattern, which is defined as part of the Joi.object schema.
The validate function returns an object with an error property if there are any validation errors.
*/
  return (
    <React.Fragment>
      <section
        id="HomeSec"
        className="main-section w-100 vh-100   position-relative  overflow-hidden  "
      >
        <div className="HomeLayout"></div>

        <div className="row my-0 flex-wrap g-0 w-100 h-100 justify-content-center overflow-hidden  align-items-center position-relative ">
          <div className="col-6 row justify-content-center m-auto text-center">
            {" "}
            <motion.div className=" text-white col-8 ">
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
                      className=" row p-4 g-3  overflow-hidden"
                    >
                      {errList.map((error) =>
                        errList.length === 1 &&
                        error.message.includes("email") ? (
                          <div className="col-8 m-auto alert alert-danger p-2 my-1">
                            Invalid Email
                          </div>
                        ) : (
                          <div className="col-8 m-auto alert alert-danger p-2 my-1">
                            {error.message}
                          </div>
                        )
                      )}
                      {isSubmitted ? (
                        <div className="col-8 m-auto alert alert-success p-2 my-1">
                          A Reset Password Link has been sent to your mail
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="mb-3 col-12 position-relative inputs-group">
                        <input
                          placeholder="Email@gourmetegypt.com"
                          onChange={getUserData}
                          value={user.email}
                          name="email"
                          type="email"
                          className="form-control rounded-3 "
                        />
                      </div>

                      <div className="col-12 me-2 mt-2 row justify-content-center m-0 p-0">
                        {" "}
                        <div className=" col-4 ">
                          <Link to="/signup">
                            <MainButton type="button" value={"Sign Up"} />
                          </Link>
                        </div>
                        <div className="col-3 ">
                          <MainButton
                            type="submit"
                            value={
                              isLoading ? (
                                <i class="fa-solid fa-spinner fa-spin"></i>
                              ) : (
                                "Submit"
                              )
                            }
                          />
                        </div>
                        <div className="col-12 row justify-content-center text-center">
                          <div className=" col-5 mt-3 ">
                            <Link
                              className=" text-decoration-none navLink text-light "
                              to="/"
                            >
                              Home
                            </Link>
                          </div>
                        </div>
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
}
