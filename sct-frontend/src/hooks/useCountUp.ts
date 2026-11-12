import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

export function useCountUp(target: number, duration = 0.75): number{
const reduce = useReducedMotion();
const [value, setValue] = useState(0);

useEffect(() => {
    if (reduce) return;
    const controls = animate(0, target, {
        duration,
        ease: [0.2, 0.8, 0.2, 1],
        onUpdate: (latest) => setValue(Math.round(latest)),
    })
    return () => controls.stop();
}, [target, duration, reduce])

return reduce ? target : value;
}