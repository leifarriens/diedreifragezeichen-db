// https://grafana.com/load-testing/types-of-load-testing/

// smoke test
// https://grafana.com/blog/2024/01/30/smoke-testing/
const smoke = {
  duration: "1m", // This can be shorter or just a few iterations
  vus: 3, // Key for Smoke test. Keep it at 2, 3, max 5 VUs
};

// average-load test
// https://grafana.com/docs/k6/latest/testing-guides/test-types/load-testing/
const average = {
  stages: [
    { duration: "5m", target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
    { duration: "30m", target: 100 }, // stay at 100 users for 30 minutes
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
};

// stress test
// https://grafana.com/blog/2024/01/30/stress-testing/
const stress = {
  // Key configurations for Stress in this section
  stages: [
    { duration: "10m", target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
    { duration: "30m", target: 200 }, // stay at higher 200 users for 30 minutes
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
};

// spike test
// https://grafana.com/docs/k6/latest/testing-guides/test-types/spike-testing/
const spike = {
  // Key configurations for spike in this section
  stages: [
    { duration: "2m", target: 2000 }, // fast ramp-up to a high point
    // No plateau
    { duration: "1m", target: 0 }, // quick ramp-down to 0 users
  ],
};

// breakpint
// https://grafana.com/blog/2024/01/30/breakpoint-testing/
const breakpoint = {
  executor: "ramping-arrival-rate", // Assure load increase if the system slows
  // Key configurations for breakpoint in this section
  stages: [
    { duration: "2h", target: 20000 }, // just slowly ramp-up to a HUGE load
  ],
  thresholds: {
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
  },
};

export const configs = { average, breakpoint, smoke, spike, stress } as const;
