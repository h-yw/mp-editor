function debounce(fn: Function, delay: number) {
  let timer: number;
  let start = Date.now();
  return function (this: any, ...args: any[]) {
    const now = Date.now();
    clearTimeout(timer);
    const remaining = delay - (now - start);
    if (remaining <= 0) {
      fn.apply(this, args);
      start = now;
    } else {
      // @ts-ignore
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, remaining);
    }
  };
}
export { debounce };
