export type StoredPortfolio = { assets: unknown[]; transactions: unknown[]; updatedAt: string };

const DB_NAME = "klaro-capital";
const STORE = "portfolio";
const KEY = "current";

export async function loadPortfolio(): Promise<StoredPortfolio | null> {
  if (typeof window === "undefined") return null;
  if (!("indexedDB" in window)) {
    const value = localStorage.getItem(DB_NAME);
    return value ? JSON.parse(value) : null;
  }
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onerror = () => resolve(null);
    request.onsuccess = () => {
      const tx = request.result.transaction(STORE, "readonly");
      const get = tx.objectStore(STORE).get(KEY);
      get.onsuccess = () => resolve(get.result ?? null);
      get.onerror = () => resolve(null);
    };
  });
}

export async function savePortfolio(value: StoredPortfolio) {
  if (typeof window === "undefined") return;
  if (!("indexedDB" in window)) {
    localStorage.setItem(DB_NAME, JSON.stringify(value));
    return;
  }
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const tx = request.result.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(value, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
  });
}

export async function clearPortfolio() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DB_NAME);
  if (!("indexedDB" in window)) return;
  return new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = request.onerror = request.onblocked = () => resolve();
  });
}
