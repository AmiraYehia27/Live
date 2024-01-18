import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { read, utils } from "xlsx";
import axios from "axios";
import swal from "sweetalert";
import MainButton from "../../../Components/MainButton/MainButton";
import Frame from "../../../Components/MainFrame/Frame";
import { saveAs } from "file-saver";
const AdjustActiveBulk = () => {
  let navigate = useNavigate();
  //This line imports useNavigate hook from the react-router-dom library and initializes the navigate variable with the value returned by calling the useNavigate hook.

  let user = JSON.parse(sessionStorage.getItem("userData"));
  //This line retrieves the user data from the sessionStorage object and parses it using JSON.parse() method. The parsed data is then assigned to the user variable.

  const downloadFile = (event) => {
    event.preventDefault();
    saveAs(`http://192.168.26.15/itemcreation-test/temps/active-temp.xlsx`);
  };

  // Set MinDate to Today
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  //This code initializes the today variable with the current date, dd with the current date in the month, mm with the current month, and yyyy with the current year. It then checks if the day or month is less than 10 and adds a 0 before the value if it is. Finally, it concatenates the variables to form a date string in the format yyyy-mm-dd.

  //    States
  const [isLoading, setIsLoading] = useState(false);
  const [effectDate, setEffectDate] = useState("");
  const [fileData, setFileData] = useState([]);
  //These lines declare three state variables: isLoading, effectDate, and fileData. isLoading is initialized with false, effectDate with an empty string, and fileData with an empty array. setIsLoading, setEffectDate, and setFileData are functions that are used to update these state variables.
  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = read(data, { sheetRows: 1100 });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);
    setFileData(jsonData);
  };
  //This function is triggered when a file is selected in the input field. It reads the file and converts it to an array buffer. The buffer is then parsed using the read function from the xlsx library. The resulting JSON data is then assigned to the fileData state variable using setFileData.

  if (fileData.length > 0) {
    fileData.forEach((item) => {
      item[`date`] = effectDate;
      item[`user`] = user.id;
    });
  }
  //This code block is executed when the fileData array has items. It iterates through each item in the fileData array and adds the current effectDate and user.id as properties to each item.

  const finalArr = fileData.filter((item) => {
    return item.itemlookupcode != undefined;
  });
  //This code block declares a new variable finalArr and assigns it the result of filtering fileData based on the condition that item.itemlookupcode is not undefined.

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...fileData];
    list[index][name] = value;
    setFileData(list);
  };
  /*
Defining an event handler function handleInputChange that takes two arguments, an event and an index.
Extracting name and value properties from the event target.
Copying the fileData state array into a new array using the spread operator.
Updating the value of the specific property at the given index in the copied array.
Updating the fileData state with the updated array.
   */
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (finalArr.length > 0) {
        const response = await axios.post(
          "http://192.168.26.15/itemcreation-test/api/update-active",
          finalArr
        );
        if (response) {
          swal({
            title: "Status updated successfully",
            icon: "success",
            button: false,
            timer: 1500,
          });
          setTimeout(() => {
            navigate("/mainpage/itemadjust/active", {
              replace: true,
            });
          }, 2000);
        }
      }
      setIsLoading(false);
    } catch (error) {
      swal({
        title: `Ops`,
        text: "An error occurred please refresh the page and try again ",
        icon: "error",
        button: false,
        timer: 1200,
      });
      setIsLoading(false);
    }
  }
  /*
async function formSubmit(e) { - declares an asynchronous function named formSubmit that takes an event object as an argument.

e.preventDefault(); - prevents the default action of the event, which is to submit the form and refresh the page.

setIsLoading(true); - sets the isLoading state to true, indicating that the form is being submitted and the page is loading.

try { - begins a try block for error handling.

if (finalArr.length > 0) { - checks if the finalArr array has at least one element.

const response = await axios.post("http://192.168.26.15/itemcreation-test/api/update-active", finalArr); - sends a POST request to the specified API endpoint with the finalArr array as the request body, and waits for the response.

if (response) { - checks if the response object is truthy, meaning that the request was successful.

swal({ ... }) - shows a SweetAlert modal with a success message.

setTimeout(() => { ... }, 2000); - sets a timeout of 2 seconds before navigating to the /mainpage/itemadjust/active route.

} - closes the if block.

setIsLoading(false); - sets the isLoading state to false, indicating that the form submission is complete and the page is no longer loading.

} catch (error) { - begins a catch block to handle any errors that may occur during the try block.

swal({ ... }) - shows a SweetAlert modal with an error message.

setIsLoading(false); - sets the isLoading state to false, indicating that the form submission is complete and the page is no longer loading.
*/
  return (
    <Frame headerLabel="Active Bulk Adjustemnt">
      <React.Fragment>
        <form
          className="row m-0 p-0 justify-content-evenly  p-3  "
          onSubmit={formSubmit}
        >
          <div className="col-6">
            <input
              type="file"
              className="form-control "
              onChange={(e) => {
                handleFile(e);
              }}
            />
          </div>
          <div className="col-6 row flex-nowrap m-0 p-0 ">
            <span htmlFor="effective_date" className="  fs-5  text-dark col-4">
              Effective Date : <span className="text-danger">*</span>
            </span>
            <input
              required
              min={today}
              onChange={(e) => {
                setEffectDate(e.target.value);
              }}
              name="effective_date"
              id="effective_date"
              type="date"
              className=" col-6 "
            />
          </div>
          <div className="row pt-5">
            <div className="col-12">
              <h4>
                Download the template that should be used if you don't have it
              </h4>
            </div>
            <div className="col-12">
              <button className="btn bt-sm btn-success" onClick={downloadFile}>
                Download
              </button>
            </div>
          </div>
          {finalArr.length > 0 && (
            <>
              <div
                className="row m-0 p-0 justify-content-evenly  border border-3 rounded-3 my-3 p-3 border-success "
                style={{ overflowY: "scroll", maxHeight: "65vh" }}
              >
                {finalArr.length > 0
                  ? finalArr.map((item, index) => {
                      return (
                        <React.Fragment key={index}>
                          <div className="row col-12 m-0 p-0 my-1">
                            {" "}
                            <div className="col-4">
                              <label
                                htmlFor="itemlookupcode"
                                className=" text-dark fw-bolder px-4"
                              >
                                Item Lookup Code
                              </label>
                              <input
                                disabled
                                id="itemlookupcode"
                                name="itemlookupcode"
                                type="text"
                                className="form-control "
                                value={item["itemlookupcode"]}
                              />
                            </div>
                            <div className="col-4">
                              <div className=" position-relative ">
                                <label
                                  htmlFor="Active/Inactive"
                                  className="  text-dark fw-bolder px-4"
                                >
                                  Active/Inactive
                                </label>
                                <select
                                  required
                                  value={item["inactive"]}
                                  onChange={(e) => {
                                    handleInputChange(e, index);
                                  }}
                                  id="Active/Inactive"
                                  name="inactive"
                                  step=".001"
                                  type="number"
                                  className="form-control rounded-3  border-3 border   "
                                >
                                  <option value="1">Inactive </option>
                                  <option value="0">Active</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className=" position-relative ">
                                <label
                                  htmlFor="cannotPlace"
                                  className="  text-dark fw-bolder px-4"
                                >
                                  Cannot be Places in Purchase Order
                                </label>
                                <select
                                  required
                                  value={item["DoNotOrder"]}
                                  onChange={(e) => handleInputChange(e, index)}
                                  id="cannotPlace"
                                  name="DoNotOrder"
                                  className="form-control rounded-3  border-3 border   "
                                >
                                  <option value="0">✘ </option>
                                  <option value="1">✔</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className=" position-relative ">
                                <label
                                  htmlFor="blockSale"
                                  className="  text-dark fw-bolder px-4"
                                >
                                  Block Sale
                                </label>
                                <select
                                  value={item["BlockSale"]}
                                  onChange={(e) => handleInputChange(e, index)}
                                  required
                                  id="blockSale"
                                  name="BlockSale"
                                  className="form-control rounded-3  border-3 border   "
                                >
                                  <option value="0">✘ </option>
                                  <option value="1">✔</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className=" position-relative ">
                                <label
                                  htmlFor="reason"
                                  className="  text-dark fw-bolder px-4"
                                >
                                  Reason{" "}
                                  <span className=" fw-bolder text-danger">
                                    *
                                  </span>
                                </label>
                                <input
                                  value={item["reason"]}
                                  onChange={(e) => handleInputChange(e, index)}
                                  required
                                  name="reason"
                                  type="text"
                                  className="form-control rounded-3  border-3 border   "
                                />
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })
                  : ""}
              </div>
              <>
                <div className="col-12 me-auto  d-flex justify-content-end mt-4 ">
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
              </>
            </>
          )}
        </form>
      </React.Fragment>
    </Frame>
  );
};

export default AdjustActiveBulk;
