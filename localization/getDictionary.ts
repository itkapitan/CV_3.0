import en from "./en.json";
import ua from "./ua.json";
import ru from "./ru.json";

export type Dictionary = typeof en;

export async function getDictionary(lang: string): Promise<Dictionary> {
  switch (lang) {
    case "ua":
      return ua;
    case "ru":
      return ru;
    case "en":
    default:
      return en;
  }
}
