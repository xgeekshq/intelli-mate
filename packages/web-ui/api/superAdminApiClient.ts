type SuperAdminFetcherParamsType = {
  url: string;
  options?: RequestInit;
  superAdminEmail?: string;
  superAdminPassword?: string;
};

function createFetch(baseUrl: string) {
  return function (url: string, options: RequestInit) {
    return fetch(baseUrl + url, options);
  };
}

const myFetch = createFetch(
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || ''
);

async function superAdminApiClient({
  url,
  options,
  superAdminEmail = '',
  superAdminPassword = '',
}: SuperAdminFetcherParamsType) {
  return myFetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
      'X-Super-Admin-Email': superAdminEmail,
      'X-Super-Admin-Password': superAdminPassword,
    },
  });
}

export { superAdminApiClient };
