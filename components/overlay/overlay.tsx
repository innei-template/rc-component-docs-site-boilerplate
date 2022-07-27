import { clsx } from 'clsx'

import type { CSSProperties, FC, ReactNode } from 'react'
import { memo, useEffect, useState } from 'react'

import { useIsClient } from '../_internal/hooks/use-is-client'
import { stopEventDefault } from '../_internal/utils/dom'

import { RootPortal } from '../_internal/components/portal'
import { FadeInOutTransitionView } from '@reactify-components/transition'

import styles from './overlay.module.css'
import React from 'react'
import { isUndefined, merge } from '../_internal/utils/_'

interface OverLayProps {
  onClose: () => void
  center?: boolean
  darkness?: number
  blur?: boolean
  zIndex?: number
}

export type OverlayProps = OverLayProps & {
  show: boolean
  children?: ReactNode

  zIndex?: number

  standaloneWrapperClassName?: string
}

const OverLay: FC<OverlayProps> = props => {
  const {
    onClose,
    show,
    blur,
    center,

    darkness,
    standaloneWrapperClassName,
    zIndex,
  } = props
  const isClient = useIsClient()

  const [isExitAnimationEnd, setIsExitAnimationEnd] = useState(!show)

  useEffect(() => {
    if (show) {
      setIsExitAnimationEnd(false)
    }
  }, [show])

  useEffect(() => {
    document.documentElement.style.overflow = show ? 'hidden' : ''
  }, [show])

  if (!isClient) {
    return null
  }

  return (
    <RootPortal>
      {!isExitAnimationEnd && (
        <div
          className={clsx(styles['container'], center && styles['center'])}
          style={typeof zIndex != 'undefined' ? { zIndex } : undefined}>
          <FadeInOutTransitionView
            in={show}
            onExited={() => setIsExitAnimationEnd(true)}
            unmountOnExit
            timeout={{ exit: 500 }}>
            <div
              className={styles['overlay']}
              style={merge<CSSProperties>(
                !isUndefined(darkness)
                  ? { backgroundColor: `rgba(0,0,0,${darkness})` }
                  : {},
                blur ? { backdropFilter: 'blur(5px)' } : {},
              )}
              onClick={onClose}
            />
          </FadeInOutTransitionView>
        </div>
      )}

      {!isExitAnimationEnd && (
        <div
          className={clsx(
            styles['overlay'],
            props.center && styles['center'],
            standaloneWrapperClassName,
          )}
          tabIndex={-1}
          onClick={props.onClose}
          style={
            typeof props.zIndex != 'undefined'
              ? {
                  zIndex: props.zIndex + 1,
                }
              : undefined
          }>
          <div onClick={stopEventDefault} tabIndex={-1}>
            {props.children}
          </div>
        </div>
      )}
    </RootPortal>
  )
}

OverLay.defaultProps = {
  center: true,
}
export const Overlay = memo(OverLay)
