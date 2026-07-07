import axios from 'axios';

const api = axios.create({
    baseURL: process.env.SERVER_SITE
})

export default api;