export const idGenerator = () => {
  return (
    new Date().getTime().toString(36).slice(4) +
    Math.random().toString(36).slice(4)
  );
};
