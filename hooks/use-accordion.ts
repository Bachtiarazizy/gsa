import { useState } from "react";

const useAccordion = (init = 0) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(init);

  const handleAccordion = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return [activeIndex, handleAccordion];
};

export default useAccordion;
