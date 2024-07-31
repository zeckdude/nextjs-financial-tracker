import createCache from '@emotion/cache';

export default function createEmotionCache() {
  return createCache({ key: 'toucan-website-css', prepend: true });
}
