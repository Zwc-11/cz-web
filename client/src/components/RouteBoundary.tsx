import * as Dialog from '@radix-ui/react-dialog'
import { Component, type ReactNode } from 'react'

export function RouteLoading({ onClose }: {onClose: () => void}) {
  return <Dialog.Root open onOpenChange={open => {if (!open) onClose()}}><Dialog.Portal>
    <Dialog.Content className="case-loading" aria-describedby={undefined}>
      <Dialog.Title>Opening the project…</Dialog.Title>
      <Dialog.Close>Back to portfolio</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>
}

export class RouteBoundary extends Component<{children: ReactNode; onClose: () => void}, {failed: boolean}> {
  state = {failed:false}
  static getDerivedStateFromError() { return {failed:true} }
  render() {
    if (!this.state.failed) return this.props.children
    return <Dialog.Root open onOpenChange={open => {if (!open) this.props.onClose()}}><Dialog.Portal>
      <Dialog.Content className="case-loading">
        <Dialog.Title>This page could not load.</Dialog.Title>
        <Dialog.Description>Reload to try again, or return to the portfolio.</Dialog.Description>
        <button type="button" onClick={() => window.location.reload()}>Reload page</button>
        <Dialog.Close>Back to portfolio</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal></Dialog.Root>
  }
}
