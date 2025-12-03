import { useQuery } from "@tanstack/react-query";
import agent from "../services/agent";



const getSingleProduct = async (productId) => {
  const response = await agent.product.getSingleProduct(productId);
  return response;
};
export const useSingleProduct = ({productId}= {}) => {
  const { isSuccess, data: product, isPending } = useQuery({ 
  queryKey: ["product", productId],
  queryFn: () => getSingleProduct(productId),
  enabled: !!productId,
  });
  

  return { product, isSuccess, isPending };
};