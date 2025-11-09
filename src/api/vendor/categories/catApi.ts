import axiosInstance from "@/api/axiosInstances";

export const createCategory = async (catData: unknown) => {
  const response = await axiosInstance.post("vendors/categories", catData);
  return response.data;
};

export const getCategories = async () => {
  const response = await axiosInstance.get("vendors/categories");
  return response.data;
};

export const updateCategory = async ({
  id,
  catData,
}: {
  id: string;
  catData: unknown;
}) => {
  const response = await axiosInstance.patch(
    `/vendors/categories/${id}`,
    catData
  );
  return response.data;
};

export const getOneCategory = async (id: string) => {
  const response = await axiosInstance.get(`/vendors/categories/${id}`);
  return response.data;
};
