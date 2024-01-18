import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { read, utils } from "xlsx";
import axios from "axios";
import swal from "sweetalert";
import MainButton from "../../../Components/MainButton/MainButton";
import Frame from "../../../Components/MainFrame/Frame";
import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'

const AdjustCustomerId = () => {
  let navigate = useNavigate();
  let user = JSON.parse(sessionStorage.getItem("userData"));
  const downloadFile = (event) => {
    event.preventDefault();
    saveAs(`http://192.168.26.15/itemcreation-test/temps/Customer-Phone.xlsx`);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [failedPhoneNum, setFailedPhoneNum] = useState([])
  const [tier, setTier] = useState("");
  console.log(tier);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    console.log("file", file)
    const data = await file.arrayBuffer();
    console.log('data', data)
    const workbook = read(data);
    console.log("workbook", workbook)
    const sheetName = "sheet";
    const sheetData = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(sheetData);
    console.log('jsonData', jsonData)
    jsonData.map((data) => {
      if (data.phone.length == 13) {
        setFileData((pre) => [...pre, data])
      } else {
        setFailedPhoneNum((pre) => [...pre, data])
      }

    })

  };
  console.log("fileData", fileData);
  console.log('faild', failedPhoneNum);

  useEffect(() => {
    if (fileData.length > 0) {
      fileData.forEach((item) => {
        item.tier = tier;
        item[`user`] = user.id;
        console.log(item)
      });
    }
  }, [tier])
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...fileData];
    list[index][name] = value;
    setFileData(list);
  };
  const finalArr = fileData.filter((item) => {
    return item.phone !== undefined;
  });

  console.log(finalArr);

  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (finalArr.length > 0) {
        const response = await axios.post(
          "http://192.168.26.15/itemcreation-test/api/post-customer",
          finalArr
        );
        if (response.data.message) {
          swal({
            title: "Customer updated successfully",
            icon: "success",
            button: false,
            timer: 1500,
          });
          setTimeout(() => {
            navigate("/mainpage/itemadjust/description", {
              replace: true,
            });
          }, 2000);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      swal({
        title: `Ops`,
        text: "An error occurred please refresh the page and try again ",
        icon: "error",
        button: false,
        timer: 1200,
      });
    }
  }
  //Export failed Cases Function 
  const fileType = "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const fileExtension = '.xlsx';
  const exportFailesCaese = async () => {
    const ws = XLSX.utils.json_to_sheet(failedPhoneNum);
    const wb = { Sheets: { "data": ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, 'failedUploadedNumbers' + fileExtension);

  }

  //Delete Handler 
  const deleteHandler = (i) => {
    console.log('llllllllllllllllllllll');
    let newData = [...fileData];
    console.log("newData", newData)
    let test = newData.filter((data, index) => index != i);
    setFileData(test)
  }

  //Edit Handler 
  const editHandler = (i, value) => {
    console.log(i, value);
    let editObj = { ...fileData[i] };
    editObj.tier = value;
    console.log(editObj)
    let test = [...fileData];
    test.splice(i, 1, editObj)
    console.log(test)
    console.log("newFileData", test);
    setFileData(test)
  }
  const addTierHandler = (e) => {
    setTier(e.target.value)
  }
  return (
    <Frame headerLabel="Customer tier assigning">
      <React.Fragment>
        <form className="row mt-4 bg-white m-2 p-4" onSubmit={formSubmit}>
          <div className="col-6">
            <label htmlFor="customers" className="my-2 d-block">Upload Customers </label>
            <input
              className="w-75"
              id="customers"
              type="file"
              onChange={(e) => {
                handleFile(e);
              }}
            />
          </div>
          <div className="col-6">
            <div className="form-group">
              <label htmlFor="tier" className="my-2">Select Tier</label>
              <select

                className="form-control py-1"
                id="tier"
                name="tier"
                onChange={addTierHandler}
              >
                <option defaultValue className=""></option>
                <option value="1">Silver</option>
                <option value="2">Gold</option>
                <option value="3">VIP</option>
              </select>
            </div>
          </div>
          <div className="row pt-2">
            <div className="col-12">

            </div>
            <div className="row">
              <div className="col-6">
                <button className="border-0 bg-white text-success text-decoration-underline" onClick={downloadFile}>
                  download template from here.
                </button>
              </div>
              <div className="col-6">
                {
                  failedPhoneNum.length > 0 ? <button className="border-0 text-danger fw-bold text-decoration-underline bg-transparent mx-4" onClick={exportFailesCaese}>Export failed cases <i className="fa-solid fa-file-export"></i> </button> : ""
                }
              </div>

            </div>
          </div>

          {fileData.length > 0 && (
            <><table class="table table-hover mt-5">
              <thead className="border-bottom border-3 border-dark fst-italic">
                <tr>
                  <th>{fileData.length}</th>
                  <th>Phone Number</th>
                  <th>Customer Tier</th>
                </tr>

              </thead>
              <tbody>
                {fileData.length > 0
                  ? fileData.map((item, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item.phone}</td>
                        <td><select className="border-0 fs-6 rounded px-5 py-2  shawow" name="tier" id="tier" defaultValue={item.tier && ''} onChange={(e) => { editHandler(index, e.target.value) }}>
                          <option value="1">Silver</option>
                          <option value="2">Gold</option>
                          <option value="3">VIP</option>
                        </select></td>
                        <td><i className="fa-solid fa-trash cursor" onClick={() => { deleteHandler(index) }}></i></td>
                      </tr>
                    );
                  })
                  : ""}
              </tbody>
            </table>

              <>
                <div className="col-12 me-auto  d-flex justify-content-end mt-4 ">
                  <button type="submit" className="btn text-white bg-black shadow "> {isLoading ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Submit")}</button>
                </div>
              </>
            </>
          )}
        </form>

      </React.Fragment>
    </Frame>
  );
};

export default AdjustCustomerId;
