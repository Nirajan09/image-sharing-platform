"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import Loader from "../Loader";

const DropMenu = ({
  id,
  getMedia,
  uploadedBy,
  publicId,
  imageUrl,
  getusernameInfo,
  getemailInfo,
  getcreatedAtInfo,
  getupdatedAtInfo,
}) => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validUser, setValidUser] = useState(false);
  const [openImage, setOpenImage] = useState(false);

  const handleClick = (action) => {
    router.push(`/dashboard/${action}/${id}`);
  };

  const validateUser = useCallback(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decodedtoken = jwtDecode(token);
      setValidUser(decodedtoken.userId === uploadedBy._id);
    } else {
      setValidUser(false);
    }
  }, [uploadedBy]);

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        router.push("/auth/sign-in");
        return;
      }
      setLoading(true);
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END}/api/media/delete-media/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Image deleted Successfully");
        getMedia();
        setOpenDialog(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateUser();
  }, [uploadedBy,validateUser]);

  if (loading) {
    return (
          <div className="w-full h-screen flex items-center justify-center">
            <Loader />
          </div>
        );
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="font-extrabold text-3xl p-2 bg-white rounded-4xl">
          ⋮
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenImage(true)}>
            View Image
          </DropdownMenuItem>
          {validUser && (
            <>
              <DropdownMenuItem
                disabled={!validUser}
                onClick={() => {
                  handleClick("edit");
                }}
              >
                Update Image
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!validUser}
                onClick={() => setOpenDialog(true)}
              >
                Delete Image
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AlertDialog Outside Dropdown */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              image and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={handleDelete}>
              {loading ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for viewing Image */}
      <Dialog open={openImage} onOpenChange={setOpenImage}>
        <DialogContent className="w-full h-[90vh] p-4 flex  flex-col">
          <DialogHeader>
            <DialogTitle>Image Details</DialogTitle>
            <DialogDescription>
              Public Id of Image: {publicId}
            </DialogDescription>
            <DialogDescription>
              Uploaded By: {getusernameInfo}
            </DialogDescription>
            <DialogDescription>User&apos;s Email: {getemailInfo}</DialogDescription>
            <DialogDescription>
              Created At: {getcreatedAtInfo || "Not Available"}
            </DialogDescription>
            <DialogDescription>
              Updated At: {getupdatedAtInfo || "Not Available"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative w-full max-w-md max-h-[550px] overflow-hidden rounded-xl mx-auto">
            <img
              src={imageUrl}
              alt={publicId}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
            />
        </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DropMenu;
