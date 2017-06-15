export function addClass(el, className) {
  el.classList.add(className)
}

export function hasClass(el, className) {
  return new RegExp('\\b' + className + '\\b').test(el.className)
}

export function dataAttr(el, name, val) {
  const prefix = 'data-'
  if (val !== undefined) {
    return el.setAttribute(prefix + name, val)
  }
  return el.getAttribute(prefix + name)
}
