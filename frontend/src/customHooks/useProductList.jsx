import { useQuery } from "@tanstack/react-query";
import agent from "../services/agent";

const getProductList = async () => {
  const response = await agent.product.productList();
  return response;
};
export const useProductList = () => {
  const { isSuccess, data: products, isPending } = useQuery({
    queryKey: ["productList"],
    queryFn: () => getProductList(),
  });
  

  return { products, isSuccess, isPending };
};