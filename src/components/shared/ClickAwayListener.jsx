"use client";
import React, { useEffect, useRef } from "react";

const ClickAwayListener = ({
  onClickAway,
  children,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      const container = containerRef.current;

      if (!container) return;

      // Check if the click was inside the container or its children
      if (event.target instanceof Node && container.contains(event.target)) {
        return; // Click is inside, do nothing
      }

      // Click was outside, invoke callback
      onClickAway(event);
    }

    document.addEventListener("mousedown", handleClickOutside, true); // useCapture = true

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [onClickAway]);

  return <div ref={containerRef}>{children}</div>;
};

export default ClickAwayListener;
