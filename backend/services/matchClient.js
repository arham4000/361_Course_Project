const config = require('../config');

const TIMEOUT_MS = 10000;

async function requestMatch(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${config.matchingServiceUrl}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const response = await res.json();
    return response;
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') throw new Error('Matching service timeout');
    throw err;
  }
}

module.exports = { requestMatch };
