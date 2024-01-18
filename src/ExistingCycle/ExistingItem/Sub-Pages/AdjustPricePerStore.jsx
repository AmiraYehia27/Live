import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Frame from "../../../Components/MainFrame/Frame";
import { Table } from "react-bootstrap";
import MainButton from "../../../Components/MainButton/MainButton";
import swal from "sweetalert";

const AdjustPrice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [percentageValues, setPercentageValues] = useState({});
  const [currentPercentages, setCurrentPercentages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repDep, repCats, repPercentages] = await Promise.all([
          axios.get("http://192.168.26.15/itemcreation-test/api/departments"),
          axios.get("http://192.168.26.15/itemcreation-test/api/category"),
          axios.get("http://192.168.26.15/itemcreation-test/api/all-percentage"),
        ]);
        setDepartments(repDep.data.departments);
        setCategories(repCats.data.categories);
        const percentages = repPercentages.data.percentage.reduce(
          (acc, percentage) => {
            acc[percentage.categoryid] = {
              gouna: percentage.gouna_percent,
              sahel: percentage.north_percent,
            };
            return acc;
          },
          {}
        );
        setCurrentPercentages(percentages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleDepartmentChange = (event) => {
    const departmentId = event.target.value;
    const filteredCategories = categories.filter(
      (category) => category.DepartmentId === departmentId
    );
    setSelectedCategories(filteredCategories);
    setSelectedDepartment(departmentId);
  };

  const handlePercentageChange = (event, categoryId, store) => {
    setPercentageValues((prevPercentageValues) => ({
      ...prevPercentageValues,
      [categoryId]: {
        ...prevPercentageValues[categoryId],
        [store]: event.target.value,
      },
    }));
  };

  const user = JSON.parse(sessionStorage.getItem("userData"))?.id;
  // console.log(user);

  const handleSubmit = async (event) => {
    // event.preventDefault();
    setIsLoading(true);
    let data = []; // Initialize data with null

    selectedCategories.forEach((category) => {
      const categoryId = category.ID;
      const gounaPercentage =
        percentageValues[categoryId]?.gouna ||
        currentPercentages[category.ID]?.gouna;

      const sahelPercentage =
        percentageValues[categoryId]?.sahel ||
        currentPercentages[category.ID]?.sahel;

      data.push({
        category_id: categoryId,
        gouna_percentage: gounaPercentage,
        sahel_percentage: sahelPercentage,
        user: user,
      });
      console.log(data);
    });

    try {
      if (data !== null) {
        const response = await axios.post(
          "http://192.168.26.15/itemcreation-test/api/new-price",
          data
        );
        console.log(data);
        console.log(response);
        swal({
          // title: JSON.parse(sessionStorage.getItem("userData"))?.name ?? `Please Login Again`,
          text: "Percentages updated successfully",
          icon: "success",
          button: false,
          timer: 2000,
        });
      } else {
        swal({
          // title: JSON.parse(sessionStorage.getItem("userData"))?.name ?? `Please Login Again`,
          text: "Please enter valid percentages",
          icon: "error",
          button: true,
          timer: 30000,
        });
      }
    } catch (error) {
      console.log(error);
      swal({
        // title: JSON.parse(sessionStorage.getItem("userData"))?.name ?? `Please Login Again`,
        text: "Please enter valid percentages",
        icon: "error",
        button: true,
        timer: 30000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Frame headerLabel="Price Per Store Adjustment">
        <React.Fragment>
          <div>
            <h1>Select Department</h1>
          </div>
          <div id="adjast-price-per-store">
            <form onSubmit={handleSubmit}>
              <div>
                <select onChange={handleDepartmentChange}>
                  <option defaultValue hidden>
                    Select Department
                  </option>
                  {departments.map((department) => (
                    <option key={department.ID} value={department.ID}>
                      {department.code} - {department.Name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedDepartment && (
                <div>
                  <br />
                  <h3>Selected Categories:</h3>
                  <br />
                  <Table bordered hover>
                    <thead>
                      <tr className="text-center">
                        <th>Code</th>
                        <th>Category Name</th>
                        <th>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;
                        </th>
                        <th>Gouna Percentage</th>
                        <th>Current Percentage</th>
                        <th>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;
                        </th>
                        <th>North-Coast Percentage</th>
                        <th>Current Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCategories.map((category) => (
                        <tr
                          className="table-success text-center"
                          key={category.ID}
                        >
                          <td>
                            <p>{category.code}</p>
                            <input
                              className="text-center"
                              type="hidden"
                              name="category_id"
                              value={category.ID}
                            />
                          </td>
                          <td>
                            <div className="text-center">{category.Name}</div>
                          </td>
                          <td style={{ backgroundColor: "#e9ecef" }}></td>
                          <td>
                            <div className="input-group">
                              <input
                                className="form-control text-center"
                                type="number"
                                min="0"
                                max="15"
                                name="gouna_percentage"
                                value={
                                  percentageValues[category.ID]?.gouna ||
                                  currentPercentages[category.ID]?.gouna
                                }
                                onChange={(event) =>
                                  handlePercentageChange(
                                    event,
                                    category.ID,
                                    "gouna"
                                  )
                                }
                              />
                              <span
                                className="input-group-text"
                                id="basic-addon1"
                              >
                                %
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="input-group text-center">
                              <input
                                disabled
                                className="form-control text-center"
                                type="number"
                                value={
                                  currentPercentages[category.ID]?.gouna || ""
                                }
                              />
                              <span className="input-group-text">%</span>
                            </div>
                          </td>
                          <td style={{ backgroundColor: "#e9ecef" }}></td>
                          <td>
                            <div className="input-group text-center">
                              <input
                                className="form-control text-center"
                                type="number"
                                min="0"
                                max="15"
                                name="sahel_percentage"
                                value={
                                  percentageValues[category.ID]?.sahel ||
                                  currentPercentages[category.ID]?.sahel
                                }
                                onChange={(event) =>
                                  handlePercentageChange(
                                    event,
                                    category.ID,
                                    "sahel"
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div className="input-group text-center">
                              <input
                                disabled
                                className="form-control text-center"
                                type="number"
                                value={
                                  currentPercentages[category.ID]?.sahel || ""
                                }
                              />
                              <span className="input-group-text">%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="text-end">
                    <MainButton
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
              )}
            </form>
          </div>
        </React.Fragment>
      </Frame>
    </React.Fragment>
  );
};

export default AdjustPrice;
