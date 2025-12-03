import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import agent from "../../services/agent";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectName, SET_LOGIN } from "../../redux/features/auth/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userName = useSelector(selectName);
  const userLogout = async () => {
    const response = await agent.auth.logout();
    return response;
  };
  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending } = useMutation({
    mutationFn: userLogout,
    onSuccess: (response) => {
      queryClient.invalidateQueries("user");

      if (response.status === "400") {
        // console.log("Error Login:", response.message);
        toast.error(response.message);
      } else {
        // console.log("response", response.data);
        dispatch(SET_LOGIN(false));
        sessionStorage.clear();
        localStorage.clear();
        navigate("/login");
        toast.success("Logout successfully");
      }
    },
    // On error, show an error toast
    onError: (error) => {
      const errorMessage =
        (error?.response &&
          error?.response?.data &&
          error?.response?.data?.message) ||
        error?.message ||
        error?.toString() ||
        "Something went wrong";
      // console.error("Error Login:", errorMessage);
      toast.error(errorMessage);
    },
  });
  const handleLogout = () => {
    logoutMutation();
  };

  return (
    <div className="--pad header">
      <div className="--flex-between">
        <h3>
          <span className="--fw-thin">Welcome, </span>
          <span className="--color-danger">{userName}</span>
        </h3>
        <button
          className="--btn --btn-danger"
          onClick={handleLogout}
          disabled={isPending}
          style={{
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          Logout
        </button>
      </div>
      <hr />
    </div>
  );
};

export default Header;
