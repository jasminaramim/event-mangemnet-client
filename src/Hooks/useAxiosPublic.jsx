import axios from 'axios';

const useAxiosPublic = () => {
  const instance = axios.create({
    baseURL: 'https://event-mangemnet-server-5.onrender.com',
  });
  return instance;
};

export default useAxiosPublic;