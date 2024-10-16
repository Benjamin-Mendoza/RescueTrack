"use client"; // Asegura que este componente se ejecute en el cliente

import "@/styles/globals.css";
import clsx from "clsx";
import Header from "@/components/header";
import HeaderMobile from "@/components/header-mobile";
import { fontSans } from "@/config/fonts";
import { SideNav } from "@/components/side-nav";
import PageWrapper from "@/components/page-wrapper";
import MarginWidthWrapper from "@/components/margin-width-wrapper";
import { usePathname } from "next/navigation"; // Hook para obtener la ruta actual
import ViewportComponent from "@/components/viewport-component"; // Importamos el componente del viewport

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Obtenemos la ruta actual
  const isLoginPage = pathname === "/login"; // Verificamos si estamos en la página de login
  const isPage = pathname === "/"; // Verificamos si estamos en la página 'page.tsx'

  // Ocultar los componentes en la página de login y en la de 'page.tsx'
  const hideLayout = isLoginPage || isPage;

  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ViewportComponent /> {/* Se incluye el ViewportComponent para manejar el viewport */}
        <div className="flex">
          {!hideLayout && <SideNav />} {/* Ocultamos el SideNav en login y page.tsx */}
          <main className="flex-1">
            {!hideLayout ? (
              <MarginWidthWrapper>
                <Header />
                <HeaderMobile />
                <PageWrapper>{children}</PageWrapper>
              </MarginWidthWrapper>
            ) : (
              // Si es la página de login o page.tsx, solo mostramos el contenido sin envolturas adicionales
              <>{children}</>
            )}
          </main>
        </div>
      </body>
    </html>
  );
}
