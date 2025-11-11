import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import Head from "next/head";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUser,
  faEnvelope,
  faIdCard,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Footer from "@/components/layout/footer";
import { API_ENDPOINTS } from "@/config/api"; // <-- Use centralized API endpoints

interface RegisterFormInputs {
  rollno: string;
  name: string;
  email: string;
  password: string;
}

const registerSchema = yup.object().shape({
  rollno: yup.string().required("Roll number is required"),
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const RegisterPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(registerSchema),
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Please login.");
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        // Enhanced error handling for duplicate or other errors
        if (responseData.message?.toLowerCase().includes("duplicate")) {
          if (responseData.message.toLowerCase().includes("email")) {
            setServerError(
              "This email is already registered. Please use a different email."
            );
          } else if (responseData.message.toLowerCase().includes("roll")) {
            setServerError(
              "This roll number is already registered. Please contact support if this is an error."
            );
          } else {
            setServerError("An account with these details already exists.");
          }
        } else {
          setServerError(
            responseData.message || "Registration failed. Please try again."
          );
        }
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setServerError(
        "Unable to connect to the server. Please check your internet connection."
      );
      toast.error("Connection error");
    }
  };

  return (
    <>
      <Head>
        <title>Register - StudyMate AI</title>
        <meta name="description" content="Create your StudyMate AI account" />
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
            <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-[#4285F4] to-[#3367d6] bg-clip-text text-transparent">
              Create Account
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="rollno"
                >
                  Roll Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FontAwesomeIcon
                      icon={faIdCard}
                      className="text-gray-400"
                    />
                  </div>
                  <input
                    className={`w-full pl-10 p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 text-gray-800 ${
                      errors.rollno
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#4285F4]/30 focus:border-[#4285F4]"
                    }`}
                    id="rollno"
                    placeholder="Enter your roll number"
                    {...register("rollno")}
                  />
                </div>
                {errors.rollno && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.rollno.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  </div>
                  <input
                    className={`w-full pl-10 p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 text-gray-800 ${
                      errors.name
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#4285F4]/30 focus:border-[#4285F4]"
                    }`}
                    id="name"
                    placeholder="Enter your full name"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

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

              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                  </div>
                  <input
                    className={`w-full pl-10 p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 text-gray-800 ${
                      errors.password
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#4285F4]/30 focus:border-[#4285F4]"
                    }`}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Create a password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.password.message}
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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-[#4285F4] font-medium hover:text-[#3367d6] transition-colors"
              >
                Already have an account?{" "}
                <span className="underline">Sign in</span>
              </Link>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default RegisterPage;
