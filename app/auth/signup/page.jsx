"use client";
import { z } from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

const SignupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    major: z.string().min(1, "Major is required"),
    password: z.string().min(4, "Password must be at least 4 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  useEffect(() => {
    const user = localStorage.getItem("userDetails");

    console.log(user);

    if (JSON.parse(user)) {
      setIsUserLoggedIn(true);
      router.push("/home");
    }
  }, []);

  const onSignupSubmit = async (data) => {
    try {
      const response = await axios.post(
        'https://resourcexchange.net/auth/signup',
        data
      );
      if (response.status === 200) {
        router.push("/auth/login");
      } else {
        toast("Signup failed. Please try again!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isUserLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center h-screen">
      <div className="w-[70%] md:w-[55%] sm:w-[50%] lg:w-[40%] mx-auto">
        <h1 className="text-center font-bold text-2xl mb-3">Signup</h1>
        <form
          className="flex flex-col space-y-5 w-full"
          onSubmit={handleSubmit(onSignupSubmit)}
        >
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Name
            </label>
            <input
              {...register("name")}
              type="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name"
            />
            {errors.name && (
              <div className="text-red-500">{errors.name.message}</div>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="email"
            />
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </div>
          <div>
            <label htmlFor="major" className="block mb-2 text-sm font-medium">
              Major
            </label>
            <input
              {...register("major")}
              type="major"
              id="major"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="major"
            />
            {errors.major && (
              <div className="text-red-500">{errors.major.message}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
            />
            {errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
            />
            {errors.confirmPassword && (
              <div className="text-red-500">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white py-2.5 bg-[#301934] hover:bg-white hover:border hover:border-[#301934] hover:text-black font-medium rounded-lg text-sm text-center"
          >
            {isSubmitting ? "Submitting..." : "Create Account"}
          </button>
        </form>

        <p className="mt-2 text-sm italic text-center text-white">
          Already have an account?
          <Link href="/auth/login" className="underline">
            Login
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}
