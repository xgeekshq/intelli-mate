type ClerkFetcherParamsType = {
  url: string;
  options?: RequestInit;
  sessionId: string;
  jwtToken: string;
};

function createFetch(baseUrl: string) {
  return function (url: string, options: RequestInit) {
    return fetch(baseUrl + url, options);
  };
}

const myFetch = createFetch(
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || ''
);

async function client({
  url,
  options,
  sessionId,
  jwtToken,
}: ClerkFetcherParamsType) {
  return await myFetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
      'X-Clerk-Session-Id': sessionId,
      'X-Clerk-Jwt-Token': jwtToken,
    },
  });
}
export { client };
