export const getImageUrl = (image: string) => {
  return image.replace(
    'http://localhost:9107/',
    process.env.MEDUSA_BACKEND_URL || ''
  );
};
