"use client";

import Link from "next/link";
import cn from "classnames";
import s from "./Navigation.module.css";
import {
  handleNavClick,
  useActiveSection,
  useSyncActiveSectionSideEffects,
} from "./NavigationLogic";
import {
  IconBriefcase2,
  IconDevicesCode,
  IconPalette,
  IconUser,
} from "@tabler/icons-react";

export default function Navigation() {
  const active = useActiveSection();
  useSyncActiveSectionSideEffects(active);
  return (
    <div className={s.nav}>
      <Link
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          handleNavClick(
            e as unknown as React.MouseEvent<HTMLAnchorElement>,
            "about"
          );
        }}
        className={cn(s.link, {
          [s.linkActive]: active ? active === "about" : undefined,
        })}
      >
        <IconUser className={s.icon} />
      </Link>
      <Link
        href="#design"
        onClick={(e) => {
          e.preventDefault();
          handleNavClick(
            e as unknown as React.MouseEvent<HTMLAnchorElement>,
            "design"
          );
        }}
        className={cn(s.link, {
          [s.linkActive]: active ? active === "design" : undefined,
        })}
      >
        <IconPalette className={s.icon} />
      </Link>
      <Link
        href="#dev"
        onClick={(e) => {
          e.preventDefault();
          handleNavClick(
            e as unknown as React.MouseEvent<HTMLAnchorElement>,
            "dev"
          );
        }}
        className={cn(s.link, {
          [s.linkActive]: active ? active === "dev" : undefined,
        })}
      >
        <IconDevicesCode className={s.icon} />
      </Link>
      <Link
        href="#exp"
        onClick={(e) => {
          e.preventDefault();
          handleNavClick(
            e as unknown as React.MouseEvent<HTMLAnchorElement>,
            "exp"
          );
        }}
        className={cn(s.link, {
          [s.linkActive]: active ? active === "exp" : undefined,
        })}
      >
        <IconBriefcase2 className={s.icon} />
      </Link>
    </div>
  );
}
