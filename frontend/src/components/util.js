// get current time
export const getLocalTime = () => {
  const timeNow = new Date();
  const offset = timeNow.getTimezoneOffset() * 60000;
  const localISOTime = new Date(timeNow - offset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return localISOTime;
};
