import React from 'react'
import { LivePreview, LiveProvider, LiveError } from 'react-live'
import { useTheme } from '@geist-ui/core'
import makeCodeTheme from './code-theme'
import Editor from './editor'
import RefreshIcon from '@geist-ui/icons/refreshCw'
export interface Props {
  code: string
  replay?: boolean
  scope: {
    [key: string]: any
  }
}

const DynamicLive: React.FC<Props> = ({ code, scope, replay }) => {
  const theme = useTheme()
  const codeTheme = makeCodeTheme(theme)

  const [updated, setUpdated] = React.useState(1)
  return (
    <LiveProvider code={code} scope={scope} theme={codeTheme}>
      <div className="wrapper">
        <LivePreview key={updated} />
        <LiveError className="live-error" />
        {replay && (
          <div
            className="replay"
            role="button"
            tabIndex={1}
            onClick={() => {
              setUpdated(updated + 1)
            }}>
            <RefreshIcon size={12} />
          </div>
        )}
      </div>
      <Editor code={code} />
      <style jsx>{`
        .replay {
          position: absolute;
          top: 12px;
          right: 12px;
          display: inline-block;
          width: auto !important;
          cursor: pointer;
        }
        .wrapper {
          width: 100%;
          padding: ${theme.layout.pageMargin};
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          position: relative;
        }
        .wrapper > :global(div) {
          width: 100%;
          background-color: transparent;
        }
        .wrapper > :global(.live-error) {
          padding: 10px 12px 0 12px;
          margin-bottom: 0;
          border: 2px ${theme.palette.error} dotted;
          border-radius: 10px;
          color: ${theme.palette.errorLight};
          font-size: 13px;
        }
      `}</style>
    </LiveProvider>
  )
}

export default DynamicLive
