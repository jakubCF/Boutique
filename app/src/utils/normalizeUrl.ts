export const normalizePoshmarkUrl = (inputUrl: string): string => {
  const match = inputUrl.match(/([a-f0-9]{24})$/i);
  if (!match) return inputUrl;

  const itemId = match[1];

  try {
    const url = new URL(inputUrl);
    return `${url.origin}/listing/${itemId}`;
  } catch (err) {
    return inputUrl;
  }
};