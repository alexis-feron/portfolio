import { AppContext } from 'app/providers';
import { useContext } from 'react';

export function useAppContext() {
  return useContext(AppContext);
}
