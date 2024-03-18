import { useLocalStorage as useLocalStorageState } from 'usehooks-ts'

export const useLocalStorage = (key, initialValue) => {
  return useLocalStorageState(key, initialValue, { initializeWithValue: false })
}
