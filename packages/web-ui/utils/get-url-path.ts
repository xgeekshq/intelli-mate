import { headers } from 'next/headers';

export function getUrlPath() {
  const { get: getHeader } = headers();
  const urlPath = getHeader('x-invoke-path');

  return {
    urlPath,
  };
}
