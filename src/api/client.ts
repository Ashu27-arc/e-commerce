import axios from 'axios';
import { Product } from '../types';

const apiClient = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});

export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/products');
  return response.data;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>('/products/categories');
  return response.data;
};

export default apiClient;
