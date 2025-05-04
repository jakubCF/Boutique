// utils/localStorageTable.ts
export function loadTableState<T>(key: string): T | undefined {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : undefined;
    } catch {
      return undefined;
    }
  }
  
  export function saveTableState<T>(key: string, state: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      console.error("Failed to save table state");
    }
  }