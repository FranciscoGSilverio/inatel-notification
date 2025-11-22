import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Função para atualizar o valor no localStorage
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Função helper para salvar valores simples sem JSON
export function setLocalStorageItem(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value);
  }
}

// Função helper para ler valores simples
export function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(key);
}

// Função helper para disparar evento customizado quando localStorage muda
function dispatchLocalStorageChange(key: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('localStorageChange', { detail: { key } }));
  }
}

// Função helper para adicionar item a um array no localStorage
export function addToLocalStorageArray<T>(key: string, item: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const existing = window.localStorage.getItem(key);
    const array = existing ? JSON.parse(existing) : [];
    array.push(item);
    window.localStorage.setItem(key, JSON.stringify(array));
    dispatchLocalStorageChange(key);
  } catch (error) {
    console.error(`Error adding item to localStorage array "${key}":`, error);
  }
}

