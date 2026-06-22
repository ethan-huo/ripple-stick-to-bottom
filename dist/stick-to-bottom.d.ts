import type { Component } from "ripple"
import type {
  StickToBottomController,
  StickToBottomOptions,
  StickToBottomStateSnapshot,
} from "./controller"

export type StickToBottomProps = StickToBottomOptions & {
  bottomInset?: number | string
  children?: unknown
  class?: string
  className?: string
  contentClass?: string
  contentClassName?: string
  contentRef?: (element: HTMLElement | null) => void
  contextRef?: (controller: StickToBottomController | null) => void
  onStateChange?: (snapshot: StickToBottomStateSnapshot) => void
  scrollClass?: string
  scrollClassName?: string
  scrollRef?: (element: HTMLElement | null) => void
  style?: string | Record<string, string | number | undefined>
}

export declare function createStickToBottom(
  options?: StickToBottomOptions,
): StickToBottomController

export declare const StickToBottom: Component<StickToBottomProps>

export type {
  StickToBottomAnimation,
  StickToBottomController,
  StickToBottomOptions,
  StickToBottomStateSnapshot,
  StickToBottomTargetScrollTop,
} from "./controller"
