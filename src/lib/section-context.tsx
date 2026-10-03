import { createContext, useContext, useState, type ReactNode } from 'react';

type SectionContextType = {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

const SectionContext = createContext<SectionContextType>({
  activeIndex: 0,
  setActiveIndex: () => {},
});

export function SectionProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SectionContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSection() {
  return useContext(SectionContext);
}
