import React, { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../Spinner/Spinner";
import axios from "axios";
import MainButton from "../../Components/MainButton/MainButton";
import Frame from "../../Components/MainFrame/Frame";
import swal from "sweetalert";

const AssortmentUpdate = () => {
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //The JSON.parse method is used to parse the userData string retrieved from sessionStorage into a JavaScript object.
  let { Id } = useParams();
  //The useParams hook is used to extract the Id parameter from the URL, which is used to fetch the product's data from the API endpoint.
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Product Json
  const [costValue, setCostValue] = useState(0);
  const [vatValue, setVatValue] = useState(0);
  const [sellingValue, setSellingValue] = useState(0);
  let costAfterValue = 0;
  let marginValue = 0;
  const [categories, setCategories] = useState([]);
  const [productInfo, setProductInfo] = useState({
    loading: false,
    catLoading: false,
    departments: [],
    suppliers: [],
    errorMessage: "",
    productErrorMessage: "",
  });
  // logs
  const [postLog, setPostLog] = useState({
    lookupcode: Id,
    action: `${user.name} Edited the product: ${Id} after rejection from Assortment Team `,
    user: user.id != null ? user.id : "",
  });
  //  logs end
  const [existProduct, setExistProduct] = useState([
    {
      lookupcode: "",
      ItemType: "",
      description: "",
      SupplierID: "",
      units_cartoon: "",
      ShelfLife: "",
      Cost: "",
      salestax: "",
      CostTax: costAfterValue > 0 ? costAfterValue : "",
      RetailPrice: "",
      Margin: marginValue,
      group: "",
      StorageCondition: "",
      country: "",
      DepartmentID: "",
      CategoryID: "",
      LaunchingDate: "",
      UnitOfMeasure: "",
      pack_weight: "",
      units_pack: "",
      user: user.id != null ? user.id : "",
      created_at: "",
      updated_at: "",
      product_flow: "",
      seasonal_end: "",
      seasonal_start: "",
      ugly_spoint: "",
      shelf_space: "",
      pallet_lsize: "",
      pallet_size: "",
      r_shelflife: "",
      spoiling_time: "",
      minimum_delivery: "",
      batch_size: "",
      warehouse_type: "",
      primary_product: "",
      private_brand: "",
      brand_type: "",
      online: "",
      Warehouse: ``,
      Zamalek: ``,
      GuizeraPlaza: ``,
      Bouri: ``,
      CityStars: ``,
      MaadiDegla: ``,
      Dokki: ``,
      Designia: ``,
      WaterWay: ``,
      Stella: ``,
      KatameyaHeights: ``,
      Maadi9: ``,
      Sodic: ``,
      ElSafwa: ``,
      MaadiHub: ``,
      ElTagamoaHub: ``,
      Arkan: ``,
      ElGouna: ``,
      AlmazaBay: ``,
      UptownCairo: ``,
      Dunes: ``,
      english_content: false,
      arabic_content: false,
      pAccepted: false,
      pRejected: false,
      reason: "",
      EnIngredients: "",
      EnWebDes: "",
      sWebName: "",
      InventoryBypass: "",
    },
  ]);
  if (costValue > 0 && vatValue >= 0) {
    costAfterValue = (costValue * vatValue) / 100;
    costAfterValue = costAfterValue += Number(costValue);
    existProduct[0].CostTax = costAfterValue.toFixed(2);
  }
  if (sellingValue > 0 && costAfterValue > 0) {
    let differnce = sellingValue - costAfterValue;
    let Division = differnce / sellingValue;
    marginValue = Division * 100;
    marginValue = marginValue.toFixed(2) + "%";
    existProduct[0].Margin = marginValue;
  }

  // Calling APIs of departments and supplier

  const getDepartment = useCallback(async () => {
    try {
      setProductInfo((p) => {
        return { ...p, loading: true };
      });
      let response = await axios.get(
        "http://192.168.26.15/itemcreation-test/api/departments"
      );
      let responseSup = await axios.get(
        "http://192.168.26.15/itemcreation-test/api/supplier"
      );
      let responseProduct = await axios.get(
        `http://192.168.26.15/itemcreation-test/api/show-product/${Id}`
      );
      setExistProduct(responseProduct.data.data);
      setCostValue(responseProduct.data.data[0].Cost);
      setVatValue(responseProduct.data.data[0].salestax);
      setSellingValue(responseProduct.data.data[0].RetailPrice);
      setProductInfo((p) => {
        return {
          ...p,
          loading: false,
          departments: response.data.departments,
          suppliers: responseSup.data.suppliers,
        };
      });
    } catch (error) {
      setProductInfo((p) => {
        return { ...p, loading: false, errorMessage: error.message };
      });
    }
  }, [Id]);

  const getCategories = useCallback(async () => {
    try {
      let response = await axios.get(
        "http://192.168.26.15/itemcreation-test/api/category"
      );
      setCategories(response.data.categories);
    } catch (error) {}
  }, []);
  useEffect(() => {
    getDepartment();
    getCategories();
  }, [getCategories, getDepartment]);

  // Calling API of Category

  // Adding values to Assortment section

  // End of it
  //    Adding values to assortment of exist product
  const assortmentAutoClick = () => {
    let list = structuredClone(existProduct);
    list.forEach((item) => {
      return (
        (item.Warehouse = "AUTO"),
        (item.Zamalek = "AUTO"),
        (item.GuizeraPlaza = "AUTO"),
        (item.Bouri = "AUTO"),
        (item.CityStars = "AUTO"),
        (item.MaadiDegla = "AUTO"),
        (item.Dokki = "AUTO"),
        (item.Designia = "AUTO"),
        (item.WaterWay = "AUTO"),
        (item.Stella = "AUTO"),
        (item.KatameyaHeights = "AUTO"),
        (item.Maadi9 = "AUTO"),
        (item.Sodic = "AUTO"),
        (item.ElSafwa = "AUTO"),
        (item.MaadiHub = "AUTO"),
        (item.ElTagamoaHub = "AUTO"),
        (item.Arkan = "AUTO"),
        (item.ElGouna = "AUTO"),
        (item.AlmazaBay = "AUTO"),
        (item.UptownCairo = "AUTO"),
        (item.Dunes = "AUTO")
      );
    });
    setExistProduct(list);
  };
  const assortmentOutClick = () => {
    let list = structuredClone(existProduct);
    list.forEach((item) => {
      return (
        (item.Warehouse = "OUT"),
        (item.Zamalek = "OUT"),
        (item.GuizeraPlaza = "OUT"),
        (item.Bouri = "OUT"),
        (item.CityStars = "OUT"),
        (item.MaadiDegla = "OUT"),
        (item.Dokki = "OUT"),
        (item.Designia = "OUT"),
        (item.WaterWay = "OUT"),
        (item.Stella = "OUT"),
        (item.KatameyaHeights = "OUT"),
        (item.Maadi9 = "OUT"),
        (item.Sodic = "OUT"),
        (item.ElSafwa = "OUT"),
        (item.MaadiHub = "OUT"),
        (item.ElTagamoaHub = "OUT"),
        (item.Arkan = "OUT"),
        (item.ElGouna = "OUT"),
        (item.AlmazaBay = "OUT"),
        (item.UptownCairo = "OUT"),
        (item.Dunes = "OUT")
      );
    });
    setExistProduct(list);
  };
  const assortmentSpotClick = () => {
    let list = structuredClone(existProduct);
    list.forEach((item) => {
      return (
        (item.Warehouse = "SPOT"),
        (item.Zamalek = "SPOT"),
        (item.GuizeraPlaza = "SPOT"),
        (item.Bouri = "SPOT"),
        (item.CityStars = "SPOT"),
        (item.MaadiDegla = "SPOT"),
        (item.Dokki = "SPOT"),
        (item.Designia = "SPOT"),
        (item.WaterWay = "SPOT"),
        (item.Stella = "SPOT"),
        (item.KatameyaHeights = "SPOT"),
        (item.Maadi9 = "SPOT"),
        (item.Sodic = "SPOT"),
        (item.ElSafwa = "SPOT"),
        (item.MaadiHub = "SPOT"),
        (item.ElTagamoaHub = "SPOT"),
        (item.Arkan = "SPOT"),
        (item.ElGouna = "SPOT"),
        (item.AlmazaBay = "SPOT"),
        (item.UptownCairo = "SPOT"),
        (item.Dunes = "SPOT")
      );
    });
    setExistProduct(list);
  };
  const assortmentZeroStockClick = () => {
    let list = structuredClone(existProduct);
    list.forEach((item) => {
      return (
        (item.Warehouse = "ZERO-STOCK"),
        (item.Zamalek = "ZERO-STOCK"),
        (item.GuizeraPlaza = "ZERO-STOCK"),
        (item.Bouri = "ZERO-STOCK"),
        (item.CityStars = "ZERO-STOCK"),
        (item.MaadiDegla = "ZERO-STOCK"),
        (item.Dokki = "ZERO-STOCK"),
        (item.Designia = "ZERO-STOCK"),
        (item.WaterWay = "ZERO-STOCK"),
        (item.Stella = "ZERO-STOCK"),
        (item.KatameyaHeights = "ZERO-STOCK"),
        (item.Maadi9 = "ZERO-STOCK"),
        (item.Sodic = "ZERO-STOCK"),
        (item.ElSafwa = "ZERO-STOCK"),
        (item.MaadiHub = "ZERO-STOCK"),
        (item.ElTagamoaHub = "ZERO-STOCK"),
        (item.Arkan = "ZERO-STOCK"),
        (item.ElGouna = "ZERO-STOCK"),
        (item.AlmazaBay = "ZERO-STOCK"),
        (item.UptownCairo = "ZERO-STOCK"),
        (item.Dunes = "ZERO-STOCK")
      );
    });
    setExistProduct(list);
  };
  const assortmentFcstClick = () => {
    let list = structuredClone(existProduct);
    list.forEach((item) => {
      return (
        (item.Warehouse = "FCST"),
        (item.Zamalek = "FCST"),
        (item.GuizeraPlaza = "FCST"),
        (item.Bouri = "FCST"),
        (item.CityStars = "FCST"),
        (item.MaadiDegla = "FCST"),
        (item.Dokki = "FCST"),
        (item.Designia = "FCST"),
        (item.WaterWay = "FCST"),
        (item.Stella = "FCST"),
        (item.KatameyaHeights = "FCST"),
        (item.Maadi9 = "FCST"),
        (item.Sodic = "FCST"),
        (item.ElSafwa = "FCST"),
        (item.MaadiHub = "FCST"),
        (item.ElTagamoaHub = "FCST"),
        (item.Arkan = "FCST"),
        (item.ElGouna = "FCST"),
        (item.AlmazaBay = "FCST"),
        (item.UptownCairo = "FCST"),
        (item.Dunes = "FCST")
      );
    });
    setExistProduct(list);
  };
  // end of it
  // Submit the product
  if (existProduct[0]) {
    existProduct[0].publish = 0;
  }
  async function formSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/planning",
        existProduct[0]
      );
      if (response) {
        let responseLog = await axios.post(
          "http://192.168.26.15/itemcreation-test/api/log",
          postLog
        );
        swal({
          title: `Hi ${user.name}`,
          text: "Product has been Updated  ",
          icon: "success",
          button: false,
          timer: 1800,
        });
        setIsLoading(false);
        if (user.role_id == "2") {
          setTimeout(() => {
            navigate("/mainpage/content/Aqueue", { replace: true });
          }, 2000);
        } else if (user.role_id == "5") {
          setTimeout(() => {
            navigate(`/mainpage/content/pqueue/${Id}`, { replace: true });
          }, 2000);
        }
      }
    } catch (error) {
      setIsLoading(false);
      swal({
        title: `Hi ${user.name}`,
        text: "An error occurred please refresh the page and try again  ",
        button: false,
        timer: 1500,
        icon: "error",
      });
    }
  }
  // Get the User data on change

  // Current values change
  const handleNewInputChange = (e, index) => {
    // e.target.value = e.target.value.replace(/[’/`~!#*$@_%+=.^&(){}[\]|;:”<>?\\]/g, "");
    const { name, value } = e.target;
    const list = [...existProduct];
    list[index][name] = value;
    setExistProduct(list);
  };
  existProduct.length > 0 &&
    existProduct.forEach((item) => {
      item.pAccepted = 0;
      item.pRejected = 0;
      item.reason = "";
    });
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

  // Destructing props

  const { suppliers, departments, loading, productErrorMessage } = productInfo;

  return (
    <React.Fragment>
      <Frame headerLabel="Product Update">
        {" "}
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {existProduct.length > 0 &&
              existProduct.map((item, index) => {
                return (
                  <form key={index} onSubmit={formSubmit}>
                    {" "}
                    <div
                      className="row justify-content-evenly  rounded-3 row-shadow g-3 border border-color  mt-5 p-4 my-3"
                      style={{
                        overflowX: "hidden",
                        overflowY: "scroll",
                      }}
                    >
                      <div className="col-12 text-center mb-3">
                        <h1 className="text-shadow fw-bolder ">
                          Please Enter All Data
                        </h1>
                      </div>
                      <div className="col-6">
                        <div className=" position-relative ">
                          <label
                            htmlFor="ProductNumber"
                            className=" text-dark fw-bolder px-4"
                          >
                            Item Lookup Code{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.lookupcode || ""}
                            readOnly
                            id="ProductNumber"
                            name="lookupcode"
                            type="text"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className=" position-relative ">
                          <label
                            htmlFor="rms_desc"
                            className=" text-dark fw-bolder px-4"
                          >
                            RMS Description{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={
                              (item.description.length <= 30 &&
                                item.description) ||
                              ""
                            }
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            maxLength={30}
                            id="rms_desc"
                            name="description"
                            type="text"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="supplier"
                            className=" text-dark fw-bolder px-4"
                          >
                            Supplier{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={item.SupplierID || ""}
                            id="supplier"
                            name="SupplierID"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                          >
                            {suppliers.length > 0 &&
                              suppliers.map((supply) => {
                                return (
                                  <option
                                    key={supply.ID}
                                    name="supplier"
                                    value={supply.ID || ""}
                                  >
                                    {supply.SupplierName}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="u_c"
                            className=" text-dark fw-bolder px-4"
                          >
                            Units/Carton
                          </label>
                          <input
                            value={item.units_cartoon || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="u_c"
                            name="units_cartoon"
                            type="number"
                            required
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="s_life"
                            className=" text-dark fw-bolder px-4"
                          >
                            Shelf Life(Days){" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.ShelfLife || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="s_life"
                            name="ShelfLife"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="Cost"
                            className=" text-dark fw-bolder px-4"
                          >
                            Cost(without Tax){" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.Cost || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                              setCostValue(e.target.value);
                            }}
                            id="Cost"
                            name="Cost"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="tax"
                            className=" text-dark fw-bolder px-4"
                          >
                            VAT{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={Number(item.salestax) || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                              setVatValue(e.target.value);
                            }}
                            id="tax"
                            name="salestax"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value="0">No Tax</option>
                            <option value="10">Sales Tax 10%</option>
                            <option value="5">Sales Tax 5%</option>
                            <option value="25">Sales Tax 25%</option>
                            <option value="0.5">Sales Tax 0.5%</option>
                            <option value="13">Sales Tax 13%</option>
                            <option value="14.59">Sales Tax 14.59%</option>
                            <option value="14">Sales Tax 14%</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="cost_tax"
                            className=" text-dark fw-bolder px-4"
                          >
                            Cost (with Tax){" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.CostTax || ""}
                            // onChange={(e) => {
                            //    handleNewInputChange(e, index);
                            // }}
                            readOnly
                            id="cost_tax"
                            name="CostTax"
                            type="text"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="price"
                            className=" text-dark fw-bolder px-4"
                          >
                            Selling Price (with Tax){" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.RetailPrice || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                              setSellingValue(e.target.value);
                            }}
                            id="price"
                            name="RetailPrice"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="margin_percent"
                            className=" text-dark fw-bolder px-4"
                          >
                            Margin Percentage{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.Margin || ""}
                            readOnly
                            id="margin_percent"
                            name="Margin"
                            type="text"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="counter"
                            className=" text-dark fw-bolder px-4"
                          >
                            Product Group{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={item.group || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="counter"
                            name="group"
                            type="text"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value=""></option>
                            <option value="Butchery">Butchery</option>
                            <option value="Cheese&amp;Deli">
                              Cheese&amp;Deli
                            </option>
                            <option value="F&amp;V">F&amp;V</option>
                            <option value="Grocery">Grocery</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="StorageCondition"
                            className=" text-dark fw-bolder px-4"
                          >
                            Storing Condition{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={item.StorageCondition || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="StorageCondition"
                            name="StorageCondition"
                            autoComplete="off"
                            type="text"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value="">Select Condition</option>
                            <option value="Ambient">Ambient</option>
                            <option value="Chilled 0-4°C">Chilled 0-4°C</option>
                            <option value="Chilled 4-7°C">Chilled 4-7°C</option>
                            <option value="Cool &amp; Dry">
                              Cool &amp; Dry
                            </option>
                            <option value="F&amp;V Chilled 4-7°C">
                              F&amp;V Chilled 4-7°C
                            </option>
                            <option value="F&amp;V Cool">F&amp;V Cool</option>
                            <option value="Fresh Bake">Fresh Bake</option>
                            <option value="Fresh Hot">Fresh Hot</option>
                            <option value="Frozen -18°C">Frozen -18°C</option>
                            <option value="Frozen -25°C">Frozen -25°C</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="country"
                            className=" text-dark fw-bolder px-4"
                          >
                            Country Of Origin{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={item.country || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="country"
                            name="country"
                            type="text"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value="">Select Country</option>
                            <option value="Afghanistan">Afghanistan</option>
                            <option value="Albania">Albania</option>
                            <option value="Algeria">Algeria</option>
                            <option value="American Samoa">
                              American Samoa
                            </option>
                            <option value="Andorra">Andorra</option>
                            <option value="Angola">Angola</option>
                            <option value="Anguilla">Anguilla</option>
                            <option value="Antartica">Antarctica</option>
                            <option value="Antigua and Barbuda">
                              Antigua and Barbuda
                            </option>
                            <option value="Argentina">Argentina</option>
                            <option value="Armenia">Armenia</option>
                            <option value="Aruba">Aruba</option>
                            <option value="Australia">Australia</option>
                            <option value="Austria">Austria</option>
                            <option value="Azerbaijan">Azerbaijan</option>
                            <option value="Bahamas">Bahamas</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Barbados">Barbados</option>
                            <option value="Belarus">Belarus</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Belize">Belize</option>
                            <option value="Benin">Benin</option>
                            <option value="Bermuda">Bermuda</option>
                            <option value="Bhutan">Bhutan</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Bosnia and Herzegowina">
                              Bosnia and Herzegowina
                            </option>
                            <option value="Botswana">Botswana</option>
                            <option value="Bouvet Island">Bouvet Island</option>
                            <option value="Brazil">Brazil</option>
                            <option value="British Indian Ocean Territory">
                              British Indian Ocean Territory
                            </option>
                            <option value="Brunei Darussalam">
                              Brunei Darussalam
                            </option>
                            <option value="Bulgaria">Bulgaria</option>
                            <option value="Burkina Faso">Burkina Faso</option>
                            <option value="Burundi">Burundi</option>
                            <option value="Cambodia">Cambodia</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Canada">Canada</option>
                            <option value="Cape Verde">Cape Verde</option>
                            <option value="Cayman Islands">
                              Cayman Islands
                            </option>
                            <option value="Central African Republic">
                              Central African Republic
                            </option>
                            <option value="Chad">Chad</option>
                            <option value="Chile">Chile</option>
                            <option value="China">China</option>
                            <option value="Christmas Island">
                              Christmas Island
                            </option>
                            <option value="Cocos Islands">
                              Cocos (Keeling) Islands
                            </option>
                            <option value="Colombia">Colombia</option>
                            <option value="Comoros">Comoros</option>
                            <option value="Congo">Congo</option>
                            <option value="Congo">
                              Congo, the Democratic Republic of the
                            </option>
                            <option value="Cook Islands">Cook Islands</option>
                            <option value="Costa Rica">Costa Rica</option>
                            <option value="Cota D'Ivoire">Cote d'Ivoire</option>
                            <option value="Croatia">Croatia (Hrvatska)</option>
                            <option value="Cuba">Cuba</option>
                            <option value="Cyprus">Cyprus</option>
                            <option value="Czech Republic">
                              Czech Republic
                            </option>
                            <option value="Denmark">Denmark</option>
                            <option value="Djibouti">Djibouti</option>
                            <option value="Dominica">Dominica</option>
                            <option value="Dominican Republic">
                              Dominican Republic
                            </option>
                            <option value="East Timor">East Timor</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Egypt">Egypt</option>
                            <option value="El Salvador">El Salvador</option>
                            <option value="Equatorial Guinea">
                              Equatorial Guinea
                            </option>
                            <option value="Eritrea">Eritrea</option>
                            <option value="Estonia">Estonia</option>
                            <option value="Ethiopia">Ethiopia</option>
                            <option value="Falkland Islands">
                              Falkland Islands (Malvinas)
                            </option>
                            <option value="Faroe Islands">Faroe Islands</option>
                            <option value="Fiji">Fiji</option>
                            <option value="Finland">Finland</option>
                            <option value="France">France</option>
                            <option value="France Metropolitan">
                              France, Metropolitan
                            </option>
                            <option value="French Guiana">French Guiana</option>
                            <option value="French Polynesia">
                              French Polynesia
                            </option>
                            <option value="French Southern Territories">
                              French Southern Territories
                            </option>
                            <option value="Gabon">Gabon</option>
                            <option value="Gambia">Gambia</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Germany">Germany</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Gibraltar">Gibraltar</option>
                            <option value="Greece">Greece</option>
                            <option value="Greenland">Greenland</option>
                            <option value="Grenada">Grenada</option>
                            <option value="Guadeloupe">Guadeloupe</option>
                            <option value="Guam">Guam</option>
                            <option value="Guatemala">Guatemala</option>
                            <option value="Guinea">Guinea</option>
                            <option value="Guinea-Bissau">Guinea-Bissau</option>
                            <option value="Guyana">Guyana</option>
                            <option value="Haiti">Haiti</option>
                            <option value="Heard and McDonald Islands">
                              Heard and Mc Donald Islands
                            </option>
                            <option value="Holy See">
                              Holy See (Vatican City State)
                            </option>
                            <option value="Honduras">Honduras</option>
                            <option value="Hong Kong">Hong Kong</option>
                            <option value="Hungary">Hungary</option>
                            <option value="Iceland">Iceland</option>
                            <option value="India">India</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Iran">
                              Iran (Islamic Republic of)
                            </option>
                            <option value="Iraq">Iraq</option>
                            <option value="Ireland">Ireland</option>
                            <option value="Israel">Israel</option>
                            <option value="Italy">Italy</option>
                            <option value="Jamaica">Jamaica</option>
                            <option value="Japan">Japan</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Kazakhstan">Kazakhstan</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Kiribati">Kiribati</option>
                            <option value="Democratic People's Republic of Korea">
                              Korea, Democratic People's Republic of
                            </option>
                            <option value="Korea">Korea, Republic of</option>
                            <option value="Kuwait">Kuwait</option>
                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                            <option value="Lao">
                              Lao People's Democratic Republic
                            </option>
                            <option value="Latvia">Latvia</option>
                            <option value="Lebanon">Lebanon</option>
                            <option value="Lesotho">Lesotho</option>
                            <option value="Liberia">Liberia</option>
                            <option value="Libyan Arab Jamahiriya">
                              Libyan Arab Jamahiriya
                            </option>
                            <option value="Liechtenstein">Liechtenstein</option>
                            <option value="Lithuania">Lithuania</option>
                            <option value="Luxembourg">Luxembourg</option>
                            <option value="Macau">Macau</option>
                            <option value="Macedonia">
                              Macedonia, The Former Yugoslav Republic of
                            </option>
                            <option value="Madagascar">Madagascar</option>
                            <option value="Malawi">Malawi</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Maldives">Maldives</option>
                            <option value="Mali">Mali</option>
                            <option value="Malta">Malta</option>
                            <option value="Marshall Islands">
                              Marshall Islands
                            </option>
                            <option value="Martinique">Martinique</option>
                            <option value="Mauritania">Mauritania</option>
                            <option value="Mauritius">Mauritius</option>
                            <option value="Mayotte">Mayotte</option>
                            <option value="Mexico">Mexico</option>
                            <option value="Micronesia">
                              Micronesia, Federated States of
                            </option>
                            <option value="Moldova">
                              Moldova, Republic of
                            </option>
                            <option value="Monaco">Monaco</option>
                            <option value="Mongolia">Mongolia</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Morocco">Morocco</option>
                            <option value="Mozambique">Mozambique</option>
                            <option value="Myanmar">Myanmar</option>
                            <option value="Namibia">Namibia</option>
                            <option value="Nauru">Nauru</option>
                            <option value="Nepal">Nepal</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="Netherlands Antilles">
                              Netherlands Antilles
                            </option>
                            <option value="New Caledonia">New Caledonia</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="Nicaragua">Nicaragua</option>
                            <option value="Niger">Niger</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Niue">Niue</option>
                            <option value="Norfolk Island">
                              Norfolk Island
                            </option>
                            <option value="Northern Mariana Islands">
                              Northern Mariana Islands
                            </option>
                            <option value="Norway">Norway</option>
                            <option value="Oman">Oman</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="Palau">Palau</option>
                            <option value="Panama">Panama</option>
                            <option value="Papua New Guinea">
                              Papua New Guinea
                            </option>
                            <option value="Paraguay">Paraguay</option>
                            <option value="Peru">Peru</option>
                            <option value="Philippines">Philippines</option>
                            <option value="Pitcairn">Pitcairn</option>
                            <option value="Poland">Poland</option>
                            <option value="Portugal">Portugal</option>
                            <option value="Puerto Rico">Puerto Rico</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Reunion">Reunion</option>
                            <option value="Romania">Romania</option>
                            <option value="Russia">Russian Federation</option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="Saint Kitts and Nevis">
                              Saint Kitts and Nevis
                            </option>
                            <option value="Saint LUCIA">Saint LUCIA</option>
                            <option value="Saint Vincent">
                              Saint Vincent and the Grenadines
                            </option>
                            <option value="Samoa">Samoa</option>
                            <option value="San Marino">San Marino</option>
                            <option value="Sao Tome and Principe">
                              Sao Tome and Principe
                            </option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="Senegal">Senegal</option>
                            <option value="Seychelles">Seychelles</option>
                            <option value="Sierra">Sierra Leone</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Slovakia">
                              Slovakia (Slovak Republic)
                            </option>
                            <option value="Slovenia">Slovenia</option>
                            <option value="Solomon Islands">
                              Solomon Islands
                            </option>
                            <option value="Somalia">Somalia</option>
                            <option value="South Africa">South Africa</option>
                            <option value="South Georgia">
                              South Georgia and the South Sandwich Islands
                            </option>
                            <option value="Span">Spain</option>
                            <option value="SriLanka">Sri Lanka</option>
                            <option value="St. Helena">St. Helena</option>
                            <option value="St. Pierre and Miguelon">
                              St. Pierre and Miquelon
                            </option>
                            <option value="Sudan">Sudan</option>
                            <option value="Suriname">Suriname</option>
                            <option value="Svalbard">
                              Svalbard and Jan Mayen Islands
                            </option>
                            <option value="Swaziland">Swaziland</option>
                            <option value="Sweden">Sweden</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="Syria">Syrian Arab Republic</option>
                            <option value="Taiwan">
                              Taiwan, Province of China
                            </option>
                            <option value="Tajikistan">Tajikistan</option>
                            <option value="Tanzania">
                              Tanzania, United Republic of
                            </option>
                            <option value="Thailand">Thailand</option>
                            <option value="Togo">Togo</option>
                            <option value="Tokelau">Tokelau</option>
                            <option value="Tonga">Tonga</option>
                            <option value="Trinidad and Tobago">
                              Trinidad and Tobago
                            </option>
                            <option value="Tunisia">Tunisia</option>
                            <option value="Turkey">Turkey</option>
                            <option value="Turkmenistan">Turkmenistan</option>
                            <option value="Turks and Caicos">
                              Turks and Caicos Islands
                            </option>
                            <option value="Tuvalu">Tuvalu</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Ukraine">Ukraine</option>
                            <option value="United Arab Emirates">
                              United Arab Emirates
                            </option>
                            <option value="United Kingdom">
                              United Kingdom
                            </option>
                            <option value="United States">United States</option>
                            <option value="United States Minor Outlying Islands">
                              United States Minor Outlying Islands
                            </option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="Uzbekistan">Uzbekistan</option>
                            <option value="Vanuatu">Vanuatu</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Vietnam">Viet Nam</option>
                            <option value="Virgin Islands (British)">
                              Virgin Islands (British)
                            </option>
                            <option value="Virgin Islands (U.S)">
                              Virgin Islands (U.S.)
                            </option>
                            <option value="Wallis and Futana Islands">
                              Wallis and Futuna Islands
                            </option>
                            <option value="Western Sahara">
                              Western Sahara
                            </option>
                            <option value="Yemen">Yemen</option>
                            <option value="Yugoslavia">Yugoslavia</option>
                            <option value="Zambia">Zambia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="rmsDepa"
                            className=" text-dark fw-bolder px-4"
                          >
                            RMS Department
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            id="rmsDepa"
                            value={item.DepartmentID || ""}
                            name="DepartmentID"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                          >
                            <option value="">Select Department</option>
                            {departments.length > 0 &&
                              departments.map((department) => {
                                return (
                                  <option
                                    key={department.ID}
                                    name="DepartmentID"
                                    value={department.ID || ""}
                                  >
                                    {department.Name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="rmsCat"
                            className=" text-dark fw-bolder px-4"
                          >
                            RMS Category{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            id="rmsCat"
                            value={item.CategoryID || ""}
                            name="CategoryID"
                            className="form-control  rounded-3  border-3 border   "
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                          >
                            <option>Select Category</option>
                            {categories.map((category, catIndex) => {
                              return (
                                category.DepartmentId == item.DepartmentID && (
                                  <option
                                    value={category.ID || ""}
                                    key={catIndex}
                                  >
                                    {category.Name}
                                  </option>
                                )
                              );
                            })}
                          </select>
                          {/* <select
                                          id="rmsCat"
                                          name="CategoryID"
                                          type="number"
                                          className="form-control rounded-3  border-3 border   "
                                          onChange={(e) => {
                                             handleNewInputChange(e, index);
                                          }}
                                          value={item.CategoryID}>
                                          {categories.length > 0 &&
                                             categories.map((category, indexs) => {
                                                return category.DepartmentId == item.DepartmentID && <option key={indexs}>{category.Name}</option>;
                                             })}
                                       </select> */}
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="introductionDate"
                            className=" text-dark fw-bolder px-4"
                          >
                            Introduction Date{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.LaunchingDate || ""}
                            type="date"
                            id="introductionDate"
                            name="LaunchingDate"
                            disabled
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="u_m"
                            className=" text-dark fw-bolder px-4"
                          >
                            Inventory Unit{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={item.UnitOfMeasure || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="u_m"
                            name="UnitOfMeasure"
                            type="text"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value="">Select Unit</option>
                            <option value="KG">KG</option>
                            <option value="PC">Piece</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="pack_weight"
                            className=" text-dark fw-bolder px-4"
                          >
                            Pack Weight{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.pack_weight || ""}
                            min="0"
                            step="0.01"
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="pack_weight"
                            name="pack_weight"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="u_p"
                            className=" text-dark fw-bolder px-4"
                          >
                            Units/Package{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.units_pack || ""}
                            min="0"
                            step="0.01"
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="u_p"
                            name="units_pack"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="u_m"
                            className=" text-dark fw-bolder px-4"
                          >
                            Item Type{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={item.ItemType || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="type"
                            name="ItemType"
                            type="text"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value="0">Standard</option>
                            <option value="6">POS Weighted</option>
                            <option value="3">Kit</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="relex"
                            className=" text-dark fw-bolder px-4"
                          >
                            RELEX Item{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={item.relex || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="relex"
                            name="relex"
                            type="text"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value="1">Yes</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="primary_product"
                            className=" text-dark fw-bolder px-4"
                          >
                            Primary Product{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={item.primary_product || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="primary_product"
                            name="primary_product"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value=""></option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="private_brand"
                            className=" text-dark fw-bolder px-4"
                          >
                            Private Brand{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={item.private_brand || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="private_brand"
                            name="private_brand"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value=""></option>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="brand_type"
                            className=" text-dark fw-bolder px-4"
                          >
                            Brand Type{" "}
                            <span className=" fw-bouct flowlder text-danger">
                              *
                            </span>
                          </label>
                          <select
                            value={item.brand_type || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="brand_type"
                            name="brand_type"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value=""></option>
                            <option value="0">Local</option>
                            <option value="1">International</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="product_flow"
                            className=" text-dark fw-bolder px-4"
                          >
                            Product Flow{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={item.product_flow || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="product_flow"
                            name="product_flow"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value=""></option>
                            <option value="0">Direct</option>
                            <option value="1">Indirect</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="warehouse_type"
                            className=" text-dark fw-bolder px-4"
                          >
                            Warehouse Type{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            value={item.warehouse_type || ""}
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="warehouse_type"
                            name="warehouse_type"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value="0">Direct</option>
                            <option value="1">Dry</option>
                            <option value="2">Frozen</option>
                            <option value="3">Non-Food</option>
                            <option value="4">Consumables</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="batch_size"
                            className=" text-dark fw-bolder px-4"
                          >
                            Batch Size{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.batch_size || ""}
                            min="0"
                            step="1"
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="batch_size"
                            name="batch_size"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="min_order"
                            className=" text-dark fw-bolder px-4"
                          >
                            Minimum Delivery{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.minimum_delivery || ""}
                            min="0"
                            step="1"
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="min_order"
                            name="minimum_delivery"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="s_time"
                            className=" text-dark fw-bolder px-4"
                          >
                            Spoiling Time (Days){" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.spoiling_time || ""}
                            min="0"
                            step="1"
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="s_time"
                            name="spoiling_time"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="r_slife"
                            className=" text-dark fw-bolder px-4"
                          >
                            Remaining Shelf life{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <input
                            value={item.r_shelflife || ""}
                            min="0"
                            step="1"
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="r_slife"
                            name="r_shelflife"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="pallet_size"
                            className=" text-dark fw-bolder px-4"
                          >
                            Pallet Size
                          </label>
                          <input
                            value={item.pallet_size || ""}
                            min="0"
                            step="1"
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="pallet_size"
                            name="pallet_size"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="pallet_layer_size"
                            className=" text-dark fw-bolder px-4"
                          >
                            Pallet Layer Size
                          </label>
                          <input
                            value={item.pallet_lsize || ""}
                            min="0"
                            step="1"
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="pallet_layer_size"
                            name="pallet_lsize"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="s_space"
                            className=" text-dark fw-bolder px-4"
                          >
                            Shelf Space
                          </label>
                          <input
                            value={item.shelf_space || ""}
                            min="0"
                            step="1"
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="s_space"
                            name="shelf_space"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="u_spoint"
                            className=" text-dark fw-bolder px-4"
                          >
                            Ugly Shelf Point
                          </label>
                          <input
                            value={item.ugly_spoint || ""}
                            min="0"
                            step="1"
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            id="u_spoint"
                            name="ugly_spoint"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>

                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="s_date"
                            className=" text-dark fw-bolder px-4"
                          >
                            Seasonal Start Date
                          </label>
                          <input
                            value={item.seasonal_start || ""}
                            type="date"
                            id="s_date"
                            name="seasonal_start"
                            disabled
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="e_date"
                            className=" text-dark fw-bolder px-4"
                          >
                            Seasonal End Date
                          </label>
                          <input
                            value={item.seasonal_end || ""}
                            type="date"
                            id="e_date"
                            name="seasonal_end"
                            onChange={(e) => {
                              handleNewInputChange(e, index);
                            }}
                            disabled
                            className="form-control  rounded-3  border-3 border   "
                          />
                        </div>
                      </div>
                      <div
                        className="w-100 my-5 border "
                        style={{
                          height: "5px",
                          backgroundColor: "black",
                        }}
                      ></div>
                      <div className="row g-3">
                        <div className="col-12 my-3 p-4 text-dark text-center">
                          <h2>Assortment Class</h2>
                          <div
                            className="w-25 mt-2 mb-5 m-auto"
                            style={{
                              height: "5px",
                              backgroundColor: "black",
                            }}
                          ></div>
                        </div>
                        <div className="col-12 my-1 p-4 row justify-content-between g-3">
                          <div className="col-12">
                            <h4>
                              Check any of below buttons to submit Assortment
                              values
                            </h4>
                          </div>
                          <div className="col position-relative">
                            <button
                              className="btn btn-success"
                              type="button"
                              onClick={() => {
                                assortmentAutoClick();
                              }}
                            >
                              AUTO
                            </button>
                          </div>
                          <div className="col position-relative">
                            <button
                              className="btn btn-danger"
                              type="button"
                              onClick={() => {
                                assortmentOutClick();
                              }}
                            >
                              OUT
                            </button>
                          </div>
                          <div className="col position-relative">
                            <button
                              className="btn btn-success"
                              type="button"
                              onClick={() => {
                                assortmentZeroStockClick();
                              }}
                            >
                              ZERO-STOCK
                            </button>
                          </div>
                          <div className="col position-relative">
                            <button
                              className="btn btn-success"
                              type="button"
                              onClick={() => {
                                assortmentFcstClick();
                              }}
                            >
                              FCST
                            </button>
                          </div>
                          <div className="col position-relative">
                            <button
                              className="btn btn-success"
                              type="button"
                              onClick={() => {
                                assortmentSpotClick();
                              }}
                            >
                              SPOT
                            </button>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Warehouse"
                              className=" text-dark fw-bolder px-4"
                            >
                              Warehouse{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.Warehouse || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Warehouse"
                              name="Warehouse"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Zamalek"
                              className=" text-dark fw-bolder px-4"
                            >
                              Zamalek{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.Zamalek || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Zamalek"
                              name="Zamalek"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="GuizeraPlaza"
                              className=" text-dark fw-bolder px-4"
                            >
                              Guizera Plaza{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.GuizeraPlaza || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="GuizeraPlaza"
                              name="GuizeraPlaza"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Hacienda"
                              className=" text-dark fw-bolder px-4"
                            >
                              Hacienda{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.Hacienda || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Hacienda"
                              name="Hacienda"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="CityStars"
                              className=" text-dark fw-bolder px-4"
                            >
                              City Stars{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.CityStars || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="CityStars"
                              name="CityStars"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Bouri"
                              className=" text-dark fw-bolder px-4"
                            >
                              Bouri{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.Bouri || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Bouri"
                              name="Bouri"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="MaadiDegla"
                              className=" text-dark fw-bolder px-4"
                            >
                              Maadi Degla{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.MaadiDegla || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="MaadiDegla"
                              name="MaadiDegla"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Dokki"
                              className=" text-dark fw-bolder px-4"
                            >
                              Dokki{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.Dokki || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Dokki"
                              name="Dokki"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Designia"
                              className=" text-dark fw-bolder px-4"
                            >
                              Designia{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.Designia || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Designia"
                              name="Designia"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="WaterWay"
                              className=" text-dark fw-bolder px-4"
                            >
                              Water Way{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.WaterWay || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="WaterWay"
                              name="WaterWay"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Stella"
                              className=" text-dark fw-bolder px-4"
                            >
                              Stella{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.Stella || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Stella"
                              name="Stella"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="KatameyaHeights"
                              className=" text-dark fw-bolder px-4"
                            >
                              Katameya Heights{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.KatameyaHeights || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="KatameyaHeights"
                              name="KatameyaHeights"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Maadi9"
                              className=" text-dark fw-bolder px-4"
                            >
                              Maadi 9{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.Maadi9 || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Maadi9"
                              name="Maadi9"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Sodic"
                              className=" text-dark fw-bolder px-4"
                            >
                              Sodic{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.Sodic || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Sodic"
                              name="Sodic"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="ElSafwa"
                              className=" text-dark fw-bolder px-4"
                            >
                              El-Safwa{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.ElSafwa || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="ElSafwa"
                              name="ElSafwa"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="MaadiHub"
                              className=" text-dark fw-bolder px-4"
                            >
                              Maadi_Hub{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.MaadiHub || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="MaadiHub"
                              name="MaadiHub"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="ElTagamoaHub"
                              className=" text-dark fw-bolder px-4"
                            >
                              El-Tagamoa_Hub{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.ElTagamoaHub || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="ElTagamoaHub"
                              name="ElTagamoaHub"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Arkan"
                              className=" text-dark fw-bolder px-4"
                            >
                              Arkan{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.Arkan || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Arkan"
                              name="Arkan"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="ElGouna"
                              className=" text-dark fw-bolder px-4"
                            >
                              El Gouna{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.ElGouna || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="ElGouna"
                              name="ElGouna"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="AlmazaBay"
                              className=" text-dark fw-bolder px-4"
                            >
                              Almaza Bay{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.AlmazaBay || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="AlmazaBay"
                              name="AlmazaBay"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              townCairo <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="UptownCairo"
                              className=" text-dark fw-bolder px-4"
                            >
                              Uptown Cairo{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.UptownCairo || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="UptownCairo"
                              name="UptownCairo"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Dunes"
                              className=" text-dark fw-bolder px-4"
                            >
                              Dunes{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.Dunes || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Dunes"
                              name="Dunes"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="AUTO">AUTO</option>
                              <option value="SPOT">SPOT</option>
                              <option value="ZERO-STOCK">ZERO-STOCK</option>
                              <option value="FCST">FCST</option>
                              <option value="OUT">OUT</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div
                        className="w-50  mt-5 mb-5 m-auto"
                        style={{
                          height: "5px",
                          backgroundColor: "black",
                        }}
                      ></div>
                      <div className="col-12 row">
                        <div className="col-3">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Available"
                              className=" text-dark fw-bolder px-4"
                            >
                              Available Online{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <select
                              value={item.online || ""}
                              onChange={(e) => {
                                handleNewInputChange(e, index);
                              }}
                              id="Available"
                              name="online"
                              type="number"
                              className="form-control  rounded-3  border-3 border   "
                            >
                              <option value=""></option>
                              <option value="0">No</option>
                              <option value="1">Yes</option>
                            </select>
                          </div>
                        </div>
                        {item.online == 1 && (
                          <div className="col-12 row justify-content-between g-4 mb-3">
                            <div className="col-6 position-relative">
                              <label
                                htmlFor="EnIngredients"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                English Ingredients{" "}
                                <span className=" fw-bolder text-danger">
                                  *
                                </span>
                              </label>
                              <textarea
                                value={item.EnIngredients || ""}
                                required
                                name="EnIngredients"
                                id="EnIngredients"
                                rows="5"
                                onChange={(e) => {
                                  handleNewInputChange(e, index);
                                }}
                                cols="30"
                                className="form-control fs-3 "
                              ></textarea>
                            </div>
                            <div className="col-6 position-relative">
                              <label
                                htmlFor="EnWebDes"
                                className="ms-2 my-1 fs-5  text-dark"
                              >
                                English Web Description{" "}
                                <span className=" fw-bolder text-danger">
                                  *
                                </span>
                              </label>
                              <textarea
                                value={item.EnWebDes || "" || ""}
                                required
                                name="EnWebDes"
                                id="EnWebDes"
                                rows="5"
                                onChange={(e) => {
                                  handleNewInputChange(e, index);
                                }}
                                cols="30"
                                className="form-control fs-3 "
                              ></textarea>
                            </div>
                            <div className="col-6 position-relative ">
                              <label
                                htmlFor="sWebName"
                                className=" text-dark fw-bolder px-4"
                              >
                                Suggested Web Name{" "}
                                <span className=" fw-bolder text-danger">
                                  *
                                </span>
                              </label>
                              <input
                                onChange={(e) => {
                                  handleNewInputChange(e, index);
                                }}
                                value={item.sWebName || ""}
                                placeholder="Suggest a web name  "
                                id="sWebName"
                                name="sWebName"
                                type="text"
                                required
                                className="form-control  rounded-3  border-3 border   "
                              />
                            </div>
                          </div>
                        )}
                        <div className="col-12 me-auto text-end">
                          <div className=" position-relative ">
                            <MainButton
                              type="submit"
                              value={
                                isLoading ? (
                                  <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                  "Submit" || ""
                                )
                              }
                            />
                          </div>
                        </div>
                        {isSubmitted ? (
                          <div className="col-12 w-50 m-auto text-center alert alert-success p-2 my-5">
                            Product has been submitted and waiting approval
                          </div>
                        ) : (
                          ""
                        )}
                        {productErrorMessage ? (
                          <div className="col-12 w-50 m-auto text-center alert alert-danger p-2 my-5">
                            Please make sure you added all values
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </form>
                );
              })}
          </React.Fragment>
        )}
      </Frame>
    </React.Fragment>
  );
};

export default AssortmentUpdate;
