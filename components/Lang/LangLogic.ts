export type Lang = "en" | "ua" | "ru";

export const supportedLangs: Lang[] = ["en", "ua", "ru"];

export function getCurrentLang(pathname: string): Lang {
  const segments = pathname.split("/").filter(Boolean);
  const candidate = segments[0];
  if (supportedLangs.includes(candidate as Lang)) {
    return candidate as Lang;
  }
  return "en";
}

export function buildLangHref(target: Lang, pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  // Если первый сегмент уже язык — заменяем, иначе добавляем
  if (segments.length > 0 && supportedLangs.includes(segments[0] as Lang)) {
    segments[0] = target;
  } else {
    segments.unshift(target);
  }
  return "/" + segments.join("/");
}

export function isActiveLang(target: Lang, pathname: string): boolean {
  return getCurrentLang(pathname) === target;
}

// Scroll memory for inner content container
export const SCROLL_STORAGE_KEY = "content-scroll-top";
export const SCROLL_CONTAINER_ID = "content-scroll";

export function saveContentScroll(): void {
  if (typeof window === "undefined") return;
  const el = document.getElementById(SCROLL_CONTAINER_ID);
  if (!el) return;
  // Сохраняем и в sessionStorage, и в localStorage, чтобы избежать скачка после полной перезагрузки
  sessionStorage.setItem(SCROLL_STORAGE_KEY, String(el.scrollTop));
  try {
    localStorage.setItem(SCROLL_STORAGE_KEY, String(el.scrollTop));
  } catch {}
}
