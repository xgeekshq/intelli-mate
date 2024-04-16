import { headers } from 'next/headers';

export function getUrlPath() {
  const { get: getHeader } = headers();
  const urlPath = getHeader('url-path');

  return {
    urlPath,
  };
}
