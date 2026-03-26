
import axiosInstance from "@/api/axiosInstances";

export const getRiders = async () => {
  const response = await axiosInstance.get('/riders');
  return response.data;
};

export const getOneRider = async (id: string) => {
  const response = await axiosInstance.get(`/riders/${id}`);
  return response.data;
};


export const riderAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/riders/${id}/${action}`);
  return response.data;
};


export const riderWalletAction = async (id: string, action: string) => {
 
  const response = await axiosInstance.patch(`/riders/${id}/wallet`, { action });
  return response.data;
};

export const riderAccountAction = async (id: string, action: string) => {

  const response = await axiosInstance.patch(`/riders/${id}/account`, { action });
  return response.data;
};






