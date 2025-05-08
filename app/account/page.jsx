"use client";
import { z } from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import withBasicAuth from "../../component/withBasicAuth";

const SignupSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  major: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
});

const Account = () => {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [profilePicture, setProfilePicture] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: userDetails,
  });

  useEffect(() => {
    const user = localStorage.getItem("userDetails");
    if (user) {
      const jsonData = JSON.parse(user);
      const { access_token, ...data } = jsonData;
      setUserDetails(data);
      setProfilePicture(
        data.profilePicture || "https://via.placeholder.com/150"
      );
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("major", data.major);
    }
  }, [setValue]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSignupSubmit = async (data) => {
    console.log(data);
    // try {
    //   const response = await axios.post(
    //     "http://localhost:3002/auth/signup",
    //     data
    //   );
    //   if (response.status === 200) {
    //     router.push("/auth/login");
    //   } else {
    //     toast("Signup failed. Please try again!");
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors.message);
      toast(errors);
    }
  }, [errors]);

  if (isUserLoggedIn) {
    return null;
  }

  return (
    <div className="w-[90%] mx-auto mt-5">
      <form
        className="bg-[#eee5c6] flex flex-col space-y-5 p-5 rounded-lg shadow-md w-full"
        onSubmit={handleSubmit(onSignupSubmit)}
      >
        <div className="flex items-center justify-center mb-5">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <input
            type="file"
            onChange={handleProfilePictureChange}
            className="ml-4"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Name
          </label>
          <input
            {...register("name")}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email address
          </label>
          <input
            {...register("email")}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="email"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Major
          </label>
          <input
            {...register("major")}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="major"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            Want to change your password?
          </label>
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Current Password
            </label>
            <input
              {...register("currentPassword")}
              type="password"
              className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Current Password"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              New Password
            </label>
            <input
              {...register("newPassword")}
              type="password"
              className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="New Password"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white p-2.5 bg-[#301934] hover:bg-white hover:border hover:border-[#301934] hover:text-black font-medium rounded-lg text-sm text-center w-fit"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default withBasicAuth(Account);
