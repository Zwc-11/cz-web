import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Wraps scene content and gives it a smooth, springy parallax tied to the
 * pointer, plus a gentle idle drift so the scene is never fully static.
 * Frame-rate independent damping keeps it smooth on every device.
 */
export default function MouseRig({ strength = 0.32, children }) {
  const group = useRef();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { pointer, clock } = state;
    const t = clock.elapsedTime;

    // pointer target + slow idle breathing
    target.current.x = pointer.x * strength + Math.sin(t * 0.12) * 0.05;
    target.current.y = pointer.y * strength * 0.55 + Math.cos(t * 0.09) * 0.035;

    // exponential smoothing (frame-rate independent)
    const k = 1 - Math.pow(0.0015, delta);
    g.rotation.y += (target.current.x - g.rotation.y) * k;
    g.rotation.x += (target.current.y - g.rotation.x) * k;
    g.position.x += (pointer.x * 0.35 - g.position.x) * k;
    g.position.y += (pointer.y * 0.2 - g.position.y) * k;
  });

  return <group ref={group}>{children}</group>;
}
