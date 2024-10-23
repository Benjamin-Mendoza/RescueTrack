"use client"; // Esto asegura que el código se ejecute en el cliente

import { useEffect } from "react";

export default function ViewportComponent() {
  useEffect(() => {
    const themeColorLight = "(prefers-color-scheme: light)";
    const themeColorDark = "(prefers-color-scheme: dark)";

    // Lógica para manejar el viewport en base al esquema de color
    const lightColor = "white";
    const darkColor = "black";

    const themeColors = [
      { media: themeColorLight, color: lightColor },
      { media: themeColorDark, color: darkColor },
    ];

    themeColors.forEach(({ media, color }) => {
      const metaTag = document.querySelector(
        `meta[name="theme-color"][media="${media}"]`
      );

      if (metaTag) {
        metaTag.setAttribute("content", color);
      } else {
        const newMetaTag = document.createElement("meta");
        newMetaTag.name = "theme-color";
        newMetaTag.media = media;
        newMetaTag.content = color;
        document.head.appendChild(newMetaTag);
      }
    });
  }, []);

  return null; // No renderizamos nada visualmente
}
