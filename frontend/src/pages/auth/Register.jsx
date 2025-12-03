import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { TiUserAddOutline } from "react-icons/ti";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../services/agent";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  SET_LOGIN,
  SET_NAME,
  SET_USER,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    // formState: { errors },
    watch,
  } = useForm();
  const password = watch("password");
  const registerUser = async (userData) => {
    // console.log("userData:", userData);
    const response = await agent.auth.register(userData);
    return response;
  };
  const queryClient = useQueryClient();

  const { mutate: registerUserMutation, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      queryClient.invalidateQueries("registerUser");

      if (response.status === "400") {
        toast.error(response.message);
      } else {
        // console.log("response", response.data);
        dispatch(SET_LOGIN(true));
        dispatch(SET_NAME(response.username));
        navigate("/dashboard");
        toast.success("User Registered successfully");
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
      // console.error("Error registering user:", errorMessage);
      toast.error(errorMessage);
    },
  });
  const onSubmit = (data) => {
    // Remove confirmPassword before submission (just in case)
    delete data.confirmPassword;
    // console.log("data:", data);
    // Add the password to the userData object
    registerUserMutation(data);
  };
  // Trigger toast on validation error
  const onError = (error) => {
    if (error.email) toast.error(error.email.message);
    if (error.password) toast.error(error.password.message);
    if (error.confirmPassword) toast.error(error.confirmPassword.message);
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isPending && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <TiUserAddOutline size={35} color="#999" />
          </div>
          <h2>Register</h2>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <input
              type="text"
              placeholder="Username"
              required
              name="username"
              {...register("username")}
            />
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}(\.[0-9]{1,3}){3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {/* {errors.email && toast.error(errors.email.message)} */}
            <input
              type="password"
              placeholder="Password"
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
            {/* {errors.password && toast.error(errors.password.message)} */}
            <input
              type="password"
              placeholder="Confirm password"
              required
              name="confirm password"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {/* {errors.confirmPassword && toast.error(errors.confirmPassword.message)} */}
            <input
              type="text"
              placeholder="ReferralBy"
              name="referralBy"
              {...register("referralBy")}
            />
            <button
              className="--btn --btn-primary --btn-block"
              type="submit"
              disabled={isPending}
              style={{
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              Register
            </button>
          </form>
          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p>&nbsp; Already have an account? &nbsp;</p>
            <Link to="/login">Login</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Register;
