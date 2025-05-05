"use client";
import { useAuth } from "@/components/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UpdatePage = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [message, setMessage] = useState("");

  const validateImage = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeMB = 5;
    if (!file) return "Please select an image.";
    if (!allowedTypes.includes(file.type))
      return "Only JPG and PNG formats are allowed.";
    if (file.size > maxSizeMB * 1024 * 1024)
      return `Image must be smaller than ${maxSizeMB}MB.`;
    return null;
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    const error = validateImage(file);
    if (error) {
      setImage(null);
      setFileError(error);
    } else {
      setImage(file);
      setFileError("");
    }
  };

  const updateImage = async (e) => {
    e.preventDefault();

    const validationError = validateImage(image);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", image);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_END}/api/media/update-image/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      setLoading(false);

      if (data.success) {
        toast.success("Image updated successfully.");
        router.push("/dashboard/media?page=1");
      } else {
        toast.error("Something went wrong while updating the image.");
      }
    } catch (error) {
      toast.error("Error updating the image.");
      console.error("Error updating image:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }
    setLoading(false);
  }, [token, router]);
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-md bg-white">
      <h1 className="text-2xl font-semibold mb-4 text-center">Update Image</h1>
      <form onSubmit={updateImage} className="space-y-4">
        <Input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <Button
          disabled={loading}
          type="submit"
          className="w-full cursor-pointer bg-[#3B28CC] hover:bg-[#2F1BB5]"
        >
          {loading ? "Updating..." : "Update Image"}
        </Button>
      </form>

      {/* Display File Error */}
      {fileError && (
        <p className="mt-4 text-center text-sm text-red-600">{fileError}</p>
      )}

      {/* Display API Response Message */}
      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default UpdatePage;
