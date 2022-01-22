import axios from "axios";

export default axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8090/nrp/",
    headers: {
        "Accept" : "application/json" ,
        "Content-type": "application/json"
    },
    mode: "cors"
})