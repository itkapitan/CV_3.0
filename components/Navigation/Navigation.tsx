import Link from "next/link";
import s from "./Navigation.module.css";

export default function Navigation() {
  return (
    <div className={s.nav}>
      <Link href="/">Home</Link>
      <Link href="/">About</Link>
      <Link href="/">Contact</Link>
    </div>
  );
}
