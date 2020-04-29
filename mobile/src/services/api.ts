import axios from 'axios';

const localIP = '192.168.0.17';

const api = axios.create({
  baseURL: `http://${localIP}:3333`,
});

export default api;
