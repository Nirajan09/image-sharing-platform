import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CommonLayout from "@/components/commonLayout/commonLayout";
import { AuthProvider } from "@/components/authContext";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pixify",
  description: "Discover and Share your favourite Media.",
  icons:{
    icon:"/favicon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CommonLayout>{children}</CommonLayout>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
