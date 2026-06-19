import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const DEFAULT_CONFIG_PATH = path.join(projectRoot, "agent-sync.json");
export const DEFAULT_PROVIDER_CONFIG_PATH = DEFAULT_CONFIG_PATH;

export async function loadConfig(configPath = DEFAULT_CONFIG_PATH) {
  const rawConfig = await fs.readFile(configPath, "utf8");
  const config = normalizeConfig(JSON.parse(rawConfig));

  validateConfig(config, configPath);

  return config;
}

export async function loadProviders(configPath = DEFAULT_PROVIDER_CONFIG_PATH) {
  const config = await loadConfig(configPath);
  const skillsArtifact = config.artifacts.find((artifact) => artifact.type === "skills");

  return skillsArtifact
    ? skillsArtifact.providers.map((provider) => ({
        ...provider,
        skillsDir: provider.destinationDir,
      }))
    : [];
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

export function configWithResolvedPaths(config, homeDir) {
  return {
    ...config,
    artifacts: config.artifacts.map((artifact) => artifactWithResolvedPaths(artifact, homeDir)),
  };
}

export function artifactProviderSummaries(config) {
  const byFlag = new Map();

  for (const artifact of config.artifacts) {
    for (const provider of artifact.providers) {
      const existing = byFlag.get(provider.flag);
      const artifactLabel = artifact.label || artifact.id;

      if (existing) {
        existing.artifactLabels.add(artifactLabel);
        continue;
      }

      byFlag.set(provider.flag, {
        id: provider.id,
        flag: provider.flag,
        label: provider.label,
        artifactLabels: new Set([artifactLabel]),
      });
    }
  }

  return [...byFlag.values()].sort((left, right) => left.flag.localeCompare(right.flag));
}

function normalizeConfig(config) {
  if (config && Array.isArray(config.providers)) {
    return {
      artifacts: [
        {
          id: "skills",
          label: "skills",
          type: "skills",
          default: true,
          sourceDir: "~/.agents/skills",
          providers: config.providers.map((provider) => ({
            id: provider.id,
            flag: provider.flag,
            label: provider.label,
            destinationDir: provider.skillsDir,
          })),
        },
      ],
    };
  }

  return config;
}

function artifactWithResolvedPaths(artifact, homeDir) {
  if (artifact.type === "skills") {
    return {
      ...artifact,
      sourceDir: expandHome(artifact.sourceDir, homeDir),
      providers: artifact.providers.map((provider) => ({
        ...provider,
        configuredSkillsDir: provider.destinationDir,
        skillsDir: expandHome(provider.destinationDir, homeDir),
      })),
    };
  }

  if (artifact.type === "file") {
    return {
      ...artifact,
      sourceFile: expandHome(artifact.sourceFile, homeDir),
      providers: artifact.providers.map((provider) => ({
        ...provider,
        configuredDestinationFile: provider.destinationFile,
        destinationFile: expandHome(provider.destinationFile, homeDir),
      })),
    };
  }

  return artifact;
}

function validateConfig(config, configPath) {
  if (!config || !Array.isArray(config.artifacts)) {
    throw new Error(`Agent sync config must contain an artifacts array: ${configPath}`);
  }

  const artifactIds = new Set();
  const providerFlags = new Map();

  for (const artifact of config.artifacts) {
    validateArtifact(artifact, configPath);

    if (artifactIds.has(artifact.id)) {
      throw new Error(`Duplicate artifact id in ${configPath}: ${artifact.id}`);
    }

    artifactIds.add(artifact.id);

    for (const provider of artifact.providers) {
      validateProvider(provider, artifact, configPath);

      const existing = providerFlags.get(provider.flag);

      if (existing && existing.id !== provider.id) {
        throw new Error(`Provider flag ${provider.flag} maps to both ${existing.id} and ${provider.id} in ${configPath}`);
      }

      providerFlags.set(provider.flag, provider);
    }
  }
}

function validateArtifact(artifact, configPath) {
  for (const field of ["id", "label", "type"]) {
    if (typeof artifact[field] !== "string" || artifact[field].trim() === "") {
      throw new Error(`Artifact entries in ${configPath} must include a non-empty ${field}`);
    }
  }

  if (!["skills", "file"].includes(artifact.type)) {
    throw new Error(`Unsupported artifact type in ${configPath}: ${artifact.type}`);
  }

  if (!Array.isArray(artifact.providers)) {
    throw new Error(`Artifact ${artifact.id} in ${configPath} must include a providers array`);
  }

  if (artifact.type === "skills" && (typeof artifact.sourceDir !== "string" || artifact.sourceDir.trim() === "")) {
    throw new Error(`Artifact ${artifact.id} in ${configPath} must include a non-empty sourceDir`);
  }

  if (artifact.type === "file" && (typeof artifact.sourceFile !== "string" || artifact.sourceFile.trim() === "")) {
    throw new Error(`Artifact ${artifact.id} in ${configPath} must include a non-empty sourceFile`);
  }

  const ids = new Set();
  const flags = new Set();

  for (const provider of artifact.providers) {
    if (ids.has(provider.id)) {
      throw new Error(`Duplicate provider id for artifact ${artifact.id} in ${configPath}: ${provider.id}`);
    }

    if (flags.has(provider.flag)) {
      throw new Error(`Duplicate provider flag for artifact ${artifact.id} in ${configPath}: ${provider.flag}`);
    }

    ids.add(provider.id);
    flags.add(provider.flag);
  }
}

function validateProvider(provider, artifact, configPath) {
  for (const field of ["id", "flag", "label"]) {
    if (typeof provider[field] !== "string" || provider[field].trim() === "") {
      throw new Error(`Provider entries in ${configPath} must include a non-empty ${field}`);
    }
  }

  if (!provider.flag.startsWith("--")) {
    throw new Error(`Provider flag must start with -- in ${configPath}: ${provider.flag}`);
  }

  if (artifact.type === "skills" && (typeof provider.destinationDir !== "string" || provider.destinationDir.trim() === "")) {
    throw new Error(`Provider ${provider.id} for artifact ${artifact.id} in ${configPath} must include a non-empty destinationDir`);
  }

  if (artifact.type === "file") {
    if (typeof provider.destinationFile !== "string" || provider.destinationFile.trim() === "") {
      throw new Error(`Provider ${provider.id} for artifact ${artifact.id} in ${configPath} must include a non-empty destinationFile`);
    }

    if (!["symlink", "template"].includes(provider.mode)) {
      throw new Error(`Provider ${provider.id} for artifact ${artifact.id} in ${configPath} must use mode symlink or template`);
    }

    if (provider.mode === "template" && typeof provider.template !== "string") {
      throw new Error(`Provider ${provider.id} for artifact ${artifact.id} in ${configPath} must include a template string`);
    }
  }
}
