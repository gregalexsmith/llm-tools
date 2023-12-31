export const isCtrlEnter = (e: React.KeyboardEvent<HTMLFormElement>) => {
  return (e.metaKey || e.ctrlKey) && e.key === "Enter";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type onMetaEnterCallback = (e: FormData) => Promise<any>;

export const onMetaEnter = (cb: onMetaEnterCallback) => {
  return async (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (isCtrlEnter(e)) {
      await cb(new FormData(e.currentTarget));
    }
  };
};
