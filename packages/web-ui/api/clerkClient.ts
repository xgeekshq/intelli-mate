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

const myFetch = createFetch(process.env.API_URL || '');
async function clerkClient({
  url,
  options,
  sessionId,
  jwtToken,
}: ClerkFetcherParamsType) {
  const res = await myFetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'X-Clerk-Session-Id': sessionId,
      'X-Clerk-Jwt-Token': jwtToken,
    },
  });

  return res.json();
}

export { clerkClient };
