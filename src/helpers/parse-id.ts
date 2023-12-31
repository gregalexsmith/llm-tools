export const parseId = (id: number | string | string[] | undefined) => {
  if (typeof id === "string") {
    return parseInt(id);
  }
  if (typeof id === "number") {
    return id;
  }

  throw new Error("Invalid id");
};
