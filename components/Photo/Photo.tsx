"use client";

import Link from "next/link";
import s from "./Photo.module.css";
import { IconBrandBehance, IconBrandDribbble } from "@tabler/icons-react";
import { usePhotoGlitchCanvas } from "./PhotoLogic";

type Profile = {
  name: string;
  position: string;
};

export default function Photo({
  profile,
  variant = "desktop",
}: {
  profile: Profile;
  variant?: "desktop" | "inline";
}) {
  const canvasRef = usePhotoGlitchCanvas("/Rodion4.png");

  if (variant === "inline") {
    return (
      <div className={s.inlineCard}>
        <div className={s.inlineAvatarWr}>
          <img
            src="/Rodion4.png"
            alt={profile.name}
            className={s.inlinePhotoBase}
            loading="eager"
            decoding="sync"
          />
          <canvas ref={canvasRef} className={s.inlinePhotoCanvas} />
        </div>
        <div className={s.inlineInfo}>
          <div className={s.inlineName}>{profile.name}</div>
          <div className={s.inlinePosition}>{profile.position}</div>
          <div className={s.inlineLinks}>
            <Link
              href="https://www.behance.net/uiArchitect"
              target="_blank"
              className={s.inlineLinkPill}
            >
              <IconBrandBehance size={18} />
              <span>Behance</span>
            </Link>
            <Link
              href="https://dribbble.com/uiArchitect"
              target="_blank"
              className={s.inlineLinkPill}
            >
              <IconBrandDribbble size={18} />
              <span>Dribbble</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.photoWr}>
      <img
        src="/Rodion4.png"
        alt={profile.name}
        className={s.photoBase}
        loading="eager"
        decoding="sync"
      />
      <canvas ref={canvasRef} className={s.photoCanvas} />
      <div className={s.name}>{profile.name}</div>
      <div className={s.position}>{profile.position}</div>
      <div className={s.links}>
        <Link
          href="https://www.behance.net/uiArchitect"
          target="_blank"
          className={s.linkItem}
        >
          <IconBrandBehance />
        </Link>
        <Link
          href="https://dribbble.com/uiArchitect"
          target="_blank"
          className={s.linkItem}
        >
          <IconBrandDribbble />
        </Link>
      </div>
    </div>
  );
}
