import { useLayoutEffect } from 'react';

export const useRewriteLinks = (contentLoaded: boolean, route: any, selectorString: string) => {
  useLayoutEffect(() => {
    const links = document.querySelectorAll(selectorString);
    links.forEach((l) => {
      const href = l.getAttribute('href');
      if (href?.startsWith('#')) {
        const newHref = `${route}${href}`;
        l.setAttribute('href', newHref);
      }
    });
  }, [contentLoaded]);
};
