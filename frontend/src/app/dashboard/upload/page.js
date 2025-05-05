"use client";
import { useAuth } from "@/components/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UploadPage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const validateImage = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeMB = 5;
    if (!file) return "Please select an image.";
    if (!allowedTypes.includes(file.type))
      return "Only JPG, JPEG and PNG formats are allowed.";
    if (file.size > maxSizeMB * 1024 * 1024)
      return `Image must be smaller than ${maxSizeMB}MB.`;
    return null;
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    const validationError = validateImage(file);
    if (validationError) {
      setMessage(validationError);
      setImage(null);
    } else {
      setMessage("");
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateImage(image);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", image);
      const token = sessionStorage.getItem("token");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END}/api/media/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.data;
      if (data.success === true) {
        toast.success("Image uploaded successfully!");
        setImage(null);
        e.target.reset();
        router.push("/dashboard/media?page=1");
      } else {
        toast.error("Failed to upload the image.");
      }
    } catch (error) {
      toast.error("Error uploading the image. Check the console.");
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/auth/sign-in");
    } else {
      setLoading(false);
    }
  }, [token, router]);

  return (
    <>
      <div className="h-[90vh]">
        <div className="md:max-w-md max-w-[300px] mx-auto mt-20 p-2 md:p-6 border rounded-lg shadow-md bg-white">
          <h1 className="text-2xl font-semibold mb-4 text-center">
            Upload Image
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-[#3B28CC] hover:bg-[#2F1BB5]"
            >
              {loading ? "Uploading..." : "Upload Image"}
            </Button>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-red-600">{message}</p>
          )}
          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-500 hover:underline text-md">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
