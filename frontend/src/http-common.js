import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:6868/nrp/",
    headers: {'Access-Control-Allow-Origin': process.env.REACT_APP_API_BASE_URL},
})