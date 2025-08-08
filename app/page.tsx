import Image from "next/image";
import s from "./page.module.css";
import { IconHome } from "@tabler/icons-react";
import Navigation from "@/components/Navigation/Navigation";
import Photo from "@/components/Photo/Photo";

export default function Home() {
  return (
    <div className={s.container}>
      <Navigation />
      <Photo />
      <div className={s.content}>
        <div className={s.TEST}>asascascascascasc</div>
      </div>
    </div>
  );
}
