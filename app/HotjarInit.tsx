"use client";

import { useEffect } from "react";
import Hotjar from "@hotjar/browser";

const siteId = 6498208;
const hotjarVersion = 6;

export default function HotjarInit() {
  useEffect(() => {
    try {
      Hotjar.init(siteId, hotjarVersion);
    } catch {}
  }, []);

  return null;
}
