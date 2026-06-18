import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const DEFAULT_PROVIDER_CONFIG_PATH = path.join(projectRoot, "providers.json");

export async function loadProviders(configPath = DEFAULT_PROVIDER_CONFIG_PATH) {
  const rawConfig = await fs.readFile(configPath, "utf8");
  const config = JSON.parse(rawConfig);

  validateProviderConfig(config, configPath);

  return config.providers.map((provider) => ({
    ...provider,
  }));
}

export function getHomeDir(env = process.env) {
  return env.HOME || os.homedir();
}

export function expandHome(inputPath, homeDir) {
  if (inputPath === "~") {
    return homeDir;
  }

  if (inputPath.startsWith("~/")) {
    return path.join(homeDir, inputPath.slice(2));
  }

  return inputPath;
}

export function sourceSkillsDir(homeDir) {
  return path.join(homeDir, ".agents", "skills");
}

export function providerWithResolvedPath(provider, homeDir) {
  return {
    ...provider,
    configuredSkillsDir: provider.skillsDir,
    skillsDir: expandHome(provider.skillsDir, homeDir),
  };
}

function validateProviderConfig(config, configPath) {
  if (!config || !Array.isArray(config.providers)) {
    throw new Error(`Provider config must contain a providers array: ${configPath}`);
  }

  const ids = new Set();
  const flags = new Set();

  for (const provider of config.providers) {
    validateProvider(provider, configPath);

    if (ids.has(provider.id)) {
      throw new Error(`Duplicate provider id in ${configPath}: ${provider.id}`);
    }

    if (flags.has(provider.flag)) {
      throw new Error(`Duplicate provider flag in ${configPath}: ${provider.flag}`);
    }

    ids.add(provider.id);
    flags.add(provider.flag);
  }
}

function validateProvider(provider, configPath) {
  for (const field of ["id", "flag", "label", "skillsDir"]) {
    if (typeof provider[field] !== "string" || provider[field].trim() === "") {
      throw new Error(`Provider entries in ${configPath} must include a non-empty ${field}`);
    }
  }

  if (!provider.flag.startsWith("--")) {
    throw new Error(`Provider flag must start with -- in ${configPath}: ${provider.flag}`);
  }
}
