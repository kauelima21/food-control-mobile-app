import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://wwpzrzjc8h.execute-api.sa-east-1.amazonaws.com/dev',
});
