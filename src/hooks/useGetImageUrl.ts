export const useGetImageUrl = (name: string, path?: string | null | undefined) => {
  if (path === undefined) return new URL(`/src/assets/images/${name}`, import.meta.url).href;
  if (path === null) return new URL(`/src/assets/${name}`, import.meta.url).href;
  return new URL(`/src/assets/${path}/${name}`, import.meta.url).href;
};
