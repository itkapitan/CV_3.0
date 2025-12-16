"use client";

import { useEffect } from "react";

const clarityId = "umjul1ropk";

export default function ClarityInit() {
  useEffect(() => {
    try {
      (function (c: any, l: Document, a: string, r: string, i: string) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        const t = l.createElement(r) as HTMLScriptElement;
        t.async = true;
        t.src = "https://www.clarity.ms/tag/" + i;
        const y = l.getElementsByTagName(r)[0];
        y.parentNode?.insertBefore(t, y);
      })(window, document, "clarity", "script", clarityId);
    } catch {}
  }, []);

  return null;
}

