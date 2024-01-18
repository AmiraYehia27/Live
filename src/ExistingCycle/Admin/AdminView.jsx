import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../Spinner/Spinner";
import Frame from "../../Components/MainFrame/Frame";

const AdminView = () => {
  let navigate = useNavigate();
  let [state, setState] = useState({
    loading: false,
    users: [],
    filteredusers: [],
    errorMessage: "",
  });
  //declares a state variable called state and a function called setState to update it using the useState hook from React. It initializes the state with an object that has four properties: loading, users, filteredusers, and errorMessage, all of which are empty or false.

  // Getting users data
  async function getUsers() {
    try {
      setState({ ...state, loading: true });
      let response = await axios.get("http://192.168.26.15/itemcreation-test/api/users");
      setState({ ...state, loading: false, users: response.data.users });
    } catch (error) {
      setState({ loading: false, errorMessage: error.message });
    }
  }
  //This function is an asynchronous function called getUsers that is defined to make an HTTP GET request to a remote API endpoint using the Axios library. It sets the loading property of the state object to true to indicate that the data is being fetched. After getting the data from the API, it sets the loading property to false and updates the users property with the response data. If there is an error, it sets the errorMessage property with the error message.

  // End if it
  useEffect(() => {
    getUsers();
  }, []);
  //handle side effects such as fetching data. It takes a callback function and runs it after the component is rendered. In this case, it calls the getUsers function to fetch data when the component is mounted, by passing an empty dependency array [] as the second argument, which indicates that the effect should only run once after initial rendering.

  // function getUserData(e) {
  //    let myUser = { ...user };
  //    myUser.reason = e.target.value;
  //    setUser(myUser);
  // }

  let { users, loading } = state;

  return (
    <React.Fragment>
      <Frame headerLabel="Admin View">
        {" "}
        {loading ? (
          <Spinner />
        ) : (
          <div className="viewPage">
            <div className="  my-2 p-5">
              <table
                className="table table-bordered  "
                style={{ backgroundColor: "#00a888" }}
              >
                <thead>
                  <tr className="text-center">
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role ID</th>
                    <th scope="col">Status</th>
                    <th scope="col">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 &&
                    users.map((user, index) => {
                      return user ? (
                        <tr key={user.id} className="text-center text-light">
                          <th scope="row">{user.id}</th>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            {user.role_id == 1
                              ? "Admin"
                              : user.role_id == 2
                              ? "Buying"
                              : user.role_id == 3
                              ? "Content"
                              : user.role_id == 4
                              ? "Photography"
                              : user.role_id == 5
                              ? "Assortment"
                              : user.role_id == 6
                              ? "Media Buying"
                              : user.role_id == 7
                              ? "Buying/Assortment"
                              : ""}
                          </td>
                          <td
                            className={
                              user.status == 1
                                ? "text-dark fw-bold"
                                : user.status == 2
                                ? " text-warning"
                                : "text-danger fw-bold"
                            }
                          >
                            {user.status == 2
                              ? "Pending"
                              : user.status == 1
                              ? "Active"
                              : user.status == 0
                              ? "Rejected"
                              : ""}
                          </td>
                          <td>
                            <Link to={`/mainpage/adminview/${user.id}`}>
                              <i className="fa-solid fa-pen-to-square text-light fs-3"></i>
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        ""
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Frame>
    </React.Fragment>
  );
};

export default AdminView;
