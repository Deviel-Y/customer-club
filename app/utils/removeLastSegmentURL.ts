export const removeLastSegmentURL = (url: string) => {
  const segments = url.split("/");
  segments.pop();
  return segments.join("/");
};
