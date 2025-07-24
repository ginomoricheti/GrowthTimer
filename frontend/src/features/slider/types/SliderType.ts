type BreakpointSettings = {
  slidesPerView?: number;
  slidesPerGroup?: number;
  spaceBetween?: number;
};

type Breakpoints = Record<number, BreakpointSettings>;

export type SliderProps = {
  slidesPerView?: number;
  slidesPerGroup?: number;
  spaceBetween?: number;
  loop: boolean;
  breakpoints?: Breakpoints;
  items?: unknown;
  children: React.ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
};

