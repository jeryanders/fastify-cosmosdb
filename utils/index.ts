const normalizeSnakeCase = (str: string) => {
  return str.split('-').map((word: string, index: number) => {
    if (index === 0) return word.toLowerCase()

    return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()
  }).join('');
}

export const camelize = (str: string) => {
  if (str.indexOf('-') > 0) return normalizeSnakeCase(str)
  return str.replace(/(?:^\w|[A-Z ]|\b\w)/g, function (word: string, index: number) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/\s+/g, '')
}
