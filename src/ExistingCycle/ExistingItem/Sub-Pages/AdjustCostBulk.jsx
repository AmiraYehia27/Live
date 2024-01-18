import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { read, utils } from "xlsx";
import axios from "axios";
import swal from "sweetalert";
import MainButton from "../../../Components/MainButton/MainButton";
import Frame from "../../../Components/MainFrame/Frame";
import { saveAs } from "file-saver";
const AdjustCostBulk = () => {
  let navigate = useNavigate();
  // This line imports the useNavigate hook from the react-router-dom package and assigns it to the navigate variable.
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //This line retrieves the value of the "userData" key from the browser's sessionStorage object, parses it as a JSON object, and assigns it to the user variable.
  // Set MinDate to Today
  const downloadFile = (event) => {
    event.preventDefault();
    saveAs(`http://192.168.26.15/itemcreation-test/temps/Cost-Temp.xlsx`);
  };

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
  //    States
  const [isLoading, setIsLoading] = useState(false);
  //This line declares a isLoading state variable with an initial value of false, and a setIsLoading function to update its value.
  const [effectDate, setEffectDate] = useState("");
  //This line declares an effectDate state variable with an initial value of an empty string, and a setEffectDate function to update its value.
  const [fileData, setFileData] = useState([]);
  // This line declares a fileData state variable with an initial value of an empty array, and a setFileData function to update its value.
  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = read(data, { sheetRows: 201 });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);

    jsonData.filter((data) => data.itemlookupcode && data.new_cost).length > 0
      ? swal({
          text: "Items uploaded successfully",
          icon: "success",
          button: false,
          timer: 1200,
        })
      : swal({
          title: `Mr/Mrs ${
            JSON.parse(sessionStorage.getItem("userData"))?.name
          }`,
          text: "Please use the correct template!",
          icon: "error",
          button: false,
          timer: 4000,
        });
    setFileData(
      jsonData.filter((data) => data.itemlookupcode && data.new_cost)
    );
  };
  //This line defines an asynchronous handleFile function that takes an event object as a parameter. This function is called when a file is uploaded and it reads and parses the file data into a JSON object, which is then assigned to the fileData state variable using the setFileData function.
  if (fileData.length > 0) {
    fileData.forEach((item) => {
      item[`date`] = effectDate;
      item[`user`] = user.id;
    });
  }
  //This block of code checks if the fileData array is not empty and updates the date and user properties of each object in the array with the effectDate and user.id values, respectively.
  const finalArr = fileData.filter((item) => {
    return item.itemlookupcode != undefined;
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...fileData];
    list[index][name] = value;
    setFileData(list);
  };
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (finalArr.length > 0) {
        const response = await axios.post(
          "http://192.168.26.15/itemcreation-test/api/update-cost",
          finalArr
        );
        if (response.data.message) {
          swal({
            title: "Cost updated successfully",
            icon: "success",
            button: false,
            timer: 1500,
          });
          setTimeout(() => {
            navigate("/mainpage/itemadjust/cost", {
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
  return (
    <Frame headerLabel="Cost Bulk Adjustemnt">
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
            <div
              className="display-6 h3 pt-5 pb-1 text-center text-capitalize text-muted"
              style={{
                fontSize: "1.5rem",
              }}
            >
              <span className="text-success fw-bold me-2">
                {finalArr.length}
              </span>
              <span>Items uploaded</span>
            </div>
          )}
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
                          <div className="col-6">
                            <label
                              htmlFor="itemlookupcode"
                              className=" ms-2 my-1  fs-5 text-dark"
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
                          <div className="col-6">
                            <label
                              htmlFor="newPrice"
                              className="ms-2 my-1 fs-5  text-dark"
                            >
                              Cost <span className="text-danger">*</span>
                            </label>
                            <input
                              required={true}
                              name="new_cost"
                              id="new_cost"
                              step=".01"
                              min={0}
                              type="number"
                              className="form-control "
                              value={item["new_cost"]}
                              onChange={(e) => {
                                handleInputChange(e, index);
                              }}
                            />
                          </div>
                        </React.Fragment>
                      );
                    })
                  : ""}
              </div>
              <>
                <div className="col-lg-8 col-10 p-1 text-lg-center text-start  my-4 alert-success alert">
                  <p className=" my-1 fs-5  text-dark fw-bold">
                    Kindly note that any adjustment will affect only the primary
                    supplier .
                  </p>
                </div>
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

export default AdjustCostBulk;
