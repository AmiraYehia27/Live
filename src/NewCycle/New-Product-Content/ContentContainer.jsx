import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import Frame from "../../Components/MainFrame/Frame";
import Spinner from "../../Spinner/Spinner";
import ContentForm from "./ContentForm";
import { saveAs } from "file-saver";
const ContentContainer = () => {
  // handling navigator
  let navigate = useNavigate();
  // This line declares a variable navigate that is assigned the useNavigate hook from the react-router-dom library. This hook provides a way to navigate to different URLs in the application.

  // Handling params
  let { Id, Param } = useParams();
  //This line declares two variables Id and Param that are assigned the parameters extracted from the URL using the useParams hook from the react-router-dom library.

  //    Handling userData
  let user = JSON.parse(sessionStorage.getItem("userData"));
  //This line retrieves the user data from the sessionStorage object using the getItem method and parses it using the JSON.parse method. The user data is stored as a string in sessionStorage and needs to be parsed before it can be used as an object.

  const [cats, setCats] = useState([]);

  useEffect(() => {
    // Send a GET request to the API endpoint
    axios
      .get(`http://192.168.26.15/itemcreation-test/api/selected-cats/${Id}`)
      .then((response) => {
        // Set the posts state with the data
        setCats(response.data.selectedcats);

        // Update the contentState to concatenate the cats data to choosedCategories
        setContentState((prev) => {
          return {
            ...prev,
            choosedCategories: [...response.data.selectedcats],
          };
        });
      })
      .catch((error) => {
        // Handle the error
        console.log(error);
      });
  }, [Id]);

  // handling states of content
  const [contentState, setContentState] = useState({
    loading: true,
    awaiting: false,
    contentData: [],
    Allergens: [],
    Dietary: [],
    options: [],
    queueUpdate: {},
    categories: [],
    productData: [],
    choosedAllergen: [],
    finalAllergenArray: [],
    choosedDietry: [],
    finalDietryArray: [],
    imagesView: [],
    log: {
      lookupcode: Id,
      action: `${user.name} Submitted the ${
        Param === "english"
          ? "English"
          : Param === "arabic"
          ? "Arabic"
          : Param === "finalContent"
          ? "Final"
          : ""
      } content data of product: ${Id} `,
      user: user.id != null ? user.id : "",
    },
    choosedCategories: [],
    categoryToPush: {
      Categoryid: "",
      label: "",
    },
    CatChoices: {
      header: "",
      category: "",
      subCategory: "",
    },
    optionTypes: [],
    optionValues: [],
    optionChoices: {
      type: "",
    },
  });
  /*This line initializes the component's state using the useState hook. The state object contains various properties used to manage the component's behavior and update the API. Here is a brief overview of the properties:
loading: a flag that indicates whether the component is currently loading data from the API.
awaiting: a flag that indicates whether the component is currently waiting for user input.
contentData: an array that holds the product content data retrieved from the API.
Allergens: an array that holds the allergen data retrieved from the API.
Dietary: an array that holds the dietary data retrieved from */
  // handling effects and fetching data
  useEffect(() => {
    const getContentData = async () => {
      try {
        let contentResponse = await axios.get(
          Param === "existing"
            ? `http://192.168.26.15/itemcreation-test/api/content/${Id}`
            : `http://192.168.26.15/itemcreation-test/api/all-content/${Id}`
        );
        let typesRes = await axios.get(
          "http://192.168.26.15/itemcreation-test/api/option-type"
        );
        let valuesRes = await axios.get(
          "http://192.168.26.15/itemcreation-test/api/option-value"
        );
        let imagesResponse = await axios.get(
          `http://192.168.26.15/itemcreation-test/api/photos/${Id}`
        );
        let responseProduct = await axios.get(
          `http://192.168.26.15/itemcreation-test/api/show-product/${Id}`
        );
        // console.log(responseProduct, "responseProduct");
        // console.log(responseProduct.data.data[0].sWebName, "responseProduct");
        if (contentResponse.data.Content.length > 0) {
          setContentState((prev) => {
            return {
              ...prev,
              loading: false,
              productData: contentResponse.data.productData,
              contentData: contentResponse.data.Content,
              Allergens: contentResponse.data.Allergen,
              optionTypes: typesRes.data.type,
              optionValues: valuesRes.data.value,
              Dietary: contentResponse.data.dietary,
              choosedCategories: contentResponse.data.Categories,
              categories: contentResponse.data.Category,
              options: contentResponse.data.Customizable_option,
              imagesView: imagesResponse.data.photos,
              finalAllergenArray:
                contentResponse.data.Content[0].Allergen &&
                contentResponse.data.Content[0].Allergen.trim() != ""
                  ? contentResponse.data.Content[0].Allergen.split(",")
                  : [],
              finalDietryArray:
                contentResponse.data.Content[0].Dietry &&
                contentResponse.data.Content[0].Dietry.trim() != ""
                  ? contentResponse.data.Content[0].Dietry.split(",")
                  : [],
              queueUpdate:
                Param === "english"
                  ? {
                      id: contentResponse.data.productData[0].id,
                      english_content: true,
                    }
                  : Param === "arabic"
                  ? {
                      arabic_content: true,
                      id: contentResponse.data.productData[0].id,
                    }
                  : Param === "finalContent"
                  ? {
                      checkup: true,
                      id: contentResponse.data.productData[0].id,
                      publish: 2,
                      arabic_content: true,
                    }
                  : "",
              buyingFlags: {
                id:
                  Param !== "existing" &&
                  contentResponse.data.productData[0].id,
                checkup: false,
                cRejected: false,
                campaign: false,
                ready: false,
              },
              isLoadingApprove: false,
              isLoadingReject: false,
            };
          });
        } else {
          setContentState((prev) => {
            return {
              ...prev,
              loading: false,
              productData: contentResponse.data.productData,
              contentData: [
                {
                  ItemID: contentResponse.data.productData[0].id,
                  suggestWebName: responseProduct.data.data[0].sWebName,
                  EnName: "",
                  EnDesc: contentResponse.data.productData[0].EnWebDes,
                  EnIngredients:
                    contentResponse.data.productData[0].EnIngredients,
                  ArName: "",
                  ArDesc: "",
                  ArIngredients: "",
                  MetaTitle: "",
                  MetaKeywords: "",
                  MetaDesc: "",
                  ProductSynonyms: "",
                  ArMetaTitle: "",
                  ArMetaKeywords: "",
                  ArMetaDesc: "",
                  ArProductSynonyms: "",
                  EnWeight: "",
                  ArWeight: "",
                  VideoURL: "",
                  Dietry: "",
                  Allergen: "",
                  EnCookingInstruction: "",
                  ArCookingInstruction: "",
                  EnBrand: "",
                  ArBrand: "",
                  EnPrepUsage: "",
                  ArPrepUsage: "",
                  EnStorage: "",
                  ArStorage: "",
                  EnPackaging: "",
                  ArPackaging: "",
                  EnOrigin: "",
                  ArOrigin: "",
                  userAr: Param === "arabic" ? user.id : "",
                  userEn: Param === "english" ? user.id : "",
                  user: Param === "finalContent" ? user.id : "",
                },
              ],
              Allergens: contentResponse.data.Allergen,
              Dietary: contentResponse.data.dietary,
              optionTypes: typesRes.data.type,
              imagesView: imagesResponse.data.photos,
              optionValues: valuesRes.data.value,
              existingCats: contentResponse.data.Categories,
              categories: contentResponse.data.Category,
              options: contentResponse.data.Customizable_option,
              queueUpdate:
                Param === "english"
                  ? {
                      id: contentResponse.data.productData[0].id,
                      english_content: true,
                    }
                  : Param === "arabic"
                  ? {
                      arabic_content: true,
                      id: contentResponse.data.productData[0].id,
                    }
                  : Param === "finalContent"
                  ? {
                      checkup: true,
                      id: contentResponse.data.productData[0].id,
                      publish: 2,
                      arabic_content: true,
                    }
                  : "",
            };
          });
        }
      } catch (error) {}
    };
    getContentData();
  }, [Id, Param, user.id]);
  /*This is a useEffect hook that is triggered when one of the dependencies (Id, Param, or user.id) changes. It contains an asynchronous function called getContentData() that makes several API calls using axios library to retrieve data from different endpoints.

Once all the API calls are completed successfully, the function updates the state of the component using setContentState() with the retrieved data. The state contains multiple properties such as loading, productData, contentData, Allergens, optionTypes, optionValues, Dietary, choosedCategories, categories, options, imagesView, finalAllergenArray, finalDietryArray, queueUpdate, buyingFlags, isLoadingApprove, and isLoadingReject. These properties are assigned values from the response of the API calls.

If the API call to retrieve contentResponse data returns an array of length greater than 0, then it means that the content already exists and the function updates the state with the retrieved data. Otherwise, if the length of the array is 0, it means that the content does not exist and the function creates a default object to populate the contentData state property. */
  // adding user key to content object in case of existing item
  if (Param === "existing" && contentState.contentData.length > 0) {
    contentState.contentData[0].user = user.id != null ? user.id : "";
  }
  //This code checks if Param is equal to "existing" and if the contentData array in contentState has at least one element. If these conditions are true, it sets the user property of the first element in contentData to either the id property of the user object (if it is not null) or an empty string.

  // Handling contentInputs onChange
  const contentInputOnChangeHandler = (e, index) => {
    // e.target.value = e.target.value.replace(/[’/`~!#*$@_%+=.^&(){}[\]|;:”<>?\\]/g, "");
    const { name, value } = e.target;
    const list = [...contentState.contentData];
    list[index][name] = value;
    setContentState((prev) => {
      return {
        ...prev,
        contentData: list,
      };
    });
  };
  //This function is called when the onChange event is triggered on an input field. It takes the event object and the index of the corresponding element in the contentData array. It extracts the name and value properties from the target element of the event, creates a copy of the contentData array, updates the name property of the element at the specified index with the new value, and updates the state with the new array.

  //    handling exist allergens
  if (contentState.finalAllergenArray.length > 0) {
    for (const item of contentState.finalAllergenArray) {
      const existAllergen = contentState.Allergens.find(
        (obj) => obj.AllergenId === item.trim()
      );
      const existItem = contentState.choosedAllergen.find(
        (item) => item.AllergenId === existAllergen.AllergenId
      );
      if (!existItem) {
        setContentState((prev) => {
          return {
            ...prev,
            choosedAllergen: [
              ...prev.choosedAllergen,
              {
                AllergenId: existAllergen.AllergenId,
                EnglishName: existAllergen.EnglishName,
              },
            ],
          };
        });
      }
    }
  }
  //This code checks if the finalAllergenArray property of contentState has at least one element. If it does, it loops through each element in the array and searches for an object in the Allergens array of contentState with a matching AllergenId property. If it finds a match and there isn't already an object with the same AllergenId property in the choosedAllergen array of contentState, it adds a new object with the AllergenId and EnglishName properties to the choosedAllergen array.

  //   turning the splitted allergen Array into a commasperated string for DB posting
  const allergenStringfy = useMemo(() => {
    if (contentState.finalAllergenArray.length > 0) {
      contentState.contentData[0].Allergen =
        contentState.finalAllergenArray.toString();
    }
  }, [contentState.finalAllergenArray, contentState.contentData]);
  //This code uses the useMemo hook to create a memoized version of a function that updates the Allergen property of the first element in the contentData array of contentState with a comma-separated string of the values in the finalAllergenArray property of contentState. This function will only be re-executed if the finalAllergenArray or contentData properties of contentState change.

  // handling allergen onchange function
  const allergenHandler = (e) => {
    const newItem = {
      AllergenId: e.target.value,
      EnglishName: e.target.selectedOptions[0].innerText,
    };
    const existItem = contentState.choosedAllergen.find(
      (item) => item.AllergenId === newItem.AllergenId
    );
    //   Checking if the allergen has been selected before or no
    if (!existItem && e.target.value !== "") {
      setContentState((prev) => {
        return {
          ...prev,
          finalAllergenArray: [...prev.finalAllergenArray, newItem.AllergenId],
          choosedAllergen: [...prev.choosedAllergen, newItem],
        };
      });
    } else {
      // Alerting that allergen already exists
      swal(
        `Hi ${user.name}`,
        `You already choosed ${newItem.EnglishName} before`,
        "error"
      );
      e.target.value = "";
    }
  };
  //This event handler function handles changes to an allergen selection dropdown. It creates a new object newItem containing the AllergenId and EnglishName of the selected option. Then, it checks if the allergen has already been selected before by searching for an object with the same AllergenId in contentState.choosedAllergen. If the allergen hasn't been selected before and the selected value is not empty, it updates the state by adding the AllergenId to contentState.finalAllergenArray and adding the newItem object to contentState.choosedAllergen. Otherwise, it displays an error message using the swal library and resets the selected value.

  //    handling deleting  allergen
  const removeAllergenHandler = (index) => {
    let list = [...contentState.choosedAllergen];
    let speratedList = [...contentState.finalAllergenArray];
    list.splice(index, 1);
    speratedList.splice(index, 1);
    setContentState((prev) => {
      return {
        ...prev,
        choosedAllergen: list,
        finalAllergenArray: speratedList,
      };
    });
  };
  //This event handler function handles removal of an allergen selection from a list. It creates two new arrays list and speratedList by copying the current state arrays contentState.choosedAllergen and contentState.finalAllergenArray using the spread operator. Then, it removes the item at index index from both arrays using the splice() method. Finally, it updates the state by setting contentState.choosedAllergen to list and contentState.finalAllergenArray to speratedList.

  //    End of handling Allergens

  // handling Dietary onchange function
  const dietaryHandler = (e) => {
    const newItem = {
      DietryId: e.target.value,
      EnglishName: e.target.selectedOptions[0].innerText,
    };
    const existItem = contentState.choosedDietry.find(
      (item) => item.DietryId === newItem.DietryId
    );
    //   Checking if the dietary has been selected before or no
    if (!existItem && e.target.value !== "") {
      setContentState((prev) => {
        return {
          ...prev,
          finalDietryArray: [...prev.finalDietryArray, newItem.DietryId],
          choosedDietry: [...prev.choosedDietry, newItem],
        };
      });
    } else {
      // Alerting that dietary already exists
      swal(
        `Hi ${user.name}`,
        `You already choosed ${newItem.EnglishName} before`,
        "error"
      );
      e.target.value = "";
    }
  };
  /*The function takes an event object e as input.
It creates a new object newItem with two properties: DietryId and EnglishName. The value of DietryId is the selected option's value and the value of EnglishName is the selected option's inner text.
It checks if the newItem object already exists in the choosedDietry array using the find() method.
If newItem doesn't exist and the selected option's value is not empty, the function updates the state using the setContentState() function. It spreads the previous state (prev) and updates the finalDietryArray and choosedDietry arrays by adding the new DietryId and newItem objects respectively.
If newItem already exists or the selected option's value is empty, it shows an error message using the swal() function and sets the selected option's value to an empty string. */
  // Handling removing dietary
  const removeDietaryHandler = (index) => {
    let list = [...contentState.choosedDietry];
    let speratedList = [...contentState.finalDietryArray];
    list.splice(index, 1);
    speratedList.splice(index, 1);
    setContentState((prev) => {
      return {
        ...prev,
        finalDietryArray: speratedList,
        choosedDietry: list,
      };
    });
  };
  /*The function takes an index as input.
It creates two new arrays list and speratedList by spreading the choosedDietry and finalDietryArray arrays respectively.
It removes the item at the specified index from both arrays using the splice() method.
It updates the state using the setContentState() function. It spreads the previous state (prev) and updates the finalDietryArray and choosedDietry arrays by setting them to speratedList and list respectively. */
  //    handling exist Dietary using useMemo
  if (contentState.finalDietryArray.length > 0) {
    // iterate through the finalDietryArray
    for (const item of contentState.finalDietryArray) {
      // find the corresponding object in the Dietary array
      const existDietry = contentState.Dietary.find(
        (obj) => obj.DietryId === item.trim()
      );
      // check if the object exists in choosedDietry
      const existItem = contentState.choosedDietry.find(
        (itemD) => itemD.DietryId === existDietry.DietryId
      );
      // if the object doesn't exist in choosedDietry, add it
      if (!existItem) {
        setContentState((prev) => {
          return {
            ...prev,
            choosedDietry: [
              ...prev.choosedDietry,
              {
                DietryId: existDietry.DietryId,
                EnglishName: existDietry.EnglishName,
              },
            ],
          };
        });
      }
    }
  }
  //In summary, this code block updates the contentState object to ensure that the choosedDietry array contains all of the dietary options selected by the user.
  const existDietaryCommaHandler = useMemo(() => {
    if (contentState.finalDietryArray.length > 0) {
      contentState.contentData[0].Dietry =
        contentState.finalDietryArray.toString();
    }
  }, [contentState.contentData, contentState.finalDietryArray]);
  // this code is creating a memoized value that sets a string representation of contentState.finalDietryArray to a property of the first element in contentState.contentData if contentState.finalDietryArray has any elements. It will only recompute this value when either contentState.contentData or contentState.finalDietryArray changes.
  //    End of handling Dietaries

  // adding userId to content data object
  if (contentState.contentData.length > 0) {
    if (Param === "english") {
      contentState.contentData[0].userEn = user.id;
    } else if (Param === "arabic") {
      contentState.contentData[0].userAr = user.id;
    } else if (Param === "finalContent") {
      contentState.contentData[0].user = user.id;
    }
  }
  //checks whether the length of the contentData array in the contentState object is greater than zero. If it is, the function checks the value of the Param variable. If it is "english", the function assigns the id of the user object to the userEn property of the first element in the contentData array. If Param is "arabic", the function assigns the id of the user object to the userAr property of the first element in the contentData array. If Param is "finalContent", the function assigns the id of the user object to the user property of the first element in the contentData array.

  // handling categories on change
  const categoryOnChangeHandler = (e) => {
    setContentState((prev) => {
      return {
        ...prev,
        CatChoices: { ...prev.CatChoices, [e.target.name]: e.target.value },
        categoryToPush: {
          Categoryid: e.target.value,
          label: e.target.selectedOptions[0].innerText,
        },
      };
    });
    if (e.target.name === "header") {
      setContentState((prev) => {
        return {
          ...prev,
          CatChoices: { ...prev.CatChoices, category: "", subCategory: "" },
        };
      });
    }
  };
  /*an event handler function that is called when the onChange event is triggered on an input element. The function receives an event object as its argument. Within the function, the setContentState function is called with a callback function that returns a new state object. The new state object is created by spreading the previous state (prev) and updating the CatChoices property with a new object that spreads the previous CatChoices object and updates the value of the property with the name of the target input element to the value of the target input element. Additionally, the function updates the categoryToPush property with a new object that contains the Categoryid property set to the value of the target input element and the label property set to the text of the selected option in the target input element.

   The function then checks if the name property of the target input element is "header". If it is, the setContentState function is called again with a callback function that returns a new state object that spreads the previous state (prev) and updates the CatChoices property with a new object that spreads the previous CatChoices object and sets the category and subCategory properties to an empty string. This effectively resets the values of the category and subCategory properties to an empty string when the header input element is changed. */

  // adding new category on click add
  const onAddCategoryHandler = () => {
    if (contentState.categoryToPush.Categoryid !== "") {
      const existItem = contentState.choosedCategories.find(
        (item) => item.Categoryid === contentState.categoryToPush.Categoryid
      );
      if (!existItem) {
        setContentState((prev) => {
          return {
            ...prev,
            choosedCategories: [
              ...prev.choosedCategories,
              {
                itemid: contentState.contentData[0].ItemID,
                Categoryid: contentState.categoryToPush.Categoryid,
                lookupcode: Id,
                label: `${contentState.categoryToPush.label}`,
              },
            ],
            CatChoices: { header: "", category: "", subCategory: "" },
            categoryToPush: { Categoryid: "", label: "" },
          };
        });
      } else {
        swal(
          `Hi ${user.name}`,
          `You already choosed ${contentState.categoryToPush.label} before`,
          "error"
        );
        setContentState((prev) => {
          return {
            ...prev,
            CatChoices: { header: "", category: "", subCategory: "" },
            categoryToPush: { Categoryid: "", label: "" },
          };
        });
      }
    }
  };
  //is responsible for adding a new category to the list of chosen categories if it does not already exist. It first checks if the Categoryid property in categoryToPush is not an empty string, which indicates that a category has been selected. If a category has been selected, it checks if an item with the same Categoryid already exists in the choosedCategories array. If it doesn't, a new object is added to the choosedCategories array with the Categoryid, label, and other necessary information. If it does exist, a warning message is displayed using the swal function, and the CatChoices and categoryToPush properties are reset to empty objects.

  // removing category
  async function removeExistCat(index) {
    let list = [...contentState.choosedCategories];
    list.splice(index, 1);
    setContentState((prev) => {
      return {
        ...prev,
        choosedCategories: list,
      };
    });
  }
  // is an asynchronous function that is used to remove a chosen category from the choosedCategories array. It first creates a copy of the choosedCategories array using the spread operator, then uses the splice() method to remove the item at the specified index. Finally, the setContentState function is used to update the choosedCategories array with the modified copy.
  // handling new and existing options

  // option type onChange handler
  const optionTypeOnChange = (e) => {
    setContentState((prev) => {
      return {
        ...prev,
        optionChoices: { type: e.target.value },
      };
    });
  };
  // function is an event handler that is triggered when the user selects an option type from a dropdown menu. It takes the event object as its argument, and updates the optionChoices property of the contentState object to reflect the user's selection.

  // add option onChange
  const optionOnChangeHandler = (e) => {
    if (e.target.value !== "") {
      const existItem = contentState.options.find(
        (item) => item.OptionID === e.target.value
      );
      if (!existItem) {
        setContentState((prev) => {
          return {
            ...prev,
            options: [
              ...prev.options,
              {
                ItemID: contentState.contentData[0].ItemID,
                OptionID: e.target.value,
              },
            ],
          };
        });
      } else {
        swal(
          `Hi ${user.name}`,
          `You already choosed ${e.target.selectedOptions[0].innerText} before`,
          "error"
        );
        setContentState((prev) => {
          return {
            ...prev,
            optionChoices: { type: "" },
          };
        });
      }
    }
  };
  // function is an event handler that is triggered when the user selects an option from a dropdown menu. It first checks if the selected option has already been added to the list of options for the item. If not, it adds the option to the list. If the option has already been added, it displays an error message using the swal function and resets the selected option. It updates the options property of the contentState object with the new list of options. The ItemID property of the option object is set to the ItemID of the current item, and the OptionID property is set to the ID of the selected option.

  // handling Exist Options title with useMemo
  const optionTitleHandler = useMemo(() => {
    contentState.options.forEach((item) => {
      const existOption = contentState.optionValues.find((value) => {
        return value.RecID === item.OptionID;
      });
      if (existOption) {
        item.title = existOption.Title;
      }
    });
  }, [contentState.options, contentState.optionValues]);
  /*It uses useMemo hook to create a memoized version of the function that will only be re-executed when the contentState.options and contentState.optionValues change.

The function loops through each item in the contentState.options array, and for each item it checks if an option with the same RecID exists in the contentState.optionValues array. If such an option exists, it sets the title property of the item to the Title of that option.

The purpose of this function is to update the title property of each item in the contentState.options array based on the corresponding option in the contentState.optionValues array. This allows the title to be displayed in the UI instead of the RecID of the option. By memoizing the function, it will only be executed when necessary, which can improve performance. */
  // exist option delete onClcik handler
  const handleExistOptionDelete = async (index) => {
    const list = [...contentState.options];
    list.splice(index, 1);
    setContentState((prev) => {
      return {
        ...prev,
        options: list,
      };
    });
  };
  //The forEach() method is being used to iterate over the contentState.options and contentState.choosedCategories arrays. For each item in these arrays, two properties are being added: user and newItem for contentState.options, and user and lookupcode for contentState.choosedCategories. These properties are being set to values obtained from the user object and Id variable, respectively.

  contentState.options.forEach((item) => {
    item.user = user.id;
    item.newItem = 0;
  });
  //The forEach() method is being used to iterate over the contentState.options and contentState.choosedCategories arrays. For each item in these arrays, two properties are being added: user and newItem for contentState.options, and user and lookupcode for contentState.choosedCategories. These properties are being set to values obtained from the user object and Id variable, respectively.

  contentState.choosedCategories.forEach((item) => {
    item.user = user.id;
    item.lookupcode = Id;
  });
  // Submitting the form
  async function formSubmit(e) {
    e.preventDefault();
    setContentState((prev) => {
      return {
        ...prev,
        awaiting: true,
      };
    });
    if (Param === "existing") {
      try {
        let contentResponse = await axios.post(
          `http://192.168.26.15/itemcreation-test/api/update-content`,
          {
            ItemID: contentState.contentData[0].ItemID,
            content: contentState.contentData[0],
            category: contentState.choosedCategories,
            options: contentState.options,
          }
        );
        if (contentResponse) {
          setContentState((prev) => {
            return {
              ...prev,
              awaiting: false,
            };
          });
          swal({
            title: `Hi ${user.name}`,
            text: "Data updated successfully  ",
            icon: "success",
            button: false,
            timer: 1200,
          });

          setTimeout(() => {
            navigate("/mainpage/content/existing", { replace: true });
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        setContentState((prev) => {
          return {
            ...prev,
            awaiting: false,
          };
        });
        swal({
          title: `Hi ${user.name}`,
          text: "An error occurred please refresh the page and try again  ",
          button: false,
          timer: 1200,
          icon: "error",
        });
      }
    } else if (Param !== "Acheckup") {
      try {
        let queueResponse = await axios.post(
          `http://192.168.26.15/itemcreation-test/api/update-queue`,
          contentState.queueUpdate
        );
        let responseLog = await axios.post(
          "http://192.168.26.15/itemcreation-test/api/log",
          contentState.log
        );
        let contentResponse = await axios.post(
          `http://192.168.26.15/itemcreation-test/api/insert-update`,
          {
            spFlag: Param == "finalContent" ? 1 : 0,
            ItemID: contentState.contentData[0].ItemID,
            content: contentState.contentData[0],
            category: contentState.choosedCategories,
            options: contentState.options,
          }
        );
        console.log(contentResponse);
        if (queueResponse && responseLog && contentResponse) {
          setContentState((prev) => {
            return {
              ...prev,
              awaiting: false,
            };
          });
          swal({
            title: `Hi ${user.name}`,
            text: "Data updated successfully  ",
            icon: "success",
            button: false,
            timer: 1200,
          });

          setTimeout(() => {
            navigate("/mainpage/content/queue", { replace: true });
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        setContentState((prev) => {
          return {
            ...prev,
            awaiting: false,
          };
        });
        swal({
          title: `Hi ${user.name}`,
          text: "An error occurred please refresh the page and try again  ",
          button: false,
          timer: 1200,
          icon: "error",
        });
      }
    } else {
      if (e.target.innerText === "Approve") {
        setContentState((prev) => {
          return {
            ...prev,
            isLoadingApprove: true,
          };
        });
        contentState.log.action = `${user.name} Approved the content data of product: ${Id} `;
        contentState.buyingFlags.checkup = true;
        contentState.buyingFlags.cRejected = false;
        contentState.buyingFlags.campaign = false;
        contentState.buyingFlags.ready = true;
        if (contentState.buyingFlags.ready) {
          try {
            let queueResponse = await axios.post(
              `http://192.168.26.15/itemcreation-test/api/update-queue`,
              contentState.buyingFlags
            );
            let responseLog = await axios.post(
              "http://192.168.26.15/itemcreation-test/api/log",
              contentState.log
            );
            if (queueResponse && responseLog) {
              setContentState((prev) => {
                return {
                  ...prev,
                  isLoadingApprove: false,
                };
              });
              swal({
                title: `Hi ${user.name}`,
                text: "Data Approved successfully  ",
                icon: "success",
                button: false,
                timer: 1200,
              });
              setTimeout(() => {
                navigate("/mainpage/content/Aqueue", { replace: true });
              }, 1500);
            }
          } catch (error) {
            setContentState((prev) => {
              return {
                ...prev,
                isLoadingApprove: false,
              };
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
      } else if (e.target.innerText === "Reject") {
        setContentState((prev) => {
          return {
            ...prev,
            isLoadingReject: true,
          };
        });
        contentState.log.action = `${user.name} Rejected  the content data of product: ${Id} `;
        contentState.buyingFlags.checkup = false;
        contentState.buyingFlags.cRejected = true;
        contentState.buyingFlags.campaign = false;
        contentState.buyingFlags.ready = false;
        if (contentState.buyingFlags.cRejected) {
          try {
            let queueResponse = await axios.post(
              `http://192.168.26.15/itemcreation-test/api/update-queue`,
              contentState.buyingFlags
            );
            let responseLog = await axios.post(
              "http://192.168.26.15/itemcreation-test/api/log",
              contentState.log
            );
            if (queueResponse && responseLog) {
              setContentState((prev) => {
                return {
                  ...prev,
                  isLoadingReject: false,
                };
              });
              swal({
                title: `Hi ${user.name}`,
                text: "Data Rejected successfully  ",
                icon: "success",
                button: false,
                timer: 1200,
              });
              setTimeout(() => {
                navigate("/mainpage/content/Aqueue", { replace: true });
              }, 1500);
            }
          } catch (error) {
            setContentState((prev) => {
              return {
                ...prev,
                isLoadingReject: false,
              };
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
      }
    }
  }
  /* handling form submission in a web application. When the form is submitted, the function prevents the default form submission action, sets some state variables to indicate that the submission is awaiting processing, and then proceeds to send a POST request to a server using the Axios library.

If the Param variable is "existing", the code sends a request to update some content using the axios.post() method, and then shows a success message to the user. If an error occurs, an error message is displayed instead.

Otherwise, the code sends a series of requests to update the content, the queue, and the logs, depending on the value of Param. If all of these requests succeed, a success message is shown, and the user is redirected to the appropriate page.

Finally, if the Param variable is "Acheckup", the code sets some buying flags based on whether the user has approved or rejected the content, sends a request to update the queue and the logs, and shows a success message if the request succeeds.

Regenerate response */
  // images handler
  const downloadImage = (photo) => {
    saveAs(
      `http://192.168.26.15/itemcreation-test/uploads/${photo}`,
      `${photo}`
    ); // Put your image url here.
  };
  /*This is a JavaScript function that downloads an image from a given URL and saves it with a specified filename. It uses the saveAs() function, which is not a built-in JavaScript function but is likely a method provided by a library or framework.

 The downloadImage function takes a photo parameter, which is the filename of the image to be downloaded. It then constructs a URL using the http://192.168.26.15/itemcreation-test/uploads/ base URL and the provided filename. Finally, it passes the constructed URL and filename to the saveAs() function to initiate the download.

 It's worth noting that the URL http://192.168.26.15/itemcreation-test/uploads/ is a local network address, and the function assumes that the image is stored on a server located at that address. If the image is hosted elsewhere, the URL will need to be updated accordingly. */
  return (
    <Fragment>
      {contentState.loading ? (
        <Spinner />
      ) : (
        <Frame
          headerLabel={`${
            Param === "arabic"
              ? "Arabic"
              : Param === "english"
              ? "English"
              : Param === "finalContent"
              ? "Final"
              : Param === "Acheckup"
              ? "Review"
              : "Existing"
          } Content`}
        >
          <ContentForm
            isLoadingReject={
              Param === "Acheckup" ? contentState.isLoadingReject : ""
            }
            isLoadingApprove={
              Param === "Acheckup" ? contentState.isLoadingApprove : ""
            }
            imagesView={contentState.imagesView}
            downloadImage={downloadImage}
            formSubmit={formSubmit}
            productData={contentState.productData}
            awaiting={contentState.awaiting}
            handleExistOptionDelete={handleExistOptionDelete}
            options={contentState.options}
            optionOnChangeHandler={optionOnChangeHandler}
            optionChoices={contentState.optionChoices}
            optionValues={contentState.optionValues}
            optionTypes={contentState.optionTypes}
            optionTypeOnChange={optionTypeOnChange}
            removeExistCat={removeExistCat}
            choosedCategories={contentState.choosedCategories}
            onAddCategoryHandler={onAddCategoryHandler}
            categoryOnChangeHandler={categoryOnChangeHandler}
            CatChoices={contentState.CatChoices}
            removeAllergenHandler={removeAllergenHandler}
            removeDietaryHandler={removeDietaryHandler}
            choosedAllergen={contentState.choosedAllergen}
            allergenHandler={allergenHandler}
            dietaryHandler={dietaryHandler}
            choosedDietry={contentState.choosedDietry}
            contentInputOnChange={contentInputOnChangeHandler}
            Param={Param}
            lookupCode={Id}
            existNames={contentState.existingNames}
            Allergens={contentState.Allergens}
            Dietary={contentState.Dietary}
            categories={contentState.categories}
            existOptions={contentState.existingOptions}
            contentData={contentState.contentData}
          />
        </Frame>
      )}
    </Fragment>
  );
};

export default ContentContainer;
