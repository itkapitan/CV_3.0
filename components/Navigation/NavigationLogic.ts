import { useEffect, useState } from "react";
import {
  SCROLL_CONTAINER_ID,
  SCROLL_STORAGE_KEY,
} from "@/components/Lang/LangLogic";

// Идентификаторы секций по умолчанию (соответствуют id заголовков в контенте)
export const SECTION_IDS = ["about", "design", "dev", "exp"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

// Опции для плавного скролла к целевой секции внутри контейнера
export type SmoothScrollOptions = {
  containerId?: string;
  updateHash?: boolean;
  offset?: number;
};

// Плавно скроллит контейнер к секции и обновляет hash в адресной строке
export function handleNavClick(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  targetId: string,
  options?: SmoothScrollOptions
): void {
  if (typeof window === "undefined") return;
  event.preventDefault();

  const containerId = options?.containerId ?? "content-scroll";
  const updateHash = options?.updateHash ?? true;
  const offset = options?.offset ?? 0;

  const container = document.getElementById(containerId);
  const target = document.getElementById(targetId);
  if (!container || !target) return;

  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const currentTop = container.scrollTop;

  const delta = targetRect.top - containerRect.top - offset;
  const nextTop = Math.max(0, currentTop + delta);

  container.scrollTo({ top: nextTop, behavior: "smooth" });

  if (updateHash) {
    const url = new URL(window.location.href);
    url.hash = `#${targetId}`;
    window.history.replaceState({}, "", url.toString());
  }
}

// Возвращает id секции из hash адресной строки, если он валиден
export function getInitialActiveFromHash(
  validSectionIds: readonly string[] = SECTION_IDS
): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.location.hash.replace(/^#/, "");
  return validSectionIds.includes(raw) ? raw : null;
}

// Вычисляет активную секцию на основании текущей прокрутки контейнера
export function calculateActiveSection(
  container: HTMLElement,
  sectionIds: readonly string[] = SECTION_IDS,
  offset = 0
): string {
  const containerRect = container.getBoundingClientRect();
  let bestId = sectionIds[0] ?? "";
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const distance = Math.abs(rect.top - containerRect.top - offset);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestId = id;
    }
  }

  return bestId;
}

// Хук, который отслеживает активную секцию при прокрутке контейнера и на старте берёт значение из hash
export function useActiveSection(
  sectionIds: readonly string[] = SECTION_IDS,
  options?: { containerId?: string; offset?: number }
): string {
  const containerId = options?.containerId ?? SCROLL_CONTAINER_ID;
  const offset = options?.offset ?? 0;

  // На сервере возвращаем пустую строку, чтобы избежать несоответствия HTML при гидрации.
  // После маунта активная секция вычислится из hash или прокрутки контейнера.
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const current = calculateActiveSection(container, sectionIds, offset);
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const onResize = onScroll;
    const onHashChange = () => {
      const fromHash = getInitialActiveFromHash(sectionIds);
      if (fromHash) setActive(fromHash);
    };

    // Восстанавливаем позицию скролла (если сохранена) и начальную активную секцию
    try {
      // Пробуем сначала получить из localStorage (переживает перезапуски вкладки),
      // если нет — fallback к sessionStorage
      const savedTop =
        localStorage.getItem(SCROLL_STORAGE_KEY) ??
        sessionStorage.getItem(SCROLL_STORAGE_KEY);
      if (savedTop) {
        container.scrollTop = parseInt(savedTop, 10) || 0;
        // не удаляем здесь ключ, пусть очистится на стороне страницы при ресторе
      }
      const fromHash = getInitialActiveFromHash(sectionIds);
      if (fromHash) {
        setActive(fromHash);
      } else {
        const savedActive = sessionStorage.getItem(ACTIVE_SECTION_STORAGE_KEY);
        if (savedActive && sectionIds.includes(savedActive)) {
          setActive(savedActive);
        }
      }
    } catch {}

    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("hashchange", onHashChange);

    // Инициализация после одного кадра, чтобы учесть возможный рестор скролла
    requestAnimationFrame(update);

    const onBeforeUnload = () => {
      try {
        // Сохраняем и в sessionStorage, и в localStorage, чтобы рестор работал и после полной перезагрузки
        sessionStorage.setItem(SCROLL_STORAGE_KEY, String(container.scrollTop));
        localStorage.setItem(SCROLL_STORAGE_KEY, String(container.scrollTop));
        const current = calculateActiveSection(container, sectionIds, offset);
        sessionStorage.setItem(ACTIVE_SECTION_STORAGE_KEY, current);
        localStorage.setItem(ACTIVE_SECTION_STORAGE_KEY, current);
      } catch {}
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pagehide", onBeforeUnload);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pagehide", onBeforeUnload);
    };
  }, [containerId, sectionIds, offset]);

  return active;
}

// Ключ для хранения активной секции в sessionStorage
export const ACTIVE_SECTION_STORAGE_KEY = "content-active-section";

// Сайд-эффект для синхронизации hash и sessionStorage при изменении активной секции
export function useSyncActiveSectionSideEffects(active: string) {
  useEffect(() => {
    if (!active) return;
    try {
      const url = new URL(window.location.href);
      const currentHash = url.hash.replace(/^#/, "");
      if (currentHash !== active) {
        url.hash = `#${active}`;
        window.history.replaceState({}, "", url.toString());
      }
      sessionStorage.setItem(ACTIVE_SECTION_STORAGE_KEY, active);
    } catch {}
  }, [active]);
}
