import axios from 'axios';

const API_URL = 'http://localhost:5000/api/calculators';

//СВЯЗЬ С РОУТЕРОМ
export const getCalculators = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getCalculator = async (type) => {
  const response = await axios.get(`${API_URL}/type/${type}`);
  return response.data;
};

export const createCalculator = async (calculator) => {
  const response = await axios.post(API_URL, calculator);
  return response.data;
};

export const updateCalculator = async (id, calculator) => {
  const response = await axios.put(`${API_URL}/${id}`, calculator);
  return response.data;
};

export const deleteCalculator = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};