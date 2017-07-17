export function shuffle(list) {
  if (list && list.length) {
    return list.slice().sort(() => Math.random() > 0.5 ? 1 : -1)
  }
  return list
}

export function throttle(fn, interval) {
  let timer
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, interval)
  }
}
