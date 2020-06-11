
const debounce = function (fn, delay) {
  let inDebounce;
  return (ev, stop = false, ...args) => {
    clearTimeout(inDebounce);
    if (!stop) {
      const context = this;
      inDebounce = setTimeout(() => fn.apply(context, [ev, ...args]), delay);
    }
  };
};

export default debounce;
