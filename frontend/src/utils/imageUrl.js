export function getFoodImageUrl(foodimage) {
  if (!foodimage) return '';
  if (foodimage.startsWith('http://') || foodimage.startsWith('https://')) {
    return foodimage;
  }
  const base = process.env.REACT_APP_API_URL || '';
  return `${base}${foodimage}`;
}
