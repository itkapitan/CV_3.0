import cn from "classnames";
import s from "../page.module.css";

import {
  IconBrandAdobeAfterEffect,
  IconBrandAdobeIllustrator,
  IconBrandAdobePhotoshop,
  IconBrandAdobePremier,
  IconBrandBlender,
  IconBrandCss3,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandHtml5,
  IconBrandMysql,
  IconBrandPlanetscale,
  IconBrandReact,
  IconBrandSupabase,
  IconBrandTypescript,
  IconBrandVue,
  IconFileTypeTsx,
  IconHttpQue,
} from "@tabler/icons-react";
import Navigation from "@/components/Navigation/Navigation";
import Photo from "@/components/Photo/Photo";
import Link from "next/link";
import Experience from "@/components/Experience/Experience";
import Lang from "@/components/Lang/Lang";
import { getDictionary } from "@/localization/getDictionary";
import ScrollRestorer from "./pageLogic";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className={s.container}>
      <ScrollRestorer />
      <Lang />
      <Navigation />
      <Photo />
      <div id="content-scroll" className={s.content}>
        <h2 className={s.title} id="about">
          {dict.about.title}
        </h2>
        <div className={s.p}>
          <div className={s.infoMini}>
            <div className={s.infoMiniText}>{dict.about.age}</div>
            <div className={s.infoMiniDivider}>|</div>
            <div className={s.infoMiniText}>{dict.about.city}</div>
            <div className={s.infoMiniDivider}>|</div>
            <div className={s.infoMiniText}>
              <Link href="#" target="_blank">
                Telegram
              </Link>
            </div>
            <div className={s.infoMiniDivider}>|</div>
            <div className={s.infoMiniText}>
              <Link href="#" target="_blank">
                +38 (066) 551-51-31
              </Link>
            </div>
          </div>

          <div className={s.info}>{dict.about.description}</div>
        </div>

        <h3 className={s.title} id="design">
          {dict.designSkills.title}
        </h3>

        <div className={s.greed}>
          <div className={s.greedItem}>
            <IconBrandFigma className={s.greedIcon} /> Figma 10/10
          </div>
          <div className={s.greedItem}>
            <IconBrandAdobePhotoshop className={s.greedIcon} /> Photoshop 10/10
          </div>
          <div className={s.greedItem}>
            <IconBrandAdobeIllustrator className={s.greedIcon} /> Illustrator
            10/10
          </div>
          <div className={s.greedItem}>
            <IconBrandAdobeAfterEffect className={s.greedIcon} /> After Effects
            8/10
          </div>
          <div className={s.greedItem}>
            <IconBrandAdobePremier className={s.greedIcon} /> Premier Pro 8/10
          </div>
          <div className={s.greedItem}>
            <IconBrandPlanetscale className={s.greedIcon} /> Spline 5/10
          </div>
          <div className={s.greedItem}>
            <IconBrandBlender className={s.greedIcon} /> Blender 5/10
          </div>
        </div>

        <div className={s.p}>
          <div className={cn(s.info, s.pt16)}>
            {dict.designSkills.description}
          </div>
        </div>

        <h3 className={s.title} id="dev">
          {dict.devSkills.title}
        </h3>

        <div className={s.greed}>
          <div className={s.greedItem}>
            <IconBrandHtml5 className={s.greedIcon} /> HTML 10/10
          </div>
          <div className={s.greedItem}>
            <IconBrandCss3 className={s.greedIcon} /> CSS 10/10
          </div>
          <div className={s.greedItem}>
            <IconFileTypeTsx className={s.greedIcon} /> JSX / TSX 10/10
          </div>
          <div className={s.greedItem}>
            <IconHttpQue className={s.greedIcon} /> jQuery 8/10 8/10
          </div>
          <div className={s.greedItem}>
            <IconBrandTypescript className={s.greedIcon} /> Java / Type Script
            10/10
          </div>
          <div className={s.greedItem}>
            <IconBrandReact className={s.greedIcon} /> React / Next JS 10/10
          </div>
          <div className={s.greedItem}>
            <IconBrandVue className={s.greedIcon} /> VUE 5/10
          </div>
          <div className={s.greedItem}>
            <IconBrandMysql className={s.greedIcon} /> MySQL 8/10
          </div>
          <div className={s.greedItem}>
            <IconBrandSupabase className={s.greedIcon} /> Supabase 8/10
          </div>
          <div className={s.greedItem}>
            <IconBrandGithub className={s.greedIcon} /> Github 8/10
          </div>
        </div>

        <div className={s.p}>
          <div className={cn(s.info, s.pt16)}>{dict.devSkills.description}</div>
        </div>

        <h3 className={s.title} id="exp">
          {dict.experience.title}
        </h3>

        <div className={s.experience}>
          {Array.isArray(dict.experienceCompany) ? (
            dict.experienceCompany.map((exp, idx) => (
              <Experience
                key={idx}
                item={exp}
                side={idx % 2 === 0 ? "left" : "right"}
              />
            ))
          ) : (
            <Experience item={dict.experienceCompany} side="left" />
          )}
        </div>
      </div>
    </div>
  );
}
