import { useQuery } from "@tanstack/react-query";
import { SET_LOGIN } from "../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import agent from "../services/agent";

const getLoginStatus = async () => {
  const response = await agent.auth.getLoginStatus();
  return response.data;
};

export const useLoginStatus = (enabled = true) => {
  const dispatch = useDispatch();
  const { isSuccess, data: loginStatus } = useQuery({
    queryKey: ["loginStatus"],
    queryFn: () => getLoginStatus(),
    enabled,
  });
  useEffect(() => {
    //  console.log("loginStatus",loginStatus)
    if (isSuccess) {
      dispatch(SET_LOGIN(loginStatus));
    }
  }, [isSuccess, loginStatus, dispatch]);

  return { loginStatus, isSuccess };
};
