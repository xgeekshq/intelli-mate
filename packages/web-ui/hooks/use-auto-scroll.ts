import { RefObject, useEffect } from 'react';

export function useAutoScroll(
  elementRef: RefObject<HTMLDivElement>,
  setShowScrollToBottomButton: (toBottom: boolean) => void
) {
  const elementRefCopy = elementRef.current;

  useEffect(() => {
    function watchScroll() {
      elementRef.current?.addEventListener('scroll', () =>
        setShowScrollToBottomButton(
          elementRef.current?.scrollTop! + elementRef.current?.clientHeight! <
            elementRef.current?.scrollHeight!
        )
      );
    }

    watchScroll();
    return () => {
      elementRefCopy?.removeEventListener('scroll', () =>
        setShowScrollToBottomButton(
          elementRefCopy?.scrollTop! + elementRefCopy?.clientHeight! <
            elementRefCopy?.scrollHeight!
        )
      );
    };
  });
}
