interface Options {
  leading?: boolean;
  trailing?: boolean;
}

export default function throttle(
  func: (e: any) => void,
  wait: number,
  options?: Options
) {
  // @ts-ignore
  var context, args, result;
  // @ts-ignore
  var timeout = null;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    // @ts-ignore
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    // @ts-ignore
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  return function () {
    var now = Date.now();
    // @ts-ignore
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    // @ts-ignore
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      // @ts-ignore
      if (timeout) {
        // @ts-ignore
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      // @ts-ignore
      result = func.apply(context, args);
      // @ts-ignore
      if (!timeout) context = args = null;
      // @ts-ignore
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    // @ts-ignore
    return result;
  };
}
