import axios from "axios";
export const fetchDataItem = async (Id) => {
  let response = await axios.get(`http://192.168.26.15/itemcreation-test/api/all-data/${Id}`);
  return response;
};
/*
The function fetchDataItem takes one parameter, Id, which is used to construct the URL for the GET request. The endpoint that the function is calling is http://192.168.26.15/itemcreation-test/api/all-data/ with the Id appended to the end.

The function uses axios.get to make the GET request to the constructed URL. Once the response is received, the function returns the entire response object.

This function can be used in a React component to fetch data from the specified endpoint. By importing and using this function, the component can make an HTTP GET request to the endpoint and use the data received from the response to update its state and/or render content.
*/
