import { useEffect } from "react"
import { SET_LOGIN } from "../redux/features/auth/authSlice";
import { useLoginStatus } from "./useLoginStatus";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useRedirectLoggedOutUser = (path, enabled = true) => {
   const navigate = useNavigate();
  const { loginStatus, isSuccess } = useLoginStatus(enabled);

  useEffect(() => {
    const timeout = setTimeout(() => {
    if (isSuccess && loginStatus === false) {
      toast.info("Session expired, please login to access this page");
      navigate(path);
    }
  }, 300); // short delay to give cookies time to sync

  return () => clearTimeout(timeout);
}, [isSuccess, loginStatus, navigate, path]);
};
   


export default useRedirectLoggedOutUser