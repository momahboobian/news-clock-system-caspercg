export const buildCGAddCommand = (layer: number, template: string, data: string) => {
  return `CG ${layer} ADD 1 "${template}" 1 '${data}'\r\n`
}
