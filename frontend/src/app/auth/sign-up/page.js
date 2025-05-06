"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/authContext";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .matches(
      /^(?!.*[._]{2})(?![_.])[a-zA-Z0-9._]{3,20}(?<![_.])$/,
      "Username must be 3-20 characters, no special characters except . and _, and can't start/end with them"
    ),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Must contain at least one special character (@$!%*?&)"
    ),
});

const Register = () => {
  const router = useRouter();
  const { token, setLoading, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_END}/api/register`, data);

      if (
        res.data.success &&
        res.data.message === "User Registered Successfully"
      ) {
        toast.success("Registration successful! Please log in.");
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 1500);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Registration failed", error);
      if (error.response) {
        toast.error(error.response.data?.message || "Failed to register.");
      } else {
        toast.error("Network error or server unreachable.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) router.push("/dashboard/media");
  }, [token,router]);

  if (loading) {
    return (
          <div className="w-full h-screen flex items-center justify-center">
            <Loader />
          </div>
        );
  }
  return (
    <>
      <div className="h-[88vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[#3B28CC] mb-6">
            Create an Account
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <Input placeholder="Username" {...register("username")} />
              {errors.username && (
                <p className="font-bold text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input placeholder="Email" {...register("email")} />
              {errors.email && (
                <p className="font-bold text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <p className="font-bold text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-[#3B28CC] hover:bg-[#2F1BB5]"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-[#3B28CC] hover:underline"
            >
              Sign in
            </Link>
          </div>
          <div className="mt-2 text-center">
            <Link href="/" className="text-gray-500 hover:underline text-xs">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
