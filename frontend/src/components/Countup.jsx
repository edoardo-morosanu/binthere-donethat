import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useTransform, animate } from "framer-motion";

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}) {
  const ref = useRef(null);
  const progress = useMotionValue(0);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  // Transform progress (0 to 1) to the actual number range
  const value = useTransform(progress, [0, 1], [from, to]);

  // Set initial text content
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(direction === "down" ? to : from);
    }
  }, [from, to, direction]);

  // Start the animation when in view
  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        progress.set(0);
        const animation = animate(progress, 1, {
          duration: duration,
          ease: "linear",
          onComplete: () => {
            if (typeof onEnd === "function") {
              onEnd();
            }
          },
        });

        return () => animation.stop();
      }, delay * 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isInView, startWhen, progress, delay, duration, onStart, onEnd]);

  // Update text content with formatted number
  useEffect(() => {
    const unsubscribe = value.on("change", (latest) => {
      if (ref.current) {
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };

        const formattedNumber = Intl.NumberFormat("en-US", options).format(
          Math.round(latest)
        );

        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }
    });

    return () => unsubscribe();
  }, [value, separator]);

  return <span className={`${className}`} ref={ref} />;
}