import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { useUserProfile } from "../../customHooks/useUserProfile";
import Loader from "../../components/loader/Loader";
import Card from "../../components/card/Card";
import { useForm } from "react-hook-form";
import agent from "../../services/agent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_NAME } from "../../redux/features/auth/authSlice";
import ChangePassword from "../../components/changePassword/ChangePassword";
const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user = [], isPending } = useUserProfile();
  const [isUploading, setIsUploading] = useState(false);
  const { email } = user;
  useEffect(() => {
    if (!email) {
      navigate("/profile");
    }
  }, [email, navigate]);
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username,
      email: user?.email,
      phone: user?.phone,
      bio: user?.bio,
    },
  });

  const editUser = async (userProfileData) => {
    // console.log("userData:",userProfileData);
    const response = await agent.user.updateUserProfile(userProfileData);
    return response;
  };
  const queryClient = useQueryClient();

  const { mutate: editUserMutation, isPending: isPendingMut } = useMutation({
    mutationFn: editUser,
    onSuccess: (response) => {
      setIsUploading(false);
      queryClient.invalidateQueries("user");

      if (response.status === 400) {
        toast.error(response.message);
      } else {
        // console.log("response", response.data);
        toast.success("User Profile Updated successfully");
        navigate("/profile");
        const { username } = response;
        if (username) dispatch(SET_NAME(username));
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

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      let imageURL = data.imageURL; // fallback in case no new image is uploaded
      const file = data.photo?.[0]; // get uploaded file

      // 1. Upload to Cloudinary if file is provided and valid
      if (file) {
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validTypes.includes(file.type)) {
          alert("Only JPG, JPEG, and PNG images are allowed");
          setIsUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "profile_upload");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dsmflealm/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error("Image upload failed");
        }

        const imgData = await res.json();
        imageURL = imgData.secure_url;
      }

      // 2. Prepare final data for your API
      const userProfileData = {
        ...data,
        photo: imageURL,
      };

      // console.log("userProfileData:", userProfileData);

      // 3. Submit to your backend
      editUserMutation(userProfileData);
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error(err.message, "Something went wrong. Please try again.");
      setIsUploading(false);
    }
  };

  // Trigger toast on validation error
  const onError = (error) => {
    if (error.phone) toast.error(error.phone.message);
  };

  return (
    <div className="profile --my2">
      {isPending && <Loader />}
      {!isPending && user ? (
        <Card cardClass={"card --flex-dir-column"}>
          <span className="profile-photo">
            <img src={user?.photo} alt="profilepic" />
          </span>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="--form-control --m"
          >
            <span className="profile-data">
              <p>
                <label>Name:</label>
                <input
                  type="text"
                  placeholder="Username"
                  required
                  name="username"
                  {...register("username")}
                />
              </p>
              <p>
                <label>Email:</label>
                <input
                  type="text"
                  placeholder="Email"
                  disabled
                  name="email"
                  {...register("email")}
                />
                <br />
                <code>Email cannot be changed.</code>
              </p>
              <p>
                <label>Phone:</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  required
                  name="phone"
                  {...register("phone", {
                    required: "phone Number is required",
                    minLength: {
                      value: 11,
                      message:
                        "Phone Number should be at least 11 characters long",
                    },
                  })}
                />
              </p>
              <p>
                <label>Bio:</label>
                <textarea
                  placeholder="Bio"
                  required
                  name="bio"
                  cols="30"
                  rows="10"
                  {...register("bio")}
                ></textarea>
              </p>
              <p>
                <label>Photo:</label>
                <input type="file" accept="image/*" {...register("photo")} />
              </p>
              <div>
                <button
                  className="--btn --btn-primary"
                  type="submit"
                  disabled={isPendingMut || isUploading}
                  style={{
                    cursor:
                      isPendingMut || isUploading ? "not-allowed" : "pointer",
                  }}
                >
                  {isPendingMut || isUploading ? "Saving..." : "Edit Profile"}
                </button>
              </div>
            </span>
          </form>
        </Card>
      ) : (
        <Loader />
      )}
      <br />
      <ChangePassword />
    </div>
  );
};

export default EditProfile;
