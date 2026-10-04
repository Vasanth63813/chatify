import axios from 'axios';

export const axios=axios.create({
    baseUrl:"http://localhost:3000/api",
    withCredentials:true,
})