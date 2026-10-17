import { promises as fs } from "node:fs";
import path from "node:path";

export type Settings = {
  siteName: string;
  description: string;
  hoverPreviews: boolean;
};

const SETTINGS_FILE = path.join(process.cwd(), "content", "settings.json");

export function defaultSettings(): Settings {
  return {
    siteName: process.env.SITE_NAME?.trim() || "Enchanted Wiki",
    description: "Documentation wiki.",
    hoverPreviews: true,
  };
}

export async function getSettings(): Promise<Settings> {
  const defaults = defaultSettings();
  try {
    const raw = JSON.parse(await fs.readFile(SETTINGS_FILE, "utf8")) as Partial<Settings>;
    return {
      siteName: raw.siteName?.trim() || defaults.siteName,
      description: typeof raw.description === "string" ? raw.description : defaults.description,
      hoverPreviews: typeof raw.hoverPreviews === "boolean" ? raw.hoverPreviews : defaults.hoverPreviews,
    };
  } catch {
    return defaults;
  }
}

export async function saveSettings(settings: Settings) {
  await fs.writeFile(SETTINGS_FILE, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}
