import config from "./_config";

export default function fetchApi(path, page, requestOptions = {}) {
  const url = page
    ? `${config.BASE_API}${path}?${new URLSearchParams({ page })}`
    : `${config.BASE_API}${path}`;

  return fetch(url, {
    ...requestOptions,
    credentials: 'include'  // Ensure credentials are always included
  });
}