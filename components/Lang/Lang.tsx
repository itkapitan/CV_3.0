"use client";

import cn from "classnames";
import s from "./Lang.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildLangHref, isActiveLang, saveContentScroll } from "./LangLogic";

export default function Lang() {
  const pathname = usePathname();
  const enHref = buildLangHref("en", pathname);
  const uaHref = buildLangHref("ua", pathname);
  const ruHref = buildLangHref("ru", pathname);

  return (
    <div className={s.lang}>
      <Link
        href={enHref}
        scroll={false}
        onClick={saveContentScroll}
        className={cn(s.langLink, {
          [s.langLinkActive]: isActiveLang("en", pathname),
        })}
      >
        EN
      </Link>
      <Link
        href={uaHref}
        scroll={false}
        onClick={saveContentScroll}
        className={cn(s.langLink, {
          [s.langLinkActive]: isActiveLang("ua", pathname),
        })}
      >
        UA
      </Link>
      <Link
        href={ruHref}
        scroll={false}
        onClick={saveContentScroll}
        className={cn(s.langLink, {
          [s.langLinkActive]: isActiveLang("ru", pathname),
        })}
      >
        RU
      </Link>
    </div>
  );
}
