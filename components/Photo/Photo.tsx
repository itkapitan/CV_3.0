import Link from "next/link";
import s from "./Photo.module.css";
import { IconBrandBehance, IconBrandDribbble } from "@tabler/icons-react";

export default function Photo() {
  return (
    <div className={s.photoWr}>
      <div className={s.name}>Родион Бычковяк</div>
      <div className={s.position}>
        Lead UI/UX/Product Designer & Frontend Developer
      </div>
      <div className={s.links}>
        <Link href="#" target="_blank" className={s.linkItem}>
          <IconBrandBehance />
        </Link>
        <Link href="#" target="_blank" className={s.linkItem}>
          <IconBrandDribbble />
        </Link>
      </div>
    </div>
  );
}
