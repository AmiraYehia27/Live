import React from "react";
import { Outlet } from "react-router-dom";
import Login from "../Auth/Login";
import { useState } from "react";

const useAuth = () => {
   let userObject = JSON.parse(sessionStorage.getItem("userData"));
   const user = { loggedIn: userObject ? true : false };
   return user && user.loggedIn;
};

const ProtectedRoutes = () => {
   const [isAuth, setIsAuth] = useState(useAuth());
   JSON.stringify(sessionStorage.setItem("setIsAuth", isAuth));
   return sessionStorage.getItem("setIsAuth") && isAuth ? <Outlet /> : <Login setIsAuth={setIsAuth} loggedIn={isAuth} />;
};

export default ProtectedRoutes;
/*
We import React and some specific functions from other libraries: Outlet from react-router-dom, and useState from react.
We define a custom hook called useAuth which checks whether a user is logged in by retrieving their data from sessionStorage. If user data is present in sessionStorage, useAuth returns an object with a loggedIn property set to true. Otherwise, it returns false.
We define a functional component called ProtectedRoutes which renders a nested Outlet component if the user is authenticated, and a Login component if the user is not authenticated.
We use the useState hook to initialize a state variable called isAuth and pass the result of calling useAuth as its initial value.
We call JSON.stringify to convert the value of isAuth to a string, and then store it in sessionStorage using the key "setIsAuth".
We use a ternary operator to conditionally render either <Outlet /> or <Login /> based on whether isAuth is truthy or falsy.
*/