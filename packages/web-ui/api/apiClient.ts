export type ClerkFetcherParamsType = {
  url: string;
  options?: RequestInit;
  jwtToken: string | null;
  isApplicationJson?: boolean;
};

function createFetch(baseUrl: string) {
  return function (url: string, options: RequestInit) {
    return fetch(baseUrl + url, options);
  };
}

const myFetch = createFetch(
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || ''
);

async function apiClient({
  url,
  options,
  jwtToken,
  isApplicationJson = true,
}: ClerkFetcherParamsType) {
  return myFetch(url, {
    ...options,
    headers: {
      ...(isApplicationJson ? { 'Content-Type': 'application/json' } : {}),
      'X-Clerk-Jwt-Token': jwtToken ?? '',
      ...options?.headers,
    },
  });
}

export { apiClient };
