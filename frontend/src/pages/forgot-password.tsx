import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import Head from "next/head";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Footer from "@/components/layout/footer";
import { API_ENDPOINTS } from "@/config/api";

interface ForgotPasswordInputs {
  email: string;
}

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPasswordPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInputs>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    setServerError(null);
    setSuccessMessage(null);
    setResetUrl(null);
    try {
      const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Password reset link sent to your email.");
        setSuccessMessage(
          "A password reset link has been sent to your email address."
        );
        if (responseData.resetUrl) setResetUrl(responseData.resetUrl);
      } else {
        setServerError(
          responseData.message || "Failed to send reset link. Please try again."
        );
        toast.error("Failed to send reset link.");
      }
    } catch (error) {
      setServerError("Unable to connect to the server. Please try again.");
      toast.error("Connection error");
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - StudyMate AI</title>
        <meta name="description" content="Reset your StudyMate AI password" />
      </Head>
      <div className="min-h-screen bg-[#F8FAFB] flex flex-col">
        <Navbar
          onFeaturesClick={() => {}}
          onHowItWorksClick={() => {}}
          onBenefitsClick={() => {}}
        />

        <div className="flex justify-center items-center flex-grow py-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
          >
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#4285F4] to-[#3367d6] bg-clip-text text-transparent">
              Forgot Password
            </h2>

            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4"
              >
                <p className="font-medium">{serverError}</p>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4"
              >
                <p className="font-medium">{successMessage}</p>
              </motion.div>
            )}

            {resetUrl && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
                <p>
                  <strong>Dev Reset Link:</strong>{" "}
                  <a
                    href={resetUrl}
                    className="underline break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resetUrl}
                  </a>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-gray-400"
                    />
                  </div>
                  <input
                    className={`w-full pl-10 p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 text-gray-800 ${
                      errors.email
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#4285F4]/30 focus:border-[#4285F4]"
                    }`}
                    type="email"
                    id="email"
                    placeholder="Enter your email address"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#4285F4] hover:bg-[#3367d6] text-white font-semibold py-3 px-4 rounded-md transition duration-300 flex justify-center items-center shadow-sm hover:shadow-md"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Sending Link...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-[#4285F4] font-medium hover:text-[#3367d6] transition-colors"
              >
                Back to <span className="underline">Login</span>
              </Link>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ForgotPasswordPage;
