import cn from "classnames";
import s from "./Experience.module.css";

type ExperienceItem = {
  title: string;
  position: string;
  period: string;
  description: string;
};

export default function Experience({
  item,
  side = "left",
}: {
  item: ExperienceItem;
  side?: "left" | "right";
}) {
  return (
    <div className={cn(s.expItem, side === "left" ? s.expLeft : s.expRight)}>
      <div className={s.expTitle}>{item.title}</div>
      <div className={s.expPosition}>{item.position}</div>
      <div className={s.expPeriod}>{item.period}</div>
      <div className={s.expDescription}>{item.description}</div>
    </div>
  );
}
