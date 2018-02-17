import axios from "axios";

const instance = axios.create({
    // baseURL:'https://azzab.riseup.co/api/auth/'
    baseURL:'http://localhost:3000/api/auth/'
});

export default instance;