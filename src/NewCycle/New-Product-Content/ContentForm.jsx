import React, { Fragment, useCallback } from "react";
import { Link } from "react-router-dom";
import MainButton from "../../Components/MainButton/MainButton";
import { motion } from "framer-motion";
import SubButton from "../../Components/SubButton/SubButton";
import axios from "axios";
import swal from "sweetalert";
const ContentForm = (props) => {
  const nameValidateHandler = useCallback(
    async (e, index) => {
      try {
        const response = await axios.get(
          "http://192.168.26.15/itemcreation-test/api/live-names"
        );

        const existNames = response.data.names;
        if (existNames.length) {
          const EnNameFinder = existNames.find(
            (item) => item.EnName === e.target.value.trim("")
          );
          console.log(EnNameFinder, "finder");
          if (EnNameFinder && props.Param !== "existing") {
            swal({
              text: "name already exists ",
              icon: "error",
              button: false,
              timer: 1200,
            });

            e.target.value = "";
            props.contentInputOnChange(e, index);
            return;
          } else {
            props.contentInputOnChange(e, index);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    [props]
  );
  return (
    <Fragment>
      {props.contentData.map((item, index) => {
        // console.log(item, "item");
        return (
          <form
            key={index}
            onSubmit={props.formSubmit}
            className="row justify-content-evenly align-props.items-center p-5 position-relative"
          >
            {props.Param === "Acheckup" && (
              <div className="position-absolute top-0 start-0 end-0 bottom-0"></div>
            )}
            <div className="col-5">
              <label htmlFor="Lookup" className=" ms-2 my-1  fs-5 text-dark">
                Item Lookup Code
              </label>
              <input
                id="Lookup"
                name="Lookup"
                type="text"
                className="form-control "
                disabled
                value={props.lookupCode}
              />
            </div>

            <div className="col-5">
              <label
                htmlFor="Description"
                className="ms-2 my-1 fs-5  text-dark"
              >
                RMS Description
              </label>
              <input
                id="Description"
                type="text"
                className="form-control "
                disabled
                value={
                  props.Param === "existing"
                    ? item.Description
                    : props.productData[0].description
                }
              />
            </div>

            <div
              className="w-100 mt-3 mb-2 m-auto"
              style={{
                height: "5px",
                backgroundColor: "black",
              }}
            ></div>
            <div className="col-12">
              <h4 className="text-center mt-4 mb-2 fw-bolder text-dark ">
                Online Data
              </h4>
              <div
                className="w-25 mt-3 mb-3 m-auto"
                style={{
                  height: "5px",
                  backgroundColor: "black",
                }}
              ></div>
            </div>

            <div className="col-12 row mt-4 p-5 border rounded-3 border-color">
              <h5>
                Suggested Web Name: <strong>{item.suggestWebName}</strong>
              </h5>
              <div className="  col-12 row   justify-content-evenly">
                <div className="col-6">
                  <label
                    htmlFor="englishName"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    English Web Name
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.EnName || ""}
                    //   onChange={(e) => {
                    //     props.contentInputOnChange(e, index);
                    //   }}
                    onBlur={(e) => {
                      nameValidateHandler(e, index);
                    }}
                    required={props.Param === "english" ? true : false}
                    disabled={props.Param === "arabic" ? true : false}
                    id="englishName"
                    name="EnName"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-6">
                  <label
                    htmlFor="arabicName"
                    className="ms-2 my-1 fs-5  text-dark"
                  >
                    Arabic Web Name{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.ArName || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "arabic" ? true : false}
                    disabled={props.Param === "english" ? true : false}
                    name="ArName"
                    id="arabicName"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="type" className="ms-2 my-1 fs-5  text-dark">
                    English Web Description{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <textarea
                    maxLength={250}
                    defaultValue={item.EnDesc || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "english" ? true : false}
                    disabled={props.Param === "arabic" ? true : false}
                    name="EnDesc"
                    id="ar_dsc"
                    rows="5"
                    cols="30"
                    className="form-control fs-3 "
                  ></textarea>
                </div>
                <div className="col-6">
                  <label htmlFor="type" className="ms-2 my-1 fs-5  text-dark">
                    Arabic Web Description{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <textarea
                    maxLength={250}
                    defaultValue={item.ArDesc || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    disabled={props.Param === "english" ? true : false}
                    required={props.Param === "arabic" ? true : false}
                    name="ArDesc"
                    id="ar_dsc"
                    rows="5"
                    cols="30"
                    className="form-control fs-3 "
                  ></textarea>
                </div>
                <div className="col-6">
                  <label
                    htmlFor="EnIngredients"
                    className="ms-2 my-1 fs-5  text-dark"
                  >
                    English Ingredients{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <textarea
                    maxLength={400}
                    defaultValue={item.EnIngredients || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "english" ? true : false}
                    disabled={props.Param === "arabic" ? true : false}
                    name="EnIngredients"
                    id="EnIngredients"
                    rows="5"
                    cols="30"
                    className="form-control fs-3 "
                  ></textarea>
                </div>
                <div className="col-6">
                  <label
                    htmlFor="ArIngredients"
                    className="ms-2 my-1 fs-5  text-dark"
                  >
                    Arabic Ingredients{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <textarea
                    maxLength={400}
                    defaultValue={item.ArIngredients || ""}
                    required={props.Param === "arabic" ? true : false}
                    disabled={props.Param === "english" ? true : false}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    name="ArIngredients"
                    id="ArIngredients"
                    rows="5"
                    cols="30"
                    className="form-control fs-3 "
                  ></textarea>
                </div>
                <div className="col-6">
                  <label
                    htmlFor="EnCookingInstruction"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    English Cooking Instruction
                  </label>
                  <textarea
                    maxLength={250}
                    defaultValue={item.EnCookingInstruction || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    disabled={props.Param === "arabic" ? true : false}
                    id="EnCookingInstruction"
                    name="EnCookingInstruction"
                    type="text"
                    rows="5"
                    cols="30"
                    className="form-control fs-3 "
                  ></textarea>
                </div>
                <div className="col-6">
                  <label
                    htmlFor="CookingInstruction"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Arabic Cooking Instruction
                  </label>
                  <textarea
                    maxLength={250}
                    defaultValue={item.ArCookingInstruction || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    disabled={props.Param === "english" ? true : false}
                    id="CookingInstruction"
                    name="ArCookingInstruction"
                    type="text"
                    rows="5"
                    cols="30"
                    className="form-control fs-3 "
                  ></textarea>
                </div>
                <div className="col-4">
                  <label
                    htmlFor="MetaTitle"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Meta Title <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.MetaTitle || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "english" ? true : false}
                    disabled={props.Param === "arabic" ? true : false}
                    id="MetaTitle"
                    name="MetaTitle"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="MetaKeywords"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Meta Keyword{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.MetaKeywords || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "english" ? true : false}
                    disabled={props.Param === "arabic" ? true : false}
                    id="MetaKeywords"
                    name="MetaKeywords"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="MetaDesc"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Meta Description{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.MetaDesc || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "english" ? true : false}
                    disabled={props.Param === "arabic" ? true : false}
                    id="MetaDesc"
                    name="MetaDesc"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="ArMetaTitle"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Arabic Meta Title{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.ArMetaTitle || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "arabic" ? true : false}
                    disabled={props.Param === "english" ? true : false}
                    id="ArMetaTitle"
                    name="ArMetaTitle"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="ArMetaKeywords"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Arabic Meta Keyword{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.ArMetaKeywords || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "arabic" ? true : false}
                    disabled={props.Param === "english" ? true : false}
                    id="ArMetaKeywords"
                    name="ArMetaKeywords"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="ArMetaDesc"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Arabic Meta Description
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.ArMetaDesc || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "arabic" ? true : false}
                    disabled={props.Param === "english" ? true : false}
                    id="ArMetaDesc"
                    name="ArMetaDesc"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-6">
                  <label
                    htmlFor="ProductSynonyms"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Synonyms (Separated By Commas){" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.ProductSynonyms || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "english" ? true : false}
                    disabled={props.Param === "arabic" ? true : false}
                    id="ProductSynonyms"
                    name="ProductSynonyms"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-6">
                  <label
                    htmlFor="ArProductSynonyms"
                    className=" ms-2 my-1  fs-6 text-dark"
                  >
                    Arabic Synonyms (Separated By Commas){" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.ArProductSynonyms || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "arabic" ? true : false}
                    disabled={props.Param === "english" ? true : false}
                    id="ArProductSynonyms"
                    name="ArProductSynonyms"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-3">
                  <label
                    htmlFor="EnWeight"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Weight <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.EnWeight || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "english" ? true : false}
                    disabled={props.Param === "arabic" ? true : false}
                    id="EnWeight"
                    name="EnWeight"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-3">
                  <label
                    htmlFor="ArWeight"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Arabic Weight{" "}
                    <span className=" fw-bolder text-danger">*</span>
                  </label>
                  <input
                    defaultValue={item.ArWeight || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "arabic" ? true : false}
                    disabled={props.Param === "english" ? true : false}
                    id="ArWeight"
                    name="ArWeight"
                    type="text"
                    className="form-control "
                  />
                </div>

                <div className="col-6">
                  <label
                    htmlFor="VideoURL"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Video URL
                  </label>
                  <input
                    defaultValue={item.VideoURL || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    id="VideoURL"
                    name="VideoURL"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="EnStorage"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    English Storage
                  </label>
                  <input
                    defaultValue={item.EnStorage || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    disabled={props.Param === "arabic" ? true : false}
                    id="EnStorage"
                    name="EnStorage"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="ArStorage"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Arabic Storage
                  </label>
                  <input
                    defaultValue={item.ArStorage || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    disabled={props.Param === "english" ? true : false}
                    id="ArStorage"
                    name="ArStorage"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="EnPrepUsage"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    English PrepUsage
                  </label>
                  <input
                    defaultValue={item.EnPrepUsage || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    disabled={props.Param === "arabic" ? true : false}
                    id="EnPrepUsage"
                    name="EnPrepUsage"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="ArPrepUsage"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Arabic PrepUsage
                  </label>
                  <input
                    defaultValue={item.ArPrepUsage || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    disabled={props.Param === "english" ? true : false}
                    id="ArPrepUsage"
                    name="ArPrepUsage"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="EnPackaging"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    English Packaging
                  </label>
                  <input
                    defaultValue={item.EnPackaging || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    disabled={props.Param === "arabic" ? true : false}
                    id="EnPackaging"
                    name="EnPackaging"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="ArPackaging"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Arabic Packaging
                  </label>
                  <input
                    defaultValue={item.ArPackaging || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    disabled={props.Param === "english" ? true : false}
                    id="ArPackaging"
                    name="ArPackaging"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-6">
                  <label
                    htmlFor="EnOrigin"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    English Origin
                  </label>
                  <input
                    defaultValue={item.EnOrigin || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    disabled={props.Param === "arabic" ? true : false}
                    id="EnOrigin"
                    name="EnOrigin"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-6">
                  <label
                    htmlFor="ArOrigin"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Arabic Origin
                  </label>
                  <input
                    defaultValue={item.ArOrigin || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    disabled={props.Param === "english" ? true : false}
                    id="ArOrigin"
                    name="ArOrigin"
                    type="text"
                    className="form-control "
                  />
                </div>

                <div className="col-6">
                  <label
                    htmlFor="EnBrand"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    English Brand
                  </label>
                  <input
                    defaultValue={item.EnBrand || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "english" ? true : false}
                    disabled={props.Param === "arabic" ? true : false}
                    id="EnBrand"
                    name="EnBrand"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="Brand" className=" ms-2 my-1  fs-5 text-dark">
                    Arabic Brand
                  </label>
                  <input
                    defaultValue={item.ArBrand || ""}
                    onChange={(e) => {
                      props.contentInputOnChange(e, index);
                    }}
                    required={props.Param === "arabic" ? true : false}
                    disabled={props.Param === "english" ? true : false}
                    id="ArBrand"
                    name="ArBrand"
                    type="text"
                    className="form-control "
                  />
                </div>
                <div className="col-4">
                  <label
                    htmlFor="Dietary"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Dietary
                  </label>
                  <select
                    onChange={(e) => {
                      props.dietaryHandler(e);
                    }}
                    id="Dietary"
                    name="Dietary"
                    type="text"
                    className="form-control "
                  >
                    <option value="">Select Dietary</option>
                    {props.Dietary.map((item, index) => {
                      return (
                        <option key={index} value={item.DietryId}>
                          {item.EnglishName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="col-4">
                  <label
                    htmlFor="Allergen"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Allergen
                  </label>
                  <select
                    onChange={(e) => {
                      props.allergenHandler(e);
                    }}
                    id="Allergen"
                    name="Allergen"
                    type="text"
                    className="form-control "
                  >
                    <option value="">Select Allergen</option>
                    {props.Allergens.map((item, index) => {
                      return (
                        <option key={index} value={item.AllergenId}>
                          {item.EnglishName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {props.choosedDietry.length > 0 ? (
                  <>
                    <div className="col-12 my-2 row g-2 justify-content-start ">
                      <h6>Dietary:</h6>
                      {props.choosedDietry.map((dietary, index) => {
                        return (
                          <div key={index} className="col-3 ">
                            <button
                              onClick={() => {
                                props.removeDietaryHandler(index);
                              }}
                              type="button"
                              className=" badge bg-success border-0 "
                            >
                              {dietary.EnglishName}{" "}
                              <i className="fa-solid fa-trash ms-2"></i>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  ""
                )}
                {props.choosedAllergen.length > 0 ? (
                  <>
                    <div className="col-12 my-2 row g-2 justify-content-start ">
                      <h6>Allergens:</h6>
                      {props.choosedAllergen.map((allrg, index) => {
                        return (
                          <div key={index} className="col-3 ">
                            <button
                              onClick={() => {
                                props.removeAllergenHandler(index);
                              }}
                              type="button"
                              className=" badge bg-success border-0 "
                            >
                              {allrg.EnglishName}{" "}
                              <i className="fa-solid fa-trash ms-2"></i>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className="col-12 my-2 row g-2 justify-content-start "></div>

                <div className="col-12 my-2 row g-2 justify-content-start"></div>
                <div className="col-4">
                  <label
                    htmlFor="webHeader"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Website Header <span className="text-danger">*</span>
                  </label>
                  <select
                    id="webHeader"
                    name="header"
                    type="text"
                    className="form-control "
                    style={{
                      overflowY: "scroll",
                    }}
                    value={props.CatChoices.header}
                    onChange={(e) => {
                      props.categoryOnChangeHandler(e);
                    }}
                  >
                    <option value="">Select Header</option>
                    {props.categories.map((option, index) => {
                      return (
                        option.ParentCategoryID === "0" && (
                          <option key={index} value={option.CategoryID}>
                            {option.EnglishName}
                          </option>
                        )
                      );
                    })}
                  </select>
                </div>
                <div className="col-4">
                  <label
                    htmlFor="webCat"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Website Category <span className="text-danger">*</span>
                  </label>
                  <select
                    id="webCat"
                    name="category"
                    type="text"
                    className="form-control "
                    value={props.CatChoices.category}
                    onChange={(e) => {
                      props.categoryOnChangeHandler(e);
                    }}
                  >
                    <option value="">Select Category</option>
                    {props.categories.map((option, index) => {
                      return (
                        option.ParentCategoryID === props.CatChoices.header && (
                          <option key={index} value={option.CategoryID}>
                            {option.EnglishName}
                          </option>
                        )
                      );
                    })}
                  </select>
                </div>
                <div className="col-4">
                  <label
                    htmlFor="webSubCat"
                    className=" ms-2 my-1  fs-5 text-dark"
                  >
                    Website SubCategory <span className="text-danger">*</span>
                  </label>
                  <select
                    id="webSubCat"
                    name="subCategory"
                    type="text"
                    className="form-control "
                    onChange={(e) => {
                      props.categoryOnChangeHandler(e);
                    }}
                  >
                    <option value="">Select Category</option>
                    {props.categories.map((option, index) => {
                      return (
                        option.ParentCategoryID ===
                          props.CatChoices.category && (
                          <option key={index} value={option.CategoryID}>
                            {option.EnglishName}
                          </option>
                        )
                      );
                    })}
                  </select>
                </div>
                <div className="col-12  row  g-4 "></div>

                <div className="col-12">
                  <button
                    type="button"
                    onClick={() => {
                      props.onAddCategoryHandler();
                    }}
                    className="btn btn-primary px-3 my-3"
                  >
                    Add
                  </button>
                </div>
                <div className="col-12">
                  <div className="row m-0 p-0">
                    {props.choosedCategories.map((category, index) => {
                      return (
                        <div key={index} className="col-4">
                          <button
                            onClick={() => {
                              props.removeExistCat(index, category);
                            }}
                            type="button"
                            className=" badge bg-success border-0 "
                          >
                            {category.label}{" "}
                            <i className="fa-solid fa-trash ms-2"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-12 row m-0 p-0 justify-content-start my-3">
                  <div className="col-12 row m-0 p-0 justify-content-evenly my-3  ">
                    <div className="col-5 ">
                      <select
                        onChange={(e) => {
                          props.optionTypeOnChange(e);
                        }}
                        value={props.optionChoices.type}
                        name="RecID"
                        className="form-control"
                      >
                        <option value="">Select Option Type</option>
                        {props.optionTypes.map((type, index) => {
                          return (
                            <option key={index} value={type.RecID}>
                              {type.Title}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-5 ">
                      <select
                        onChange={(e) => {
                          props.optionOnChangeHandler(e);
                        }}
                        name="optionID"
                        className="form-control"
                      >
                        <option value="">Select Option</option>
                        {props.optionValues.map((value, index) => {
                          return (
                            value.MappingID === props.optionChoices.type && (
                              <option key={index} value={value.RecID}>
                                {value.Title}
                              </option>
                            )
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-12 my-2">
                      <div className="row m-0 p-0">
                        {props.options.map((option, index) => {
                          return (
                            <div key={index} className="col-4">
                              <button
                                onClick={() => {
                                  props.handleExistOptionDelete(index, option);
                                }}
                                type="button"
                                className=" badge bg-success border-0 "
                              >
                                {option.title}{" "}
                                <i className="fa-solid fa-trash ms-2"></i>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="row m-0 p-0 "></div>
                </div>
              </div>
            </div>
            {props.imagesView.length > 0 && (
              <div className="col-12 row my-2 border rounded-3  p-2 border-color">
                <div className="col-12 text-center">
                  <h2 className="text-center text-dark fs-3 fw-bold">
                    Photography
                  </h2>
                  <div
                    className="w-25 mt-3 mb-3 m-auto"
                    style={{
                      height: "5px",
                      backgroundColor: "black",
                    }}
                  ></div>
                </div>
                {props.imagesView.map((photo, index) => {
                  return (
                    <div
                      download
                      className="col-3 card mx-1 bg-transparent border-0 "
                      key={index}
                    >
                      <img
                        src={`http://192.168.26.15/itemcreation-test/uploads/${photo.file}`}
                        alt=""
                        className=" card-img-top h-75 w-100  "
                      />

                      <div className="text-center card-body">
                        <motion.button
                          whileHover={{
                            backgroundColor: "#00a886",
                          }}
                          transition={{ duration: ".1" }}
                          type="button"
                          className="btn border-0  text-light  rounded-3 fs-5 "
                          onClick={() => {
                            props.downloadImage(photo.file);
                          }}
                          style={{
                            backgroundColor: "#00a886f0",
                          }}
                        >
                          Download <i className="fa-solid fa-download"></i>
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {props.Param === "Acheckup" ? (
              <div className="col-12 row justify-content-between my-3">
                <div className="  col-4 position-relative  ">
                  <MainButton
                    onClick={(e) => {
                      props.formSubmit(e);
                    }}
                    disabled={props.isLoadingReject ? true : false}
                    type="button"
                    value={
                      props.isLoadingApprove ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        "Approve"
                      )
                    }
                  />
                </div>

                <div className="  col-4 position-relative text-end ">
                  <SubButton
                    onClick={(e) => {
                      props.formSubmit(e);
                    }}
                    disabled={props.isLoadingApprove ? true : false}
                    type="button"
                    value={
                      props.isLoadingReject ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        "Reject"
                      )
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="col-12 d-flex justify-content-end my-3">
                <MainButton
                  type="submit"
                  value={
                    props.awaiting ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      "Submit"
                    )
                  }
                />
              </div>
            )}
          </form>
        );
      })}
    </Fragment>
  );
};

export default ContentForm;
