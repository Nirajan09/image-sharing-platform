import { Suspense } from "react";
import Loader from "@/components/Loader";
import Media from "./Media";

export default function MediaPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <Loader />
        </div>
      }
    >
      <Media />
    </Suspense>
  );
}
