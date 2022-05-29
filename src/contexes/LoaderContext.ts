import { createContext, Dispatch, SetStateAction } from 'react';

export const LoaderContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>([
  false,
  () => {
  }
])
