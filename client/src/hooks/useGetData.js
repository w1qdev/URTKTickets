import { useState, useEffect } from 'react';
import axios from 'axios';


const useGetData = (serverUrl, params) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(serverUrl, { params });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Очистка данных при размонтировании компонента
    return () => setData(null);
  }, [serverUrl, params]);

  const updateData = async () => {
    try {
      const response = await axios.get(serverUrl, { params });
      setData(response.data);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return [data, updateData];
};

export default useGetData;