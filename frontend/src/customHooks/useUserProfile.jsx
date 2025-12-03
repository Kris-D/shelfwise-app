import { useQuery } from "@tanstack/react-query";
import agent from "../services/agent";



const getUserProfile = async () => {
  const response = await agent.user.userProfile();
  return response;
};

export const useUserProfile = () => {
  const { isSuccess, data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserProfile(),
  });
  

  return { user, isSuccess, isPending };
};