"use client"
import ThemeProvider from "../providers/ThemeProvider";
import { ThemeContextProvider } from "../context/ThemeContext";
import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar_nologo/Navbar";
import "./layout.css";
import { Inter } from "next/font/google";
import AuthProvider from "../providers/AuthProvider";
import Sidebar from "../components/sideBar/SideBar";
import { PostDataProvider } from '../context/PostDataContext';
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children}) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  console.log(sidebarOpen)

  const handleToggleSidebar = (isOpen) => {
    setSidebarOpen(isOpen);
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeContextProvider>
            <ThemeProvider>
            <PostDataProvider>
              <div className="container">
              <Sidebar onToggle={handleToggleSidebar} />
              <Navbar></Navbar>
        
                <div className="wrapper"
         
                    style={{
                      maxWidth: sidebarOpen ? 'calc(100% - 350px)' : '90%', // 350 px sidebar
                      transition: 'max-width 0.3s ease-in-out'
                    }}>
             
                  {children}
                  <Footer />
                </div>
              </div>
              </PostDataProvider>
            </ThemeProvider>
          </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
