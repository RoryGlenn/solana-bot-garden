
import { useState, useEffect } from 'react';

export const usePageTransition = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Start with elements hidden
    setIsVisible(false);
    
    // Trigger animation after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  return {
    isVisible,
    animationProps: {
      className: isVisible 
        ? "opacity-100 translate-y-0 transition-all duration-500" 
        : "opacity-0 translate-y-8 transition-all duration-500"
    },
    staggeredAnimationProps: (index: number) => ({
      className: isVisible 
        ? `opacity-100 translate-y-0 transition-all duration-500 delay-[${index * 100}ms]` 
        : "opacity-0 translate-y-8 transition-all duration-500"
    })
  };
};

export const fadeIn = (delay: number = 0) => ({
  className: `animate-fade-in ${delay ? `animation-delay-${delay}` : ''}`
});

export const slideIn = (delay: number = 0, direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
  const directionMap = {
    up: 'animate-slide-in-up',
    down: 'animate-slide-in-down',
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right'
  };
  
  return {
    className: `${directionMap[direction]} ${delay ? `animation-delay-${delay}` : ''}`
  };
};
