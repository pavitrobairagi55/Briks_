import axios from "axios";
import { API_URL } from "../envirement";
export default axios.create({
  baseURL: API_URL,
});
