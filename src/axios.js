import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.dng-project.org/api", 
});

export default instance;
