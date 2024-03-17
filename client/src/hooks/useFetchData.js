import { useState } from 'react';
import axios from 'axios';

const useDataApi = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (requestData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(url, requestData);

      if (!response.data) {
        throw new Error('Ошибка: Нет данных в ответе сервера');
      }

      setData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchData };
};

export default useDataApi;