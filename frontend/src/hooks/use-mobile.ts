import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;
const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

const subscribe = (onChange: () => void) => {
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

export function useIsMobile() {
  return useSyncExternalStore(subscribe, () => query.matches);
}
