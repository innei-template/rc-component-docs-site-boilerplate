export const isUndefined = (value: any) => typeof value === 'undefined'

export const merge = <T>(...objects: any[]) => {
  return objects.reduce((acc, obj) => {
    return { ...acc, ...obj }
  }, {}) as T
}
