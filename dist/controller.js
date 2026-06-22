/*!---------------------------------------------------------------------------------------------
 *  Adapted from StackBlitz's use-stick-to-bottom spring scroll algorithm.
 *  Licensed under MIT: https://github.com/stackblitz-labs/use-stick-to-bottom
 *--------------------------------------------------------------------------------------------*/
import { on } from "ripple";
const defaultSpringAnimation = {
  damping: 0.7,
  mass: 1.25,
  stiffness: 0.05
};
const defaultBottomThreshold = 70;
const sixtyFpsIntervalMs = 1000 / 60;
const retainAnimationDurationMs = 350;
const animationCache = new Map;
let mouseDown = false;
if (globalThis.document) {
  on(globalThis.document, "mousedown", () => {
    mouseDown = true;
  });
  on(globalThis.document, "mouseup", () => {
    mouseDown = false;
  });
  on(globalThis.document, "click", () => {
    mouseDown = false;
  });
}
function mergeAnimations(animations) {
  const result = { ...defaultSpringAnimation };
  let instant = false;
  for (const animation of animations) {
    if (animation === "instant") {
      instant = true;
      continue;
    }
    if (typeof animation !== "object") {
      continue;
    }
    instant = false;
    result.damping = animation.damping ?? result.damping;
    result.mass = animation.mass ?? result.mass;
    result.stiffness = animation.stiffness ?? result.stiffness;
  }
  const key = JSON.stringify(result);
  if (!animationCache.has(key)) {
    animationCache.set(key, Object.freeze(result));
  }
  return instant ? "instant" : animationCache.get(key);
}
function getScrollableElement(target) {
  let element = target instanceof HTMLElement ? target : null;
  while (element) {
    const overflow = getComputedStyle(element).overflow;
    if (overflow === "auto" || overflow === "scroll") {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}
export function createStickToBottomController(options = {}) {
  let currentOptions = options;
  let lastCalculation;
  const listeners = new Set;
  const state = {
    accumulated: 0,
    contentElement: null,
    escapedFromLock: false,
    isAtBottom: options.initial !== false,
    resizeDifference: 0,
    scrollElement: null,
    velocity: 0
  };
  let removeScrollListener;
  let removeWheelListener;
  const getTargetScrollTop = () => {
    if (!state.scrollElement || !state.contentElement) {
      return 0;
    }
    return Math.max(0, state.scrollElement.scrollHeight - 1 - state.scrollElement.clientHeight);
  };
  const getCalculatedTargetScrollTop = () => {
    if (!state.scrollElement || !state.contentElement) {
      return 0;
    }
    const targetScrollTop = getTargetScrollTop();
    if (!currentOptions.targetScrollTop) {
      return targetScrollTop;
    }
    if (lastCalculation?.targetScrollTop === targetScrollTop) {
      return lastCalculation.calculatedScrollTop;
    }
    const calculatedScrollTop = Math.max(Math.min(currentOptions.targetScrollTop(targetScrollTop, {
      contentElement: state.contentElement,
      scrollElement: state.scrollElement
    }), targetScrollTop), 0);
    lastCalculation = { calculatedScrollTop, targetScrollTop };
    requestAnimationFrame(() => {
      lastCalculation = undefined;
    });
    return calculatedScrollTop;
  };
  const getScrollTop = () => state.scrollElement?.scrollTop ?? 0;
  const getScrollDifference = () => getCalculatedTargetScrollTop() - getScrollTop();
  const getIsNearBottom = () => getScrollDifference() <= (currentOptions.bottomThreshold ?? defaultBottomThreshold);
  const getSnapshot = () => {
    const isNearBottom = getIsNearBottom();
    return {
      escapedFromLock: state.escapedFromLock,
      isAtBottom: state.isAtBottom || isNearBottom,
      isNearBottom,
      scrollDifference: getScrollDifference(),
      scrollTop: getScrollTop(),
      targetScrollTop: getCalculatedTargetScrollTop()
    };
  };
  const notify = () => {
    const snapshot = getSnapshot();
    for (const listener of listeners) {
      listener(snapshot);
    }
  };
  const setScrollTop = (scrollTop) => {
    if (!state.scrollElement) {
      return;
    }
    const scrollBehavior = getComputedStyle(state.scrollElement).scrollBehavior;
    if (scrollBehavior !== "auto") {
      state.scrollElement.style.scrollBehavior = "auto";
    }
    state.scrollElement.scrollTop = scrollTop;
    state.ignoreScrollToTop = state.scrollElement.scrollTop;
    notify();
    if (scrollBehavior !== "auto") {
      state.scrollElement.style.scrollBehavior = scrollBehavior;
    }
  };
  const setIsAtBottom = (isAtBottom) => {
    state.isAtBottom = isAtBottom;
    notify();
  };
  const setEscapedFromLock = (escapedFromLock) => {
    state.escapedFromLock = escapedFromLock;
    notify();
  };
  const isSelecting = () => {
    if (!mouseDown || !state.scrollElement) {
      return false;
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return false;
    }
    const range = selection.getRangeAt(0);
    return range.commonAncestorContainer.contains(state.scrollElement) || state.scrollElement.contains(range.commonAncestorContainer);
  };
  const scrollToBottom = (scrollOptions = {}) => {
    const normalizedOptions = typeof scrollOptions === "string" ? { animation: scrollOptions } : scrollOptions;
    if (!normalizedOptions.preserveScrollPosition) {
      setIsAtBottom(true);
    }
    const waitElapsed = Date.now() + (Number(normalizedOptions.wait) || 0);
    const behavior = mergeAnimations([currentOptions, normalizedOptions.animation]);
    const ignoreEscapes = normalizedOptions.ignoreEscapes ?? false;
    let durationElapsed;
    let startTarget = getCalculatedTargetScrollTop();
    if (normalizedOptions.duration instanceof Promise) {
      durationElapsed = Number.POSITIVE_INFINITY;
      normalizedOptions.duration.finally(() => {
        durationElapsed = Date.now();
      });
    } else {
      durationElapsed = waitElapsed + (normalizedOptions.duration ?? 0);
    }
    const next = () => {
      const promise = new Promise((resolve) => {
        requestAnimationFrame(resolve);
      }).then((tick) => {
        if (!state.isAtBottom) {
          state.animation = undefined;
          return false;
        }
        const scrollTop = getScrollTop();
        const tickDelta = (tick - (state.lastTick ?? tick)) / sixtyFpsIntervalMs;
        state.animation ||= { behavior, ignoreEscapes, promise };
        if (state.animation.behavior === behavior) {
          state.lastTick = tick;
        }
        if (isSelecting() || waitElapsed > Date.now()) {
          return next();
        }
        if (scrollTop < Math.min(startTarget, getCalculatedTargetScrollTop())) {
          if (state.animation?.behavior === behavior) {
            if (behavior === "instant") {
              setScrollTop(getCalculatedTargetScrollTop());
              return next();
            }
            state.velocity = (behavior.damping * state.velocity + behavior.stiffness * getScrollDifference()) / behavior.mass;
            state.accumulated += state.velocity * tickDelta;
            setScrollTop(getScrollTop() + state.accumulated);
            if (getScrollTop() !== scrollTop) {
              state.accumulated = 0;
            }
          }
          return next();
        }
        if (durationElapsed > Date.now()) {
          startTarget = getCalculatedTargetScrollTop();
          return next();
        }
        state.animation = undefined;
        if (getScrollTop() < getCalculatedTargetScrollTop()) {
          return scrollToBottom({
            animation: mergeAnimations([currentOptions, currentOptions.resize]),
            duration: Math.max(0, durationElapsed - Date.now()) || undefined,
            ignoreEscapes
          });
        }
        return state.isAtBottom;
      });
      return promise.then((isAtBottom) => {
        requestAnimationFrame(() => {
          if (!state.animation) {
            state.lastTick = undefined;
            state.velocity = 0;
          }
        });
        return isAtBottom;
      });
    };
    if (normalizedOptions.wait !== true) {
      state.animation = undefined;
    }
    if (state.animation?.behavior === behavior) {
      return state.animation.promise;
    }
    return next();
  };
  const handleScroll = (event) => {
    if (event.target !== state.scrollElement) {
      return;
    }
    const scrollTop = getScrollTop();
    const ignoreScrollToTop = state.ignoreScrollToTop;
    let lastScrollTop = state.lastScrollTop ?? scrollTop;
    state.lastScrollTop = scrollTop;
    state.ignoreScrollToTop = undefined;
    if (ignoreScrollToTop && ignoreScrollToTop > scrollTop) {
      lastScrollTop = ignoreScrollToTop;
    }
    setTimeout(() => {
      if (state.resizeDifference || scrollTop === ignoreScrollToTop) {
        return;
      }
      if (isSelecting()) {
        setEscapedFromLock(true);
        setIsAtBottom(false);
        return;
      }
      const isScrollingDown = scrollTop > lastScrollTop;
      const isScrollingUp = scrollTop < lastScrollTop;
      if (state.animation?.ignoreEscapes) {
        setScrollTop(lastScrollTop);
        return;
      }
      if (isScrollingUp) {
        setEscapedFromLock(true);
        setIsAtBottom(false);
      }
      if (isScrollingDown) {
        setEscapedFromLock(false);
      }
      if (!state.escapedFromLock && getIsNearBottom()) {
        setIsAtBottom(true);
      }
    }, 1);
  };
  const handleWheel = (event) => {
    const scrollElement = state.scrollElement;
    if (!scrollElement) {
      return;
    }
    if (getScrollableElement(event.target) === scrollElement && event.deltaY < 0 && scrollElement.scrollHeight > scrollElement.clientHeight && !state.animation?.ignoreEscapes) {
      setEscapedFromLock(true);
      setIsAtBottom(false);
    }
  };
  const setScrollElement = (element) => {
    removeScrollListener?.();
    removeWheelListener?.();
    removeScrollListener = undefined;
    removeWheelListener = undefined;
    state.scrollElement = element;
    if (state.scrollElement) {
      removeScrollListener = on(state.scrollElement, "scroll", handleScroll, { passive: true });
      removeWheelListener = on(state.scrollElement, "wheel", handleWheel, { passive: true });
    }
    notify();
  };
  const setContentElement = (element) => {
    state.resizeObserver?.disconnect();
    state.resizeObserver = undefined;
    state.contentElement = element;
    notify();
    if (!element) {
      return;
    }
    let previousHeight;
    state.resizeObserver = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height;
      const difference = height - (previousHeight ?? height);
      state.resizeDifference = difference;
      notify();
      if (getScrollTop() > getTargetScrollTop()) {
        setScrollTop(getTargetScrollTop());
      }
      if (difference >= 0) {
        const animation = mergeAnimations([
          currentOptions,
          previousHeight ? currentOptions.resize : currentOptions.initial
        ]);
        scrollToBottom({
          animation,
          duration: animation === "instant" ? undefined : retainAnimationDurationMs,
          preserveScrollPosition: true,
          wait: true
        });
      } else if (getIsNearBottom()) {
        setEscapedFromLock(false);
        setIsAtBottom(true);
      }
      previousHeight = height;
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (state.resizeDifference === difference) {
            state.resizeDifference = 0;
          }
        }, 1);
      });
    });
    state.resizeObserver.observe(element);
  };
  const dispose = () => {
    state.animation = undefined;
    state.resizeObserver?.disconnect();
    state.resizeObserver = undefined;
    removeScrollListener?.();
    removeWheelListener?.();
    removeScrollListener = undefined;
    removeWheelListener = undefined;
    state.scrollElement = null;
    state.contentElement = null;
  };
  return {
    dispose,
    getSnapshot,
    scrollToBottom,
    setContentElement,
    setOptions(nextOptions) {
      currentOptions = nextOptions;
    },
    setScrollElement,
    stopScroll() {
      setEscapedFromLock(true);
      setIsAtBottom(false);
    },
    onStateChange(listener) {
      listeners.add(listener);
      listener(getSnapshot());
      return () => {
        listeners.delete(listener);
      };
    }
  };
}
