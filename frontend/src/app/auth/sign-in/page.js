"use client";
import React, { useEffect, useState } from "react";
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

// Form validation schema
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const router = useRouter();
  const { login, token } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  // Base64 decode helper (to decode JWT payload)
  const decodeJWT = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (err) {
      return null;
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END}/api/login`,
        data,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Login successful!");
        const tokenValue = res.data.accessToken;
        login(tokenValue);

        // Decode JWT safely without using jwt-decode package
        const decoded = decodeJWT(tokenValue);
        const userRole = decoded?.role || "user";

        router.push(userRole === "user" ? "/dashboard/media?page=1" : "/");
      } else {
        toast.error(res.data.message || res.data.error || "Something went wrong during login");
      }
    } catch (error) {
      console.error("Login error", error);
      if (error.response) {
        toast.error(
          error.response.data?.message ||
            error.response.data?.error ||
            "Login failed"
        );
      } else {
        toast.error("Network error or server not reachable.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (token) router.push("/dashboard/media");
  }, [token, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-[88vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#3B28CC] mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <Input placeholder="Username" {...formRegister("username")} />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Input type="password" placeholder="Password" {...formRegister("password")} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <Button
            disabled={isSubmitting || loading}
            className="cursor-pointer w-full bg-[#3B28CC] hover:bg-[#2F1BB5]"
            type="submit"
          >
            {isSubmitting || loading ? "Logging In..." : "Login"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-[#3B28CC] hover:underline">
            Sign up
          </Link>
        </div>
        <div className="mt-2 text-center">
          <Link href="/" className="text-gray-500 hover:underline text-xs">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
