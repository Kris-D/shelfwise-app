import React from "react";
import "./Contact.scss";
import { FaPhoneAlt, FaEnvelope, FaTwitter, FaLinkedin } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { IoLogoWhatsapp } from "react-icons/io"
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../services/agent";
import { toast } from "react-toastify";
import Card from "../../components/card/Card";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm();

  const contactUs = async (contactUsData) => {
    // console.log("contactUsData:",contactUsData);
    const response = await agent.contact.contactUs(contactUsData);
    return response;
  };
  const queryClient = useQueryClient();

  const { mutate: contactUsMutation, isPending } = useMutation({
    mutationFn: contactUs,
    onSuccess: (response) => {
      queryClient.invalidateQueries("user");

      if (response.status === 400) {
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

    contactUsMutation(data);
  };
  // Trigger toast on validation error
  const onError = (error) => {
    if (error.subject) toast.error(error.subject.message);
    if (error.message) toast.error(error.message.message);
  };

  return (
    <div className="contact">
      <h3 className="--mt">Contact Us</h3>
      <div className="section">
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Card cardClass="card">
            <label>Subject</label>
            <input
              type="text"
              placeholder="Subject"
              required
              name="subject"
              {...register("subject")}
            />
            <label>Message</label>
            <textarea
              placeholder="Message"
              required
              name="message"
              cols="30"
              rows="10"
              {...register("message")}
            ></textarea>
            <button
              className="--btn --btn-primary"
              disabled={isPending}
              style={{
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              Send Message
            </button>
          </Card>
        </form>
        <div className="details">
          <Card cardClass={"card2"}>
            <h3>Our Contact Information</h3>
            <p>Fill the form or contact us via other channels listed below</p>

            <div className="icons">
              <span>
                <FaPhoneAlt />
                <p>09056288890</p>
              </span>
              <span>
                <FaLinkedin />
                <p>
                  <a
                    href="https://linkedin.com/in/christopher-dunkwu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @christopher-dunkwu
                  </a>
                </p>
              </span>
              <span>
                <FaEnvelope />
                <p>dunkwukris@gmail.com</p>
              </span>
              <span>
                <GoLocation />
                <p>Abuja, Nigeria</p>
              </span>
              <span>
                <FaTwitter />
                <p>
                  <a
                    href="https://twitter.com/Kris_SoftwarDev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @Kris_SoftwarDev
                  </a>
                </p>
              </span>
              <span>
                <IoLogoWhatsapp />
                <p>
                  <a
                    href="https://wa.me/2349056288890"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat on WhatsApp
                  </a>
                </p>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
