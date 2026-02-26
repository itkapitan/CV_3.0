"use client";

import Link from "next/link";
import s from "./Photo.module.css";
import { IconBrandBehance, IconBrandDribbble } from "@tabler/icons-react";
import { usePhotoGlitchCanvas } from "./PhotoLogic";

type Profile = {
  name: string;
  position: string;
};

export default function Photo({ profile }: { profile: Profile }) {
  const canvasRef = usePhotoGlitchCanvas("/Rodion3.png");

  return (
    <div className={s.photoWr}>
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
