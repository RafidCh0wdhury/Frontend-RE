"use client";

import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const LoginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid Email"),
  password: z.string().nonempty("Password is required"),
});

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    const user = localStorage.getItem("userDetails");

    if (user) {
      router.push("/home");
    }
  }, [router]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        'https://resourcexchange.net/auth/login',
        data
      );

      localStorage.setItem("userDetails", JSON.stringify(response.data));
      router.push("/home");
    } catch (err) {
      toast(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col space-y-28">
      <h1 className="text-4xl w-fit mx-auto mt-4">Resource Exchange</h1>
      <div className="flex items-center justify-center">
        <div className="w-[50%]">
          <h1 className="text-center font-bold text-2xl mb-3 text-white">
            Login
          </h1>
          <form
            className="flex flex-col space-y-5 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm text-white font-medium text-gray-900 dark:text-white"
              >
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
              <label
                htmlFor="password"
                className="block mb-2 text-white text-sm font-medium"
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-white py-2.5 bg-[#301934] hover:bg-white hover:border hover:border-[#301934] hover:text-black font-medium rounded-lg text-sm text-center"
            >
              {isSubmitting ? "Submitting..." : "Login"}
            </button>
          </form>

          <p className="mt-2 text-sm italic text-center text-white">
            Dont't have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </p>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
