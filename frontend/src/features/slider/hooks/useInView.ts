import { useCallback, useEffect, useRef, useState } from "react";

type UseInViewProps = {
  root?: Element | null,
  rootMargin?: string,
  threshold: number | number[]
}

const useInView = (
  options: UseInViewProps = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  }
) => {
  const [inView, setInView] = useState(false);
  const targetRef = useRef<Element | null>(null);

  const inViewRef = useCallback((node: Element | null) => {
    if (node) {
      targetRef.current = node;
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      });
    }, options);
    if (targetRef.current) {
      observer.observe(targetRef.current);
    }
  }, [options]);

  return { ref: targetRef, inView, inViewRef};
};

export default useInView;