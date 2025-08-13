"use client";

import { useLayoutEffect } from "react";

// Восстанавливает положение скролла контентного контейнера ДО первого кадра,
// чтобы избежать визуального скачка сверху вниз после гидрации
export default function ScrollRestorer() {
  useLayoutEffect(() => {
    const el = document.getElementById("content-scroll");
    if (!el) return;
    const saved = sessionStorage.getItem("content-scroll-top");
    if (saved) {
      const prevBehavior = (el as HTMLElement).style.scrollBehavior;
      // временно отключаем плавную прокрутку, чтобы мгновенно позиционировать
      (el as HTMLElement).style.scrollBehavior = "auto";
      el.scrollTop = parseInt(saved, 10) || 0;
      (el as HTMLElement).style.scrollBehavior = prevBehavior || "";
      // очищаем, чтобы не мешать последующим переходам
      sessionStorage.removeItem("content-scroll-top");
    }
  }, []);

  return null;
}
