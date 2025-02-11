import React, { useEffect, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, Vector3, Spherical, Color } from 'three';

function SphereViewer({ texture, brightness = 1 }) {
  const meshRef = useRef();
  const map = useLoader(TextureLoader, `/textures/${texture}`);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const { camera } = useThree();
  const spherical = useRef(new Spherical(3, Math.PI / 2, 0));

  useEffect(() => {
    const isOverUI = (event) => {
      const element = event.target;
      return element.closest('.MuiPaper-root') !== null || 
             element.closest('.control-buttons') !== null;
    };

    const handleMouseDown = (event) => {
      if (event.button === 0 && !isOverUI(event)) {
        isDragging.current = true;
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (event) => {
      if (isDragging.current && !isOverUI(event)) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.current.x,
          y: event.clientY - previousMousePosition.current.y
        };

        spherical.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, 
          spherical.current.phi + deltaMove.y * 0.005));
        spherical.current.theta += deltaMove.x * 0.005;

        const position = new Vector3().setFromSpherical(spherical.current);
        camera.position.copy(position);
        camera.lookAt(0, 0, 0);
      }

      previousMousePosition.current = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const handleWheel = (event) => {
      if (isOverUI(event)) {
        return;
      }

      event.preventDefault();
      const zoomSpeed = 0.001;
      const minDistance = 2;
      const maxDistance = 200;
      
      const newRadius = spherical.current.radius + event.deltaY * zoomSpeed * spherical.current.radius;
      if (newRadius >= minDistance && newRadius <= maxDistance) {
        spherical.current.radius = newRadius;
        const position = new Vector3().setFromSpherical(spherical.current);
        camera.position.copy(position);

        camera.far = Math.max(1000, newRadius * 5);
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel, { passive: false });

    camera.position.set(3, 0, 0);
    camera.lookAt(0, 0, 0);
    camera.far = 1000;
    camera.updateProjectionMatrix();

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [camera]);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial 
        map={map}
        color={new Color(brightness, brightness, brightness)}
      />
    </mesh>
  );
}

export default SphereViewer;
