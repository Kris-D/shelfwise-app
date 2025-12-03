import React from "react";
import "./ChangePassword.scss";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import agent from "../../services/agent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Card from "../card/Card";

const ChangePassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
    watch,
  } = useForm();
  const password = watch("password");

  const changeUserPassword = async (userPasswordData) => {
    // console.log("userPasswordData:", userPasswordData);
    const response = await agent.user.changeUserPassword(userPasswordData);
    return response;
  };
  const queryClient = useQueryClient();

  const { mutate: changeUserPasswordMutation, isPending } = useMutation({
    mutationFn: changeUserPassword,
    onSuccess: (response) => {
      queryClient.invalidateQueries("user");

      if (response.status === 400) {
        // console.log("Error Login:", response.message);
        toast.error(response.message);
      } else {
        // console.log("response", response.data);
        toast.success(response.data);
        navigate("/profile");
        reset();
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
  const onSubmit = (data) => {
    // Remove confirmPassword before submission (just in case)
    delete data.confirmPassword;
    // console.log("data:", data);

    // Add the password to the userData object
    changeUserPasswordMutation(data);
  };
  // Trigger toast on validation error
  const onError = (error) => {
    if (error.oldPassword) toast.error(error.oldPassword.message);
    if (error.password) toast.error(error.password.message);
    if (error.confirmPassword) toast.error(error.confirmPassword.message);
  };

  return (
    <div className="change-password">
      <Card cardClass={"password-card"}>
        <h3>Change Password</h3>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="--form-control"
        >
          <input
            type="password"
            placeholder="OldPassword"
            required
            name="oldPassword"
            {...register("oldPassword", {
              required: "Password is required",
            })}
          />
          <input
            type="password"
            placeholder="New Password"
            required
            name="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password should be at least 8 characters long",
              },
            })}
          />
          <input
            type="password"
            placeholder="Confirm New password"
            required
            name="confirm password"
            {...register("confirmPassword", {
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          <button
            type="submit"
            className="--btn --btn-primary"
            disabled={isPending}
            style={{
              cursor: isPending ? "not-allowed" : "pointer",
            }} 
          >
            {(isPending) ? "Saving..." : "Change Password"}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
