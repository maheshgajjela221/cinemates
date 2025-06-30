import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  
  // Check if device has a mouse or is likely a touch device
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const mediaQuery = window.matchMedia('(hover: hover)');
    setHasMouse(mediaQuery.matches);
    
    if (!mediaQuery.matches) return;
    
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };
    
    const handleMouseEnter = () => setHidden(false);
    const handleMouseLeave = () => setHidden(true);
    
    const handleLinkHoverStart = () => setLinkHovered(true);
    const handleLinkHoverEnd = () => setLinkHovered(false);
    
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Add event listeners to all buttons and links
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHoverStart);
      link.addEventListener('mouseleave', handleLinkHoverEnd);
    });
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkHoverStart);
        link.removeEventListener('mouseleave', handleLinkHoverEnd);
      });
    };
  }, []);
  
  if (!hasMouse) return null;
  
  return (
    <motion.div
      className={`custom-cursor ${linkHovered ? 'cursor-hover' : ''} ${clicked ? 'scale-75' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        opacity: hidden ? 0 : 1,
      }}
      animate={{
        x: position.x,
        y: position.y,
        scale: clicked ? 0.8 : linkHovered ? 1.5 : 1,
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
        restDelta: 0.001,
      }}
    />
  );
};

export default Cursor;