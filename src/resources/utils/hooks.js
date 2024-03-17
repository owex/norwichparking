import { useLocalStorage as useLocalStorageState } from '@uidotdev/usehooks'

export const useLocalStorage = (key, initialValue) => {
  return useLocalStorageState(key, initialValue)
}
