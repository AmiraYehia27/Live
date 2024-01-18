import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../Spinner/Spinner";
import MainButton from "../../Components/MainButton/MainButton";
import swal from "sweetalert";
import Frame from "../../Components/MainFrame/Frame";

const AddProduct = () => {
  const [isOnline, setIsOnline] = useState(false);
  let user = JSON.parse(sessionStorage.getItem("userData"));
  const [costValue, setCostValue] = useState(0);
  const [vatValue, setVatValue] = useState(0);
  const [sellingValue, setSellingValue] = useState(0);
  let costAfterValue = 0;
  let marginValue = 0;
  // initializes several state variables using the useState hook. These variables include isOnline, costValue, vatValue, and sellingValue. The user variable is also initialized by retrieving data from sessionStorage. Finally, costAfterValue and marginValue are also initialized to 0.
  // Product Json
  const [productInfo, setProductInfo] = useState({
    loading: false,
    catLoading: false,
    isLoading: false,
    departments: [],
    categories: [],
    suppliers: [],
    errorMessage: "",
    productErrorMessage: "",
    items: {
      lookupcode: "",
      ItemType: "",
      description: "",
      SupplierID: "",
      units_cartoon: "1",
      ShelfLife: "",
      Cost: "",
      salestax: 0,
      CostTax: costAfterValue > 0 ? costAfterValue : "",
      RetailPrice: "",
      tierPriceC: "",
      orangePriceA: "",
      Margin: marginValue,
      group: "",
      StorageCondition: "",
      country: "",
      DepartmentID: "",
      CategoryID: "",
      LaunchingDate: "",
      UnitOfMeasure: "PC",
      pack_weight: "",
      units_pack: "",
      user: user.id != null ? user.id : "",
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
  });
  // console.log(productInfo);
  // initializes the productInfo state variable as an object with several properties. These properties include loading, catLoading, and isLoading, which are all initialized to false. departments, categories, and suppliers are all initialized as empty arrays. errorMessage and productErrorMessage are initialized as empty strings. Finally, items is an object that contains many different properties and their initial values.
  const [postLog, setPostLog] = useState({
    lookupcode: "",
    action: "",
    user: user.id != null ? user.id : "",
  });
  // This line declares a state variable called postLog that is an object with three properties: lookupcode, action, and user. It also declares a function called setPostLog that can be used to update the value of postLog. The initial state of postLog is an object with empty string values for lookupcode and action, and either the ID of the user if it exists, or an empty string if it doesn't.
  if (costValue > 0 && vatValue >= 0) {
    costAfterValue = (costValue * vatValue) / 100;
    costAfterValue = costAfterValue += Number(costValue);
    productInfo.items.CostTax = costAfterValue;
  }
  // This if statement checks whether costValue and vatValue are both greater than or equal to zero. If they are, it calculates costAfterValue by adding the percentage of the costValue represented by the vatValue. It then sets the CostTax property of the productInfo.items object to the resulting value of costAfterValue.
  if (sellingValue > 0 && costAfterValue > 0) {
    let differnce = sellingValue - costAfterValue;
    let Division = differnce / sellingValue;
    marginValue = Division * 100;
    marginValue = marginValue.toFixed(2) + "%";
    productInfo.items.Margin = marginValue;
  }
  // This if statement checks whether sellingValue and costAfterValue are both greater than zero. If they are, it calculates the margin value of the product by subtracting the costAfterValue from the sellingValue, dividing the result by the sellingValue, multiplying by 100 to get a percentage, rounding to two decimal places, and appending a % sign. It then sets the Margin property of the productInfo.items object to the resulting value of marginValue.

  // Calling APIs of departments and supplier
  async function getDepartment() {
    try {
      setProductInfo({ ...productInfo, loading: true });
      let response = await axios.get(
        "http://192.168.26.15/itemcreation-test/api/departments"
      );
      let responseCat = await axios.get(
        "http://192.168.26.15/itemcreation-test/api/category"
      );
      let responseSup = await axios.get(
        "http://192.168.26.15/itemcreation-test/api/supplier"
      );

      setProductInfo({
        ...productInfo,
        loading: false,
        departments: response.data.departments,
        categories: responseCat.data.categories,
        suppliers: responseSup.data.suppliers,
      });
    } catch (error) {
      setProductInfo({
        ...productInfo,
        loading: false,
        errorMessage: error.message,
      });
    }
  }
  //This declares an async function called getDepartment that will fetch data from three different APIs: /cms/api/departments, /cms/api/category, and /cms/api/supplier. If the requests are successful, it will set the state of productInfo to include the data retrieved from each API. If there is an error, it will set the errorMessage property of productInfo.
  useEffect(() => {
    getDepartment();
  }, []);
  // This useEffect hook will run getDepartment when the component mounts because it has an empty dependency array. This means it will only run once on initial mount. The purpose of this hook is to fetch data from the APIs and set the initial state of productInfo with the data retrieved.
  // Calling API of Category

  // Submit the product
  async function formSubmit(e) {
    e.preventDefault();
    console.log("productInfo", productInfo.items.tierPriceC);
    // if (productInfo.items.tierPriceC == "") {
    //   let items = { ...productInfo.items };
    //   items.tierPriceC = items.RetailPrice
    //   setProductInfo((prev) => {
    //     return { ...prev, items };
    //   })
    // }
    // if (productInfo.items.orangePriceA == "") {
    //   let items = { ...productInfo.items };
    //   items.orangePriceA = items.RetailPrice
    //   setProductInfo((prev) => {
    //     return { ...prev, items };
    //   })
    // }
    setProductInfo((prev) => {
      return { ...prev, isLoading: true };
    });
    console.log("productInfonewwwwwwwwwwwwwwwww", productInfo.items.tierPriceC);
    try {
      let response = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/create-product",
        productInfo.items
      );
      let responseLog = await axios.post(
        "http://192.168.26.15/itemcreation-test/api/log",
        postLog
      );
      if (response.data.message != "lookupcode already exists!") {
        setProductInfo((prev) => {
          return { ...prev, isLoading: false };
        });
        swal({
          text: "Added Item successfully  ",
          icon: "success",
          button: false,
          timer: 1200,
        });
        setProductInfo({
          ...productInfo,
          items: {
            ...productInfo.items,
            lookupcode: "",
            description: "",
          },
        });
      } else {
        setProductInfo((prev) => {
          return { ...prev, isLoading: false };
        });
        swal({
          title: `Hi ${user.name}`,
          text: "The entered lookupcode or description already Exists ",
          icon: "error",
        });
        setProductInfo({
          ...productInfo,
          items: { ...productInfo.items, lookupcode: "" },
        });
      }
    } catch (error) {
      console.log(error);
      setProductInfo((prev) => {
        return { ...prev, isLoading: false };
      });
      swal({
        title: `Hi ${user.name}`,
        text: "An error occurred please refresh the page and try again  ",
        button: false,
        timer: 1200,
        icon: "error",
      });
    }
  }
  /*
    the formSubmit function is called, which first prevents the default form submission using e.preventDefault().

Then, it sets the isLoading state of the productInfo object to true to indicate that the submission process has begun. After that, the axios.post() method is called to send a POST request to the API endpoint for creating a new product with the product information stored in the productInfo.items object.

If the response from the API indicates that the product was created successfully (i.e., the message in the response data is not "lookupcode already exists!"), a success message is displayed to the user using the swal() function from the SweetAlert library. The isLoading state of the productInfo object is then set back to false, and the lookupcode and description fields of the productInfo.items object are cleared.

If the response from the API indicates that the lookup code already exists, an error message is displayed to the user using the swal() function. The isLoading state of the productInfo object is set back to false, and the lookupcode field of the productInfo.items object is cleared.

If there is an error during the submission process, an error message is displayed to the user using the swal() function. The isLoading state of the productInfo object is set back to false.
   */
  // Get the User data on change
  function getUserData(e) {
    setProductInfo({
      ...productInfo,
      items: { ...productInfo.items, [e.target.name]: e.target.value },
    });
  }
  //called on every change in any input field of the form. It sets the corresponding field in the productInfo.items object to the current value of the input field.

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
  // Adding values to Assortment section
  const assortmentAuto = () => {
    setProductInfo({
      ...productInfo,
      items: {
        ...productInfo.items,
        Warehouse: "AUTO",
        Zamalek: "AUTO",
        GuizeraPlaza: "AUTO",
        Bouri: "AUTO",
        CityStars: "AUTO",
        MaadiDegla: "AUTO",
        Dokki: "AUTO",
        Designia: "AUTO",
        WaterWay: "AUTO",
        Stella: "AUTO",
        KatameyaHeights: "AUTO",
        Maadi9: "AUTO",
        Sodic: "AUTO",
        ElSafwa: "AUTO",
        MaadiHub: "AUTO",
        ElTagamoaHub: "AUTO",
        Arkan: "AUTO",
        ElGouna: "AUTO",
        AlmazaBay: "AUTO",
        UptownCairo: "AUTO",
        Dunes: "AUTO",
      },
    });
  };
  const assortmentOut = () => {
    setProductInfo({
      ...productInfo,
      items: {
        ...productInfo.items,
        Warehouse: "OUT",
        Zamalek: "OUT",
        GuizeraPlaza: "OUT",
        Bouri: "OUT",
        CityStars: "OUT",
        MaadiDegla: "OUT",
        Dokki: "OUT",
        Designia: "OUT",
        WaterWay: "OUT",
        Stella: "OUT",
        KatameyaHeights: "OUT",
        Maadi9: "OUT",
        Sodic: "OUT",
        ElSafwa: "OUT",
        MaadiHub: "OUT",
        ElTagamoaHub: "OUT",
        Arkan: "OUT",
        ElGouna: "OUT",
        AlmazaBay: "OUT",
        UptownCairo: "OUT",
        Dunes: "OUT",
      },
    });
  };
  const assortmentSpot = () => {
    setProductInfo({
      ...productInfo,
      items: {
        ...productInfo.items,
        Warehouse: "SPOT",
        Zamalek: "SPOT",
        GuizeraPlaza: "SPOT",
        Bouri: "SPOT",
        CityStars: "SPOT",
        MaadiDegla: "SPOT",
        Dokki: "SPOT",
        Designia: "SPOT",
        WaterWay: "SPOT",
        Stella: "SPOT",
        KatameyaHeights: "SPOT",
        Maadi9: "SPOT",
        Sodic: "SPOT",
        ElSafwa: "SPOT",
        MaadiHub: "SPOT",
        ElTagamoaHub: "SPOT",
        Arkan: "SPOT",
        ElGouna: "SPOT",
        AlmazaBay: "SPOT",
        UptownCairo: "SPOT",
        Dunes: "SPOT",
      },
    });
  };
  const assortmentZeroStock = () => {
    setProductInfo({
      ...productInfo,
      items: {
        ...productInfo.items,
        Warehouse: "ZERO-STOCK",
        Zamalek: "ZERO-STOCK",
        GuizeraPlaza: "ZERO-STOCK",
        Bouri: "ZERO-STOCK",
        CityStars: "ZERO-STOCK",
        MaadiDegla: "ZERO-STOCK",
        Dokki: "ZERO-STOCK",
        Designia: "ZERO-STOCK",
        WaterWay: "ZERO-STOCK",
        Stella: "ZERO-STOCK",
        KatameyaHeights: "ZERO-STOCK",
        Maadi9: "ZERO-STOCK",
        Sodic: "ZERO-STOCK",
        ElSafwa: "ZERO-STOCK",
        MaadiHub: "ZERO-STOCK",
        ElTagamoaHub: "ZERO-STOCK",
        Arkan: "ZERO-STOCK",
        ElGouna: "ZERO-STOCK",
        AlmazaBay: "ZERO-STOCK",
        UptownCairo: "ZERO-STOCK",
        Dunes: "ZERO-STOCK",
      },
    });
  };

  const assortmentFcst = () => {
    setProductInfo({
      ...productInfo,
      items: {
        ...productInfo.items,
        Warehouse: "FCST",
        Zamalek: "FCST",
        GuizeraPlaza: "FCST",
        Bouri: "FCST",
        CityStars: "FCST",
        MaadiDegla: "FCST",
        Dokki: "FCST",
        Designia: "FCST",
        WaterWay: "FCST",
        Stella: "FCST",
        KatameyaHeights: "FCST",
        Maadi9: "FCST",
        Sodic: "FCST",
        ElSafwa: "FCST",
        MaadiHub: "FCST",
        ElTagamoaHub: "FCST",
        Arkan: "FCST",
        ElGouna: "FCST",
        AlmazaBay: "FCST",
        UptownCairo: "FCST",
        Dunes: "FCST",
      },
    });
  };
  //  set the values of the Warehouse, Zamalek, GuizeraPlaza, etc. fields of the productInfo.items object to different values based on the button that is clicked by the user. These functions are used to set the values of the "Assortment" section of the form.

  // End of it
  // Destructing props

  const { items, suppliers, departments, loading, categories, isLoading } =
    productInfo;

  return (
    <React.Fragment>
      <Frame headerLabel="Add New Product">
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <form onSubmit={formSubmit}>
              <div
                className="row justify-content-evenly  rounded-3 border row-shadow g-3    p-4 my-3"
                style={{
                  overflowX: "hidden",
                  overflowY: "scroll",
                }}
              >
                <div className="col-12 text-center mb-3">
                  <h1 className="text-shadow fw-bolder ">
                    Please Enter All Required Data
                  </h1>
                </div>
                <div className="col-6">
                  <div className=" position-relative ">
                    <label
                      htmlFor="ProductNumber"
                      className=" text-dark  fw-bolder px-4"
                    >
                      Item Lookup Code{" "}
                      <span className=" fw-bolder text-danger">*</span>
                    </label>
                    <input
                      onChange={(e) => {
                        getUserData(e);
                        setPostLog({
                          ...postLog,
                          lookupcode: e.target.value,
                          action: `${user.name} added a new product: ${e.target.value} `,
                        });
                      }}
                      required
                      id="ProductNumber"
                      name="lookupcode"
                      type="text"
                      value={items.lookupcode}
                      maxLength={30}
                      className="form-control  rounded-3  border-3 border  "
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
                      required
                      onChange={getUserData}
                      value={items.description}
                      id="rms_desc"
                      name="description"
                      type="text"
                      className="form-control  rounded-3  border-3 border   "
                      maxLength={30}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className=" position-relative ">
                    <label
                      htmlFor="supplier"
                      className=" text-dark fw-bolder px-4"
                    >
                      Supplier <span className=" fw-bolder text-danger">*</span>
                    </label>
                    <select
                      required
                      id="supplier"
                      value={productInfo.items.SupplierID}
                      name="SupplierID"
                      type="number"
                      className="form-control  rounded-3  border-3 border   "
                      onChange={getUserData}
                    >
                      <option></option>
                      {suppliers.length > 0 &&
                        suppliers.map((supply) => {
                          return (
                            <option
                              key={supply.ID}
                              name="supplier"
                              value={supply.ID}
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
                    <label htmlFor="u_c" className=" text-dark fw-bolder px-4">
                      Units/Carton{" "}
                      <span className=" fw-bolder text-danger">*</span>
                    </label>
                    <input
                      value={items.units_cartoon}
                      min={1}
                      required
                      onChange={getUserData}
                      id="u_c"
                      name="units_cartoon"
                      type="number"
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
                      required
                      min={0}
                      value={items.ShelfLife}
                      onChange={getUserData}
                      id="s_life"
                      name="ShelfLife"
                      type="number"
                      className="form-control  rounded-3  border-3 border   "
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className=" position-relative ">
                    <label htmlFor="Cost" className=" text-dark fw-bolder px-4">
                      Cost(without Tax){" "}
                      <span className=" fw-bolder text-danger">*</span>
                    </label>
                    <input
                      required
                      min={0}
                      onChange={(e) => {
                        getUserData(e);
                        setCostValue(e.target.value);
                      }}
                      value={items.Cost}
                      id="Cost"
                      name="Cost"
                      type="number"
                      step=".01"
                      className="form-control  rounded-3  border-3 border   "
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className=" position-relative ">
                    <label htmlFor="tax" className=" text-dark fw-bolder px-4">
                      VAT <span className=" fw-bolder text-danger">*</span>
                    </label>
                    <select
                      onChange={(e) => {
                        getUserData(e);
                        setVatValue(e.target.value);
                      }}
                      required
                      min={0}
                      type="number"
                      id="tax"
                      name="salestax"
                      className="form-control  rounded-3  border-3 border"
                    >
                      <option defaultValue>Select Tax</option>
                      <option value="0.00">Zero Taxes</option>
                      <option value="14.00">SalesTax 14%</option>
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
                      readOnly
                      value={costAfterValue}
                      onChange={getUserData}
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
                      onChange={(e) => {
                        getUserData(e);
                        setSellingValue(e.target.value);
                      }}
                      required
                      min={0}
                      value={items.RetailPrice}
                      id="price"
                      name="RetailPrice"
                      type="number"
                      className="form-control  rounded-3  border-3 border   "
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className="position-relative">
                    <label
                      htmlFor="tierPriceC"
                      className="text-dark fw-bolder px-4"
                    >
                      Gourmet Gold/VIP Price
                      <span className="fw-bolder text-danger">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min={0}
                      step="0.01"
                      name="tierPriceC"
                      value={items.tierPriceC}
                      onChange={getUserData}
                      className="form-control rounded-3 border-3 border"
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className="position-relative">
                    <label
                      htmlFor="orangePriceA"
                      className="text-dark fw-bolder px-4"
                    >
                      Orange Gold/VIP Price
                      <span className="fw-bolder text-danger">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min={0}
                      step="0.01"
                      name="orangePriceA"
                      value={items.orangePriceA}
                      onChange={getUserData}
                      className="form-control rounded-3 border-3 border"
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
                      readOnly
                      value={marginValue}
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
                      required
                      onChange={getUserData}
                      value={items.group}
                      id="counter"
                      name="group"
                      type="text"
                      className="form-control  rounded-3  border-3 border   "
                    >
                      <option defaultValue> Select Group </option>
                      <option value="Butchery">Butchery</option>
                      <option value="Cheese&amp;Deli">Cheese&amp;Deli</option>
                      <option value="F&amp;V">F&amp;V</option>
                      <option value="Loyalty">Loyalty</option>
                      <option value="Fresh-SeaFood">Fresh Sea Food</option>
                      <option value="Grocery">Grocery</option>
                      <option value="Non-Food">Non-Food</option>
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
                      required
                      onChange={getUserData}
                      value={items.StorageCondition}
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
                      <option value="Cool &amp; Dry">Cool &amp; Dry</option>
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
                      required
                      onChange={getUserData}
                      value={items.country}
                      id="country"
                      name="country"
                      type="text"
                      className="form-control  rounded-3  border-3 border   "
                    >
                      <option value="">Select Country</option>
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Albania">Albania</option>
                      <option value="Algeria">Algeria</option>
                      <option value="American Samoa">American Samoa</option>
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
                      <option value="Cayman Islands">Cayman Islands</option>
                      <option value="Central African Republic">
                        Central African Republic
                      </option>
                      <option value="Chad">Chad</option>
                      <option value="Chile">Chile</option>
                      <option value="China">China</option>
                      <option value="Christmas Island">Christmas Island</option>
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
                      <option value="Czech Republic">Czech Republic</option>
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
                      <option value="French Polynesia">French Polynesia</option>
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
                      <option value="Iran">Iran (Islamic Republic of)</option>
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
                      <option value="Marshall Islands">Marshall Islands</option>
                      <option value="Martinique">Martinique</option>
                      <option value="Mauritania">Mauritania</option>
                      <option value="Mauritius">Mauritius</option>
                      <option value="Mayotte">Mayotte</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Micronesia">
                        Micronesia, Federated States of
                      </option>
                      <option value="Moldova">Moldova, Republic of</option>
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
                      <option value="Norfolk Island">Norfolk Island</option>
                      <option value="Northern Mariana Islands">
                        Northern Mariana Islands
                      </option>
                      <option value="Norway">Norway</option>
                      <option value="Oman">Oman</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Palau">Palau</option>
                      <option value="Panama">Panama</option>
                      <option value="Papua New Guinea">Papua New Guinea</option>
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
                      <option value="Solomon Islands">Solomon Islands</option>
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
                      <option value="Taiwan">Taiwan, Province of China</option>
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
                      <option value="United Kingdom">United Kingdom</option>
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
                      <option value="Western Sahara">Western Sahara</option>
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
                      RMS Department{" "}
                      <span className=" fw-bolder text-danger">*</span>
                    </label>
                    <select
                      required
                      id="rmsDepa"
                      value={productInfo.items.DepartmentID}
                      name="DepartmentID"
                      type="number"
                      className="form-control  rounded-3  border-3 border   "
                      onChange={getUserData}
                    >
                      <option value="">Select Department</option>
                      {departments.length > 0 &&
                        departments.map((department) => {
                          return (
                            <option
                              key={department.ID}
                              name="DepartmentID"
                              value={department.ID}
                            >
                              {department.code} - {department.Name}
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
                      RMS Category
                    </label>
                    <select
                      id="rmsCat"
                      value={productInfo.items.CategoryID}
                      name="CategoryID"
                      type="number"
                      className="form-control  rounded-3  border-3 border   "
                      onChange={getUserData}
                    >
                      <option value="">Select Category</option>
                      {categories.length > 0 &&
                        categories.map((category) => {
                          return category.DepartmentId ==
                            productInfo.items.DepartmentID ? (
                            <option
                              key={category.ID}
                              name="CategoryID"
                              value={category.ID}
                            >
                              {category.code} - {category.Name}
                            </option>
                          ) : (
                            ""
                          );
                        })}
                    </select>
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
                      type="date"
                      required
                      id="introductionDate"
                      name="LaunchingDate"
                      value={items.LaunchingDate}
                      min={today}
                      onChange={getUserData}
                      className="form-control  rounded-3  border-3 border   "
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className=" position-relative ">
                    <label htmlFor="u_m" className=" text-dark fw-bolder px-4">
                      Inventory Unit
                      <span className=" fw-bolder text-danger">*</span>
                    </label>
                    <select
                      required={true}
                      onChange={getUserData}
                      value={items.UnitOfMeasure}
                      id="u_m"
                      name="UnitOfMeasure"
                      type="text"
                      className="form-control  rounded-3  border-3 border   "
                    >
                      <option value="KG_OR_PC">Select Unit</option>
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
                      required
                      min="0"
                      step="0.01"
                      onChange={getUserData}
                      value={items.pack_weight}
                      id="pack_weight"
                      name="pack_weight"
                      type="number"
                      className="form-control  rounded-3  border-3 border   "
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className=" position-relative ">
                    <label htmlFor="u_p" className=" text-dark fw-bolder px-4">
                      Units/Package
                    </label>
                    <input
                      min="0"
                      required
                      step="0.01"
                      onChange={getUserData}
                      value={items.units_pack}
                      id="u_p"
                      name="units_pack"
                      type="number"
                      className="form-control  rounded-3  border-3 border   "
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className=" position-relative ">
                    <label htmlFor="u_m" className=" text-dark fw-bolder px-4">
                      Item Type{" "}
                      <span className=" fw-bolder text-danger">*</span>
                    </label>
                    <select
                      required
                      onChange={getUserData}
                      value={items.ItemType}
                      id="type"
                      name="ItemType"
                      type="text"
                      className="form-control  rounded-3  border-3 border   "
                    >
                      <option value="">Select Type</option>
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
                      onChange={getUserData}
                      value={productInfo.relex}
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
                      onChange={getUserData}
                      value={items.primary_product}
                      required
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
                      onChange={getUserData}
                      value={items.private_brand}
                      required
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
                      <span className=" fw-bouct flowlder text-danger">*</span>
                    </label>
                    <select
                      onChange={getUserData}
                      value={items.brand_type}
                      required
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
                      onChange={getUserData}
                      value={items.product_flow}
                      required
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
                      onChange={getUserData}
                      value={items.warehouse_type}
                      required
                      id="warehouse_type"
                      name="warehouse_type"
                      type="number"
                      className="form-control  rounded-3  border-3 border   "
                    >
                      <option value="">Select Warehouse Type</option>
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
                      min="0"
                      step="1"
                      onChange={getUserData}
                      value={items.batch_size}
                      required
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
                      min="0"
                      step="1"
                      onChange={getUserData}
                      value={items.minimum_delivery}
                      required
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
                      min="0"
                      step="1"
                      onChange={getUserData}
                      value={items.spoiling_time}
                      required
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
                      Remaining Shelf life
                    </label>
                    <input
                      min="0"
                      step="1"
                      onChange={getUserData}
                      value={items.r_shelflife}
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
                      min="0"
                      step="1"
                      onChange={getUserData}
                      value={items.pallet_size}
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
                      min="0"
                      step="1"
                      onChange={getUserData}
                      value={items.pallet_lsize}
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
                      min="0"
                      step="1"
                      onChange={getUserData}
                      value={items.shelf_space}
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
                      min="0"
                      step="1"
                      onChange={getUserData}
                      id="u_spoint"
                      value={items.ugly_spoint}
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
                      type="date"
                      id="s_date"
                      value={items.seasonal_start}
                      name="seasonal_start"
                      min={today}
                      onChange={(e) => {
                        getUserData(e);
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
                      disabled={items.seasonal_start === "" ? true : false}
                      type="date"
                      id="e_date"
                      value={items.seasonal_end}
                      name="seasonal_end"
                      onChange={(e) => {
                        getUserData(e);
                      }}
                      min={items.seasonal_start}
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
                  <div className="col-12 my-1 row justify-content-between g-3">
                    <div className="col-12">
                      <h4>
                        Check any of below buttons to submit Assortment values
                      </h4>
                    </div>
                    <div className="col-2 position-relative">
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={() => {
                          assortmentAuto();
                        }}
                      >
                        AUTO
                      </button>
                    </div>
                    <div className="col-2 position-relative">
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => {
                          assortmentOut();
                        }}
                      >
                        OUT
                      </button>
                    </div>
                    <div className="col-2 position-relative">
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={() => {
                          assortmentZeroStock();
                        }}
                      >
                        ZERO-STOCK
                      </button>
                    </div>
                    <div className="col-2 position-relative">
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={() => {
                          assortmentFcst();
                        }}
                      >
                        FCST
                      </button>
                    </div>
                    <div className="col-2 position-relative">
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={() => {
                          assortmentSpot();
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
                        value={items.Warehouse !== "" ? items.Warehouse : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.Warehouse = e.target.value;
                        }}
                        required
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
                        value={items.Zamalek !== "" ? items.Zamalek : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.Zamalek = e.target.value;
                        }}
                        required
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
                        value={
                          items.GuizeraPlaza !== "" ? items.GuizeraPlaza : ""
                        }
                        onChange={(e) => {
                          getUserData(e);
                          items.GuizeraPlaza = e.target.value;
                        }}
                        required
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
                        htmlFor="CityStars"
                        className=" text-dark fw-bolder px-4"
                      >
                        City Stars{" "}
                        <span className=" fw-bolder text-danger">*</span>
                      </label>
                      <select
                        value={items.CityStars !== "" ? items.CityStars : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.CityStars = e.target.value;
                        }}
                        required
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
                        Bouri <span className=" fw-bolder text-danger">*</span>
                      </label>
                      <select
                        value={items.Bouri !== "" ? items.Bouri : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.Bouri = e.target.value;
                        }}
                        required
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
                        value={items.MaadiDegla !== "" ? items.MaadiDegla : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.MaadiDegla = e.target.value;
                        }}
                        required
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
                        Dokki <span className=" fw-bolder text-danger">*</span>
                      </label>
                      <select
                        value={items.Dokki !== "" ? items.Dokki : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.Dokki = e.target.value;
                        }}
                        required
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
                        value={items.Designia !== "" ? items.Designia : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.Designia = e.target.value;
                        }}
                        required
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
                        value={items.WaterWay !== "" ? items.WaterWay : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.WaterWay = e.target.value;
                        }}
                        required
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
                        Stella <span className=" fw-bolder text-danger">*</span>
                      </label>
                      <select
                        value={items.Stella !== "" ? items.Stella : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.Stella = e.target.value;
                        }}
                        required
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
                        value={
                          items.KatameyaHeights !== ""
                            ? items.KatameyaHeights
                            : ""
                        }
                        onChange={(e) => {
                          getUserData(e);
                          items.KatameyaHeights = e.target.value;
                        }}
                        required
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
                        value={items.Maadi9 !== "" ? items.Maadi9 : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.Maadi9 = e.target.value;
                        }}
                        required
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
                        Sodic <span className=" fw-bolder text-danger">*</span>
                      </label>
                      <select
                        value={items.Sodic !== "" ? items.Sodic : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.Sodic = e.target.value;
                        }}
                        required
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
                        value={items.ElSafwa !== "" ? items.ElSafwa : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.ElSafwa = e.target.value;
                        }}
                        required
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
                        value={items.MaadiHub !== "" ? items.MaadiHub : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.MaadiHub = e.target.value;
                        }}
                        required
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
                        value={
                          items.ElTagamoaHub !== "" ? items.ElTagamoaHub : ""
                        }
                        onChange={(e) => {
                          getUserData(e);
                          items.ElTagamoaHub = e.target.value;
                        }}
                        required
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
                        Arkan <span className=" fw-bolder text-danger">*</span>
                      </label>
                      <select
                        value={items.Arkan !== "" ? items.Arkan : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.Arkan = e.target.value;
                        }}
                        required
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
                        value={items.ElGouna !== "" ? items.ElGouna : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.ElGouna = e.target.value;
                        }}
                        required
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
                        value={items.AlmazaBay !== "" ? items.AlmazaBay : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.AlmazaBay = e.target.value;
                        }}
                        required
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
                        <option value="OUT">OUT</option>
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
                        value={
                          items.UptownCairo !== "" ? items.UptownCairo : ""
                        }
                        onChange={(e) => {
                          getUserData(e);
                          items.UptownCairo = e.target.value;
                        }}
                        required
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
                        Dunes <span className=" fw-bolder text-danger">*</span>
                      </label>
                      <select
                        value={items.Dunes !== "" ? items.Dunes : ""}
                        onChange={(e) => {
                          getUserData(e);
                          items.Dunes = e.target.value;
                        }}
                        required
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
                        onChange={(e) => {
                          getUserData(e);
                        }}
                        onClick={(e) => {
                          if (e.target.value == 1) {
                            setIsOnline(true);
                          } else {
                            setIsOnline(false);
                          }
                        }}
                        required
                        id="Available"
                        value={items.online}
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
                  {isOnline ? (
                    <div>
                      <div className="col-12 row justify-content-between g-4 mb-3">
                        <div className="col-6 position-relative">
                          <label
                            htmlFor="EnIngredients"
                            className="ms-2 my-1 fs-5  text-dark"
                          >
                            English Ingredients{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <textarea
                            maxLength={200}
                            required
                            onChange={getUserData}
                            value={items.EnIngredients}
                            name="EnIngredients"
                            id="EnIngredients"
                            rows="5"
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
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <textarea
                            maxLength={200}
                            onChange={getUserData}
                            value={items.EnWebDes}
                            name="EnWebDes"
                            id="EnWebDes"
                            rows="5"
                            required
                            cols="30"
                            className="form-control fs-3 "
                          ></textarea>
                        </div>
                        <div className="col-6">
                          <div className=" position-relative ">
                            <label
                              htmlFor="Dunes"
                              className=" text-dark fw-bolder px-4"
                            >
                              Suggested Web Name{" "}
                              <span className=" fw-bolder text-danger">*</span>
                            </label>
                            <input
                              required
                              onChange={getUserData}
                              placeholder="Suggest a web name  "
                              value={items.sWebName}
                              id="sWebName"
                              name="sWebName"
                              type="text"
                              className="form-control  rounded-3  border-3 border   "
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className=" position-relative ">
                          <label
                            htmlFor="InventoryBypass"
                            className=" text-dark fw-bolder px-4"
                          >
                            Inventory Bypass{" "}
                            <span className=" fw-bolder text-danger">*</span>
                          </label>
                          <select
                            onChange={getUserData}
                            required
                            id="InventoryBypass"
                            value={items.InventoryBypass}
                            name="InventoryBypass"
                            type="number"
                            className="form-control  rounded-3  border-3 border   "
                          >
                            <option value=""></option>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="col-12 me-auto text-end">
                    <div className=" position-relative ">
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
                </div>
              </div>
            </form>
          </React.Fragment>
        )}
      </Frame>
    </React.Fragment>
  );
};

export default AddProduct;
