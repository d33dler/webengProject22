import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.178.11:8090/nrp/",
    headers: {
        "Content-type": "application/json"
    },
    mode: "cors"
})