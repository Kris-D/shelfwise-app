import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { BiLogIn } from "react-icons/bi";
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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const userLogin = async (userData) => {
    // console.log("userData:", userData);
    const response = await agent.auth.login(userData);
    return response;
  };

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: userLogin,
    onSuccess: (response) => {
      queryClient.invalidateQueries("user");

      if (response.status === "400") {
        // console.log("Error Login:", response.message);
        toast.error(response.message);
      } else {
         const { username } = response;
        // console.log("response", response);
        dispatch(SET_LOGIN(true));
        if (username) dispatch(SET_NAME(username));
        navigate("/dashboard");
        toast.success("Login successfully");
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
    // console.log("data:", data);
    loginMutation(data);
  };
  // Trigger toast on validation error
  const onError = (error) => {
    if (error.email) toast.error(error.email.message);
    if (error.password) toast.error(error.password.message);
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isPending && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <BiLogIn size={35} color="#999" />
          </div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <input
              type="text"
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
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              {...register("password", {
                required: "Password is required",
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
              Login
            </button>
          </form>
          <Link to="/forgot">Forgot Password</Link>
          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p>&nbsp; Don't have an account? &nbsp;</p>
            <Link to="/register">Sign Up</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Login;
