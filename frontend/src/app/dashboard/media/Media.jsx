"use client";

import DropMenu from "@/components/dropMenu";
import { useEffect, useState, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/authContext";
import Loader from "@/components/Loader";
import { Image } from 'antd';
const Media = () => {
  const router = useRouter();
  const { token } = useAuth();

  const [media, setMedia] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [getusernameInfo, setusernameInfo] = useState("");
  const [getcreatedAtInfo, setcreatedAtInfo] = useState(null);
  const [getupdatedAtInfo, setupdatedAtInfo] = useState(null);
  const searchParams = useSearchParams();

  const arrayofTotalPages = Array.from({ length: totalPage }, (_, i) => i + 1);

  const getMedia = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACK_END}/api/media/get-media?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );
        const result = await res.json();
        setusernameInfo(result.data[0].uploadedBy.username);
        setcreatedAtInfo(result.data[0].createdAt);
        setupdatedAtInfo(result.data[0].updatedAt);
        setMedia(result.data);
        setTotalPage(result.TotalPage);
      } catch (error) {
        console.log("Something went wrong", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token === undefined) return;
    if (token === null) {
      router.push("/auth/sign-in");
    } else {
      setCheckingAuth(false);
    }
    setLoading(false);
  }, [token, router]);

  useEffect(() => {
    if (!checkingAuth) {
      const page = Number(searchParams.get("page")) || 1;
      setCurrentPage(page);
      getMedia(page);
    }
  }, [searchParams, checkingAuth,getMedia]);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleString("en-US", {
      timeZone: "Asia/Kathmandu",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }, []);

  if (loading || checkingAuth) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="px-4">
      {media.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {media.map((item) => (
            <div
              key={item._id}
              className="group relative border rounded-xl overflow-hidden shadow-md bg-white"
            >
              <Image
                src={item.url}
                alt={item.publicId}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
              />
              <div className="absolute bottom-2 right-2 opacity-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10">
                <DropMenu
                  id={item._id}
                  uploadedBy={item.uploadedBy}
                  getMedia={getMedia}
                  publicId={item.publicId}
                  imageUrl={item.url}
                  getusernameInfo={item.uploadedBy.username}
                  getcreatedAtInfo={formatDate(item.createdAt)}
                  getupdatedAtInfo={formatDate(item.updatedAt)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[85vh] text-center py-16 flex justify-center items-center flex-col">
          <p className="text-2xl font-semibold text-gray-700 mb-2">
            No images uploaded yet!
          </p>
          <p className="text-gray-500 mb-4">
            It looks like you haven&apos;t uploaded anything. Start by adding your
            first image.
          </p>
          <button
            onClick={() => router.push("/dashboard/upload")}
            className="bg-[#3B28CC] hover:bg-[#2F1BB5] text-white px-6 py-2 rounded cursor-pointer transition"
          >
            Upload Now
          </button>
        </div>
      )}
      {media.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={currentPage <= 1}
                className={currentPage <=1 && "cursor-not-allowed"}
                href={currentPage > 1 ? `?page=${currentPage - 1}` : undefined}
              />
            </PaginationItem>

            {arrayofTotalPages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`?page=${page}`}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            {arrayofTotalPages.length > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
              className={currentPage >= totalPage && "cursor-not-allowed"}
                disabled={currentPage >= totalPage}
                href={
                  currentPage < totalPage
                    ? `?page=${currentPage + 1}`
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Media;
