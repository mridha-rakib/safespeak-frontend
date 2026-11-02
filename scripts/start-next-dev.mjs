import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import net from "node:net";

const require = createRequire(import.meta.url);

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const index = args.indexOf(name);
  if (index === -1 || !args[index + 1]) {
    return fallback;
  }
  return args[index + 1];
};

async function isPortAvailable(port) {
  const checkHost = (host) => {
    return new Promise((resolve) => {
      const server = net.createServer();

      server.unref();
      server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          resolve(false);
        } else {
          resolve(true);
        }
      });
      server.listen({ port, host }, () => {
        server.close(() => resolve(true));
      });
    });
  };

  const hosts = ["127.0.0.1", "::1", "0.0.0.0", "::"];
  const results = await Promise.all(hosts.map((host) => checkHost(host)));
  return results.every((res) => res === true);
}

async function findAvailablePort(startPort, maxAttempts = 25) {
  for (let offset = 0; offset < maxAttempts; offset += 1) {
    const candidatePort = startPort + offset;

    // eslint-disable-next-line no-await-in-loop
    if (await isPortAvailable(candidatePort)) {
      return candidatePort;
    }
  }

  throw new Error(
    `No available port found between ${startPort} and ${startPort + maxAttempts - 1}.`
  );
}

const requestedPort = Number.parseInt(getArg("--port", "3000"), 10);
const requestedDistDir = getArg("--dist", ".next-dev");
const useWebpack = args.includes("--webpack");
const nextBin = require.resolve("next/dist/bin/next");

async function run() {
  const resolvedPort = await findAvailablePort(requestedPort);
  const resolvedDistDir =
    resolvedPort === requestedPort
      ? requestedDistDir
      : `${requestedDistDir}-${resolvedPort}`;
  const nextArgs = ["dev", "-p", String(resolvedPort)];

  if (!useWebpack) {
    nextArgs.splice(1, 0, "--turbopack");
  }

  if (resolvedPort !== requestedPort) {
    console.log(
      `[SafeSpeak frontend] Port ${requestedPort} is busy, using ${resolvedPort} instead.`
    );
  }

  console.log(
    `[SafeSpeak frontend] Starting on http://localhost:${resolvedPort} with dist dir "${resolvedDistDir}".`
  );

  const child = spawn(process.execPath, [nextBin, ...nextArgs], {
    env: {
      ...process.env,
      NEXT_DIST_DIR: resolvedDistDir,
    },
    stdio: "inherit",
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

run().catch((error) => {
  console.error(
    `[SafeSpeak frontend] Failed to start dev server: ${error instanceof Error ? error.message : String(error)}`
  );
  process.exit(1);
});
