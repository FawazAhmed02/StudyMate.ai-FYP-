import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { API_ENDPOINTS } from "@/config/api";
import toast from "react-hot-toast";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

interface ResetInputs {
  email: string;
  token: string;
  newPassword: string;
}

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required(),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const { email, token } = router.query;
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (typeof email === "string" && typeof token === "string") {
      setValue("email", email);
      setValue("token", token);
    }
  }, [email, token, setValue]);

  if (typeof email !== "string" || typeof token !== "string") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const onSubmit: SubmitHandler<ResetInputs> = async (data) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok) {
        setSuccessMessage("Password reset successful! Redirecting to login...");
        toast.success("Password reset successful!");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setServerError(responseData.message || "Reset failed.");
        toast.error("Reset failed.");
      }
    } catch (error) {
      setServerError("Unable to connect to the server.");
      toast.error("Connection error");
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password - StudyMate AI</title>
        <meta name="description" content="Reset your StudyMate AI password" />
      </Head>
      <div className="min-h-screen bg-[#F8FAFB] flex flex-col">
        <Navbar
          onFeaturesClick={() => {}}
          onHowItWorksClick={() => {}}
          onBenefitsClick={() => {}}
        />

        <div className="flex justify-center items-center flex-grow py-10 px-4">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
          >
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#4285F4] to-[#3367d6] bg-clip-text text-transparent">
              Reset Password
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
            <input type="hidden" {...register("email")} />
            <input type="hidden" {...register("token")} />
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  {...register("newPassword")}
                  className={`w-full pl-10 pr-10 p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 text-gray-800 ${
                    errors.newPassword
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#4285F4]/30 focus:border-[#4285F4]"
                  }`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4285F4] hover:bg-[#3367d6] text-white font-semibold py-3 px-4 rounded-md transition duration-300 flex justify-center items-center shadow-sm hover:shadow-md"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </motion.form>
        </div>

        <Footer />
      </div>
    </>
  );
}
