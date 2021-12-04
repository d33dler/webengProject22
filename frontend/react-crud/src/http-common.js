import axios from "axios";

export default axios.create({
    baseURL: "http://project-nrp/api",
    headers: {
        "Content-type": "application/json"
    }
})