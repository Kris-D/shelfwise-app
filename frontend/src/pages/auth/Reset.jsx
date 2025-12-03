import { Link, useParams } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { MdPassword } from "react-icons/md";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../services/agent";

const Reset = () => {
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
    watch,
  } = useForm();
  const password = watch("password");
  const { resetToken } = useParams();

  const userResetPassword = async (userData) => {
    // console.log("userData:", userData);
    // console.log("resetToken:", resetToken);
    const response = await agent.auth.resetPassword(userData, resetToken);
    return response;
  };

  const queryClient = useQueryClient();

  const { mutate: resetPasswordMutation, isPending } = useMutation({
    mutationFn: userResetPassword,
    onSuccess: (response) => {
      queryClient.invalidateQueries("user");

      if (response.status === "400") {
        // console.log("Error Login:", response.message);
        toast.error(response.message);
      } else {
        // console.log("response", response.data);

        toast.success(response.message);
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
    // console.log("resetToken:", resetToken);
    // Add the password to the userData object
    resetPasswordMutation(data);
  };
  // Trigger toast on validation error
  const onError = (error) => {
    if (error.password) toast.error(error.password.message);
    if (error.confirmPassword) toast.error(error.confirmPassword.message);
  };

  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <MdPassword size={35} color="#999" />
          </div>
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
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
              className="--btn --btn-primary --btn-block"
              type="submit"
              disabled={isPending}
              style={{
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              Reset Password
            </button>
            <div className={styles.links}>
              <p>
                <Link to="/"> - Home</Link>
              </p>
              <p>
                <Link to="/login">- Login</Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Reset;
