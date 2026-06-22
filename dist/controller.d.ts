/*!---------------------------------------------------------------------------------------------
 *  Adapted from StackBlitz's use-stick-to-bottom spring scroll algorithm.
 *  Licensed under MIT: https://github.com/stackblitz-labs/use-stick-to-bottom
 *--------------------------------------------------------------------------------------------*/
export type StickToBottomSpringAnimation = {
    damping?: number;
    mass?: number;
    stiffness?: number;
};
export type StickToBottomAnimation = ScrollBehavior | StickToBottomSpringAnimation;
export type StickToBottomElements = {
    contentElement: HTMLElement;
    scrollElement: HTMLElement;
};
export type StickToBottomTargetScrollTop = (targetScrollTop: number, elements: StickToBottomElements) => number;
export type StickToBottomOptions = StickToBottomSpringAnimation & {
    bottomThreshold?: number;
    initial?: StickToBottomAnimation | boolean;
    resize?: StickToBottomAnimation;
    targetScrollTop?: StickToBottomTargetScrollTop;
};
export type StickToBottomScrollOptions = ScrollBehavior | {
    animation?: StickToBottomAnimation;
    duration?: number | Promise<void>;
    ignoreEscapes?: boolean;
    preserveScrollPosition?: boolean;
    wait?: boolean | number;
};
export type StickToBottomStateSnapshot = {
    escapedFromLock: boolean;
    isAtBottom: boolean;
    isNearBottom: boolean;
    scrollDifference: number;
    scrollTop: number;
    targetScrollTop: number;
};
export type StickToBottomController = {
    dispose: () => void;
    getSnapshot: () => StickToBottomStateSnapshot;
    scrollToBottom: (options?: StickToBottomScrollOptions) => Promise<boolean> | boolean;
    setContentElement: (element: HTMLElement | null) => void;
    setOptions: (options: StickToBottomOptions) => void;
    setScrollElement: (element: HTMLElement | null) => void;
    stopScroll: () => void;
    onStateChange: (listener: (snapshot: StickToBottomStateSnapshot) => void) => () => void;
};
export declare function createStickToBottomController(options?: StickToBottomOptions): StickToBottomController;
