"use client"; // Asegura que este componente se ejecute en el cliente

import "@/styles/globals.css";
import clsx from "clsx";
import Header from "@/components/header";
import HeaderMobile from "@/components/header-mobile";
import { fontSans } from "@/config/fonts";
import { SideNav } from "@/components/side-nav";
import PageWrapper from "@/components/page-wrapper";
import MarginWidthWrapper from "@/components/margin-width-wrapper";
import { usePathname } from "next/navigation"; 
import ViewportComponent from "@/components/viewport-component"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); 
  const isLoginPage = pathname === "/login"; 
  const isPage = pathname === "/"; 

  
  const hideLayout = isLoginPage || isPage;

  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ViewportComponent /> 
        <div className="flex">
          {!hideLayout && <SideNav />} 
          <main className="flex-1">
            {!hideLayout ? (
              <MarginWidthWrapper>
                <Header />
                <HeaderMobile />
                <PageWrapper>{children}</PageWrapper>
              </MarginWidthWrapper>
            ) : (
              
              <>{children}</>
            )}
          </main>
        </div>
      </body>
    </html>
  );
}
