import localFont from "next/font/local";
import "./globals.css";
import NavBar from "../components/NavBar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Role based user controlled",
  description: "Admin Dashboard Management",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-gray-700 my-4">Admin Dashboard Management</h1>
        <div className="h-full w-full flex flex-col">
          <NavBar />
          <div>
          {children}
          </div>
        </div>
      </div>
      </body>
    </html>
  );
}
