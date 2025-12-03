import { Link } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { AiOutlineMail } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../services/agent";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Forgot = () => {
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm();
  const userForgotPassword = async (userData) => {
    // console.log("userData:", userData);
    const response = await agent.auth.forgotPassword(userData);
    return response;
  };
  const queryClient = useQueryClient();

  const { mutate: forgotPasswordMutation, isPending } = useMutation({
    mutationFn: userForgotPassword,
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
    // console.log("data:", data);
    forgotPasswordMutation(data);
  };
  // Trigger toast on validation error
  const onError = (error) => {
    if (error.email) toast.error(error.email.message);
  };

  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <AiOutlineMail size={35} color="#999" />
          </div>
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
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
            <button
              className="--btn --btn-primary --btn-block"
              type="submit"
              disabled={isPending}
              style={{
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              Get Reset Email
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

export default Forgot;
