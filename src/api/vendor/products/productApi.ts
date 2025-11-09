import axiosInstance from "@/api/axiosInstances";

export const createProduct = async (productData: unknown) => {
  const response = await axiosInstance.post("vendors/products", productData);
  return response.data;
};

export const getProducts = async () => {
  const response = await axiosInstance.get("vendors/products");
  return response.data;
};

export const getOneProduct = async (id: string) => {
  const response = await axiosInstance.get(`/vendors/products/${id}`);
  return response.data;
};

export const updateProduct = async ({
  id,
  productData,
}: {
  id: string;
  productData: unknown;
}) => {
  const response = await axiosInstance.patch(
    `/vendors/products/${id}`,
    productData
  );
  return response.data;
};
