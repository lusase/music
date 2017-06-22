export function shuffle(list) {
  if (list && list.length) {
    return list.slice().sort(() => Math.random() > 0.5 ? 1 : -1)
  }
  return list
}
