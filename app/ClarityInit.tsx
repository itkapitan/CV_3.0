"use client";

import { useEffect } from "react";

const clarityId = "umjul1ropk";

export default function ClarityInit() {
  useEffect(() => {
    // Ждем полной загрузки страницы и стилей перед инициализацией Clarity
    const initClarity = () => {
      try {
        (function (c: any, l: Document, a: string, r: string, i: string) {
          c[a] =
            c[a] ||
            function () {
              (c[a].q = c[a].q || []).push(arguments);
            };
          const t = l.createElement(r) as HTMLScriptElement;
          t.async = true;
          t.src = "https://www.clarity.ms/tag/" + i;
          const y = l.getElementsByTagName(r)[0];
          y.parentNode?.insertBefore(t, y);
        })(window, document, "clarity", "script", clarityId);
      } catch {}
    };

    // Если страница уже загружена или интерактивна, инициализируем сразу
    if (document.readyState === "complete" || document.readyState === "interactive") {
      initClarity();
    } else {
      // Ждем готовности DOM
      window.addEventListener("DOMContentLoaded", initClarity);
    }
  }, []);

  return null;
}

