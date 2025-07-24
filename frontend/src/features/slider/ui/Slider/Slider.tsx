import { Children, useEffect, useRef, useState } from "react";
import styles from "./Slider.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import useInView from "../../hooks/useInView";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { SliderProps } from "../../types/SliderType";

const Slider = ({
  slidesPerView: initialSliderPerView,
  spaceBetween: initialSpaceBetween,
  slidesPerGroup: initialSliderPerGroup,
  loop,
  breakpoints,
  items,
  children,
  autoPlay = false,
  autoPlayInterval = 2000,
}: SliderProps) => {
  const [slidesPerView, setSlidesPerView] = useState(initialSliderPerView);
  const [slidesPerGroup, setSlidesPerGroup] = useState(initialSliderPerGroup);
  const [spaceBetween, setSpaceBetween] = useState(initialSpaceBetween);
  const [activeSlideIndex, setActiveSlideIndex] = useState(
    loop ? slidesPerView : 0
  );
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const [sliderItemWidth, setSliderItemWidth] = useState(0);
  const sliderContainerRef = useRef(null);

  const { width: deviceWidth } = useWindowDimensions();

  const { inView: lastSliderItemInView, ref: lastSliderItemRef } = useInView({
    root: sliderContainerRef.current,
    threshold: 0.95,
  });

  const { inView: firstSliderItemInView, ref: firstSliderItemRef } = useInView({
    root: sliderContainerRef.current,
    threshold: 1.0,
  });

  items = items || Children.toArray(children);

  useEffect(() => {
    if (sliderContainerRef.current) {
      const sliderContainerWidth = sliderContainerRef.current.offsetWidth;

      const elements = sliderContainerRef.current.querySelectorAll('.slider-item');

      elements.forEach(el => {
        const sliderItemWidth = Math.ceil((sliderContainerWidth / slidesPerView) - spaceBetween);

        el.style.width = sliderItemWidth + 'px';

        Array.from(el.children).forEach(div => {
          div.style.width = sliderItemWidth + 'px';
        });

        setSliderItemWidth(sliderItemWidth);
      });
    }

  }, [slidesPerView, spaceBetween]);

  useEffect(() => {
    setTimeout(() => {
      setTransitionEnabled(true);
    }, 100);
  }, [firstSliderItemRef]);

 // New Code
  useEffect(() => {
    if (breakpoints) {
      Object.keys(breakpoints).forEach((breakpoint) => {
        if (Number(breakpoint) && deviceWidth >= Number(breakpoint)) {
          setSlidesPerView(
            (prev) => breakpoints[breakpoint].slidesPerView || prev
          );
          setSlidesPerGroup(
            (prev) => breakpoints[breakpoint].slidesPerGroup || prev
          );
          setSpaceBetween(
            (prev) => breakpoints[breakpoint].spaceBetween || prev
          );
          if(loop) {
            setActiveSlideIndex((prev) => breakpoints[breakpoint].slidesPerView || prev);
          }
        }
      });
    }
  }, [deviceWidth, breakpoints, loop]);
  // New Code

  useEffect(() => {
    let intervalID;
    if (loop && autoPlay) {
      intervalID = setInterval(() => {
        if (
          activeSlideIndex === slidesPerGroup ||
          activeSlideIndex === items.length
        ) {
          setTransitionEnabled(true);
        }
        setActiveSlideIndex((prevIndex) => prevIndex + slidesPerGroup);
      }, autoPlayInterval);
    }
    return () => {
      if (intervalID) {
        clearInterval(intervalID);
      }
    };
  }, [
    loop,
    slidesPerGroup,
    activeSlideIndex,
    items.length,
    autoPlay,
    autoPlayInterval,
  ]);

  const sliderButtonHandler = (direction) => {
    if (
      activeSlideIndex === slidesPerGroup ||
      activeSlideIndex === items.length
    ) {
      setTransitionEnabled(true);
    }
    if (direction === "forward") {
      if (loop || (!loop && !lastSliderItemInView && activeSlideIndex < (items.length - slidesPerGroup))) {
        setActiveSlideIndex((prevIndex) => {
          if((items.length - prevIndex) < slidesPerGroup && items.length - prevIndex != 0) {
            return items.length;
          }
          return prevIndex + slidesPerGroup;
        });
      }
    } else if (direction === "backward") {
      if (loop || (!loop && !firstSliderItemInView && activeSlideIndex > 0)) {
        setActiveSlideIndex((prevIndex) => {
          if(prevIndex < slidesPerGroup) {
            return 0;
          }
          return prevIndex - slidesPerGroup;
        });
      }
    }
  };

  const handleTransitionEnd = () => {
    if (loop) {
      if (activeSlideIndex > items.length) {
        setTransitionEnabled(false);
        setActiveSlideIndex(slidesPerGroup);
      } else if (activeSlideIndex === 0) {
        setTransitionEnabled(false);
        setActiveSlideIndex(items.length);
      }
    }
  };

  const sliderItems = loop
    ? [
        ...items.slice(-slidesPerView),
        ...items,
        ...items.slice(0, slidesPerView),
      ]
    : items;

  const setSliderItemRef = (index, sliderItemsArray) => {
    if (loop && index === 0) {
      return firstSliderItemRef;
    }
    if (!loop) {
      if (index === 0) {
        return firstSliderItemRef;
      }
      if (index === sliderItemsArray.length - 1) {
        return lastSliderItemRef;
      }
    }
    return null;
  };

  return (
    <div className={styles.slider}>
      <div className={styles.slidesContainer} ref={sliderContainerRef}>
        <div
          onTransitionEnd={handleTransitionEnd}
          style={{
            display: "flex",
            transition: !transitionEnabled ? "none" : "all 0.5s ease-in-out",
            transform: `translateX(${
              (sliderItemWidth + spaceBetween) * activeSlideIndex * -1
            }px)`,
            marginBottom: "3px",
          }}
        >
          {sliderItems.map((item, index, array) => {
            return (
              <div
                className="slider-item" 
                key={index}
                ref={setSliderItemRef(index, array)}
                style={{
                  marginRight: Number(spaceBetween)
                    ? `${spaceBetween}px`
                    : "0px",
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
      <button
        className={`${styles.slideButton} ${styles.slideButtonPrev}`}
        onClick={() => sliderButtonHandler("backward")}
      >
        <FontAwesomeIcon icon={faCaretLeft}/>
      </button>
      <button
      className={`${styles.slideButton} ${styles.slideButtonNext}`}
      onClick={() => sliderButtonHandler("forward")}
      >
        <FontAwesomeIcon icon={faCaretRight}/>
      </button>
    </div>
  );
};

export default Slider;