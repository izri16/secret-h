import React from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {Tooltip, Box, IconButton} from '@material-ui/core'
import {PanTool as ContentCopy} from '@material-ui/icons'

const useCopyState = () => {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    }
  }, [copied, setCopied])
  return [copied, setCopied]
}

export const GameUrlToClipboard = () => {
  const [copied, setCopied] = useCopyState()
  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
      <CopyToClipboard
        text={window.location.href}
        onCopy={() => setCopied(true)}
      >
        <Box>
          <IconButton>
            <ContentCopy />
          </IconButton>
        </Box>
      </CopyToClipboard>
    </Tooltip>
  )
}
