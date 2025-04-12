import { AppContext } from '@/app/layout';
import { useContext } from 'react';

export function useAppContext() {
  return useContext(AppContext);
}
