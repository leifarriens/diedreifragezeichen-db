/* eslint-disable no-console */
import { check, sleep } from "k6";
import http from "k6/http";

import { configs } from "./k6.config.ts";

type Config = keyof typeof configs;

const config = __ENV.TEST_CONFIG ?? "smoke";

const configKeys = Object.keys(configs);

if (!configKeys.includes(config)) {
  throw new Error(
    `Invalid TEST_CONFIG value: ${config}. Must be one of: ${configKeys.join(", ")}`,
  );
}

export const options = configs[config as Config];

const ENDPOINT_URL = __ENV.ENDPOINT_URL;

if (!ENDPOINT_URL) {
  throw new Error("ENDPOINT_URL environment variable is not set");
}

export default function () {
  if (!ENDPOINT_URL) {
    throw new Error("ENDPOINT_URL environment variable is not set");
  }

  const res = http.get(ENDPOINT_URL);
  console.log(res.status, res.status_text);
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}
