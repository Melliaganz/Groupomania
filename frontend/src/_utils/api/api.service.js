import config from "./_config";

export default async function fetchApi({ path, page, requestOptions }) {
  try {
    const url = `${config.BASE_API}${path}${page ? `?${new URLSearchParams({ page })}` : ''}`;
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}


// console.log(result.json());
