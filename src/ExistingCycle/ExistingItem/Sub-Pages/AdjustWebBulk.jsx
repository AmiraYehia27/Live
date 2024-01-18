import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { read, utils } from "xlsx";
import axios from "axios";
import swal from "sweetalert";
import MainButton from "../../../Components/MainButton/MainButton";
import Frame from "../../../Components/MainFrame/Frame";
import { saveAs } from "file-saver";
const AdjustWebBulk = () => {
  let navigate = useNavigate();
  //Declares a variable navigate using the useNavigate hook from the react-router-dom library.
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //Declares a variable user that gets the value of userData from the sessionStorage and parses it as a JSON object.
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
  //    States
  const [isLoading, setIsLoading] = useState(false);
  //Declares two variables isLoading and setIsLoading using the useState hook from React. isLoading initializes with the value false and setIsLoading is used to update the value of isLoading.

  const [effectDate, setEffectDate] = useState("");
  //Declares two variables effectDate and setEffectDate using the useState hook. effectDate initializes with an empty string and setEffectDate is used to update the value of effectDate.

  const [fileData, setFileData] = useState([]);
  //Declares two variables fileData and setFileData using the useState hook. fileData initializes with an empty array and setFileData is used to update the value of fileData.

  const downloadFile = (event) => {
    event.preventDefault();
    saveAs(`http://192.168.26.15/itemcreation-test/temps/web-temp.xlsx`);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = read(data, { sheetRows: 1100 });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);
    setFileData(jsonData);
  };
  /*
   Declares an asynchronous function handleFile that takes an event object e as a parameter.
The function gets the file object from the event object, reads it as an array buffer, and converts it to JSON using the sheet_to_json function from the xlsx library.
The JSON data is then passed to setFileData to update the value of fileData.
   */
  if (fileData.length > 0) {
    fileData.forEach((item) => {
      item[`date`] = effectDate;
      item[`user`] = user.id;
      item[`EnIngredients`] = "";
      item[`EnDesc`] = "";
      item[`sWebName`] = "";
    });
  }
  //If fileData has at least one item, the code iterates through each item and updates its date, user, EnIngredients, EnDesc, and sWebName properties with specific values.

  const finalArr = fileData.filter((item) => {
    return item.itemlookupcode != undefined;
  });
  //Declares a variable finalArr that filters fileData based on whether itemlookupcode property is not undefined.

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
          "http://192.168.26.15/itemcreation-test/api/update-webitem",
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
            navigate("/mainpage/itemadjust/web", {
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

  console.log(finalArr);
  return (
    <Frame headerLabel="Web Bulk Adjustemnt">
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
                                  Web/NonWeb
                                </label>
                                <select
                                  required
                                  value={item["webitem"]}
                                  onChange={(e) => handleInputChange(e, index)}
                                  id="webitem"
                                  name="webitem"
                                  className="form-control  rounded-3  border-3 border   "
                                >
                                  <option value="">
                                    Choose Web Or Non Web{" "}
                                  </option>
                                  <option value="1">Web Item </option>
                                  <option value="0">Non Web Item</option>
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

export default AdjustWebBulk;
