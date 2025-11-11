import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import Head from "next/head";
import toast from "react-hot-toast";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { API_ENDPOINTS } from "@/config/api";
import Link from "next/link";

interface LoginInputs {
  email: string;
  password: string;
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setServerError(null);
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok) {
        toast.success("Login successful!");
        localStorage.setItem("student", JSON.stringify(responseData.student));
        router.push("/student_dashboard");
      } else {
        setServerError(responseData.message || "Login failed.");
        toast.error(responseData.message || "Login failed.");
      }
    } catch (error) {
      setServerError("Unable to connect to the server.");
      toast.error("Connection error");
    }
  };

  return (
    <>
      <Head>
        <title>Login - StudyMate AI</title>
        <meta name="description" content="Login to StudyMate AI" />
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
              Login
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
            <div className="mb-4">
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
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`w-full pl-10 p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 text-gray-800 ${
                    errors.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#4285F4]/30 focus:border-[#4285F4]"
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-6">
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
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  className={`w-full pl-10 pr-10 p-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 text-gray-800 ${
                    errors.password
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#4285F4]/30 focus:border-[#4285F4]"
                  }`}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4285F4] hover:bg-[#3367d6] text-white font-semibold py-3 px-4 rounded-md transition duration-300 flex justify-center items-center shadow-sm hover:shadow-md"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
            <div className="mt-6 text-center">
              <Link
                href="/forgot-password"
                className="text-[#4285F4] font-medium hover:text-[#3367d6] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="mt-2 text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                href="/register"
                className="text-[#4285F4] font-medium hover:text-[#3367d6] transition-colors underline"
              >
                Register
              </Link>
            </div>
          </motion.form>
        </div>
        <Footer />
      </div>
    </>
  );
}
