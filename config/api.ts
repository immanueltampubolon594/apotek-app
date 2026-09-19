export const BASE_URL = 'http://172.29.134.139:8000';
export const API_URL = `${BASE_URL}/api`;

export const getImageUrl = (foto?: string | null) => {
  if (!foto) return null;
  const match = foto.match(/\/storage\/.*/);
  if (match) return `${BASE_URL}${match[0]}`;
  if (!foto.startsWith('http')) return `${BASE_URL}/storage/${foto}`;
  return foto;
};