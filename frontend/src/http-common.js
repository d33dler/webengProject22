import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.178.11:8080/nrp/",
    headers: {
        "Content-type": "application/json"
    }
})