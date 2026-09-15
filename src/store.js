/**
 * In-memory store for travel-rule messages, keyed by generated ID.
 *
 * Same caveat as the screening-service's store.js: this is a reference-
 * implementation simplification. A production deployment needs a durable
 * store, ideally one that also gives anchors a durable audit trail of
 * messages sent/received (which an in-memory Map obviously doesn't).
 */

const store = new Map();
let nextId = 1;

export function saveMessage(message) {
  const id = String(nextId++);
  const record = { id, ...message, receivedAt: new Date().toISOString() };
  store.set(id, record);
  return record;
}

export function getMessage(id) {
  return store.get(id) ?? null;
}

export function listMessages({ limit = 50 } = {}) {
  return Array.from(store.values())
    .sort((a, b) => (a.receivedAt < b.receivedAt ? 1 : -1))
    .slice(0, limit);
}

export function _resetStoreForTests() {
  store.clear();
  nextId = 1;
}
