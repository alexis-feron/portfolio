import { useContext } from 'react';
import { AppContext } from 'app/providers';

export function useAppContext() {
  return useContext(AppContext);
}
