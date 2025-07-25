import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://australian-visa-tracker.onrender.com/api'
})
