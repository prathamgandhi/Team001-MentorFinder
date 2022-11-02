import axios from "axios";

let baseURL = "http://192.168.1.6:8000";
// if (process.env.NODE_ENV === "production") {
//   baseURL = "https://App-name.herokuapp.com";
// } else {
//   baseURL = "http://localhost:8000";
// }

export default axios.create({
  baseURL,
});
