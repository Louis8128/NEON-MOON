export function redirectToAdminLogin() {
  const nextPath = `${window.location.pathname}${window.location.search}`;

  window.location.href = `/admin/login?next=${encodeURIComponent(nextPath)}`;
}

export async function readJsonResponse<T>(response: Response) {
  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}

export function redirectIfUnauthorized(response: Response) {
  if (response.status !== 401) {
    return false;
  }

  redirectToAdminLogin();
  return true;
}
