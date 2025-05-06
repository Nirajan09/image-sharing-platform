"use client";
import { useAuth } from "@/components/authContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";

export default function Home() {
  const router = useRouter();
  const { token } = useAuth();
  const checkAuth = () => {
    token ? router.push("/dashboard/media") : router.push("/auth/sign-in");
  };
  
  return (
    <>
      <div>
        <section className="px-4 h-[88vh] flex md:justify-center md:items-center flex-col md:flex-row mt-[1rem] md:mt-0 overflow-hidden">
          <div className="text-center flex flex-col gap-4 justify-between items-center md:w-[50%]">
            <h1 className="font-extrabold text-[1.875rem] text-[#1e293b] leading-[1.2] lg:text-[3.75rem]  xs:text-[2.25rem] sm:text-[1.7rem] select-none">
              Discover and Share Your Favorite Media
            </h1>
            <p className="text-center max-w-[60ch] text-[1rem] text-[#475569] lg:text-[1.25rem] sm:text-[1.125] select-none ">
              Upload, view, and manage your media easily with our platform.
            </p>
            <Button
              onClick={checkAuth}
              className="cursor-pointer text-2xl bg-[#3B28CC] hover:bg-[#2F1BB5] text-white p-6 rounded-full "
            >
              Get Started
            </Button>
          </div>
          <div>
            <Image
              src="/heroImage.png"
              alt="Image Portal"
              width={600}
              height={600}
              className="relative ml-auto w-[400px] h-[400px] md:w-[600px] md:h-[600px] mr-4 select-none" 
            />
          </div>
        </section>
      </div>
    </>
  );
}
