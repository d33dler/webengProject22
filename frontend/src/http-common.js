import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:6868/nrp/",
    headers: {
        "Accept" : "application/json" ,
        "Content-type": "application/json",
        'Access-Control-Allow-Origin': process.env.REACT_APP_API_BASE_URL
    },
})