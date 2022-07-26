import { BaseSyntheticEvent } from 'react'

export const stopEventDefault = <T extends BaseSyntheticEvent>(e: T) => {
  e.preventDefault()
  e.stopPropagation()
}
