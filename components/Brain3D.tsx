
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Brain3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Use a small delay to allow the rest of the UI to render first
    const initTimer = setTimeout(() => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth || 300;
      const height = containerRef.current.clientHeight || 300;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true, 
        powerPreference: "high-performance" 
      });

      rendererRef.current = renderer;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.IcosahedronGeometry(1.5, 8); // Reduced detail for speed
      const material = new THREE.MeshPhongMaterial({
        color: 0x4361EE,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        emissive: 0x4361EE,
        emissiveIntensity: 0.5
      });
      
      const brain = new THREE.Mesh(geometry, material);
      scene.add(brain);

      const particlesCount = 300; // Further reduced for performance
      const positions = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 4;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({ 
        color: 0x4CC9F0, 
        size: 0.02, 
        transparent: true, 
        opacity: 0.6 
      });
      const points = new THREE.Points(particleGeo, particleMat);
      scene.add(points);

      const light = new THREE.DirectionalLight(0xffffff, 1.5);
      light.position.set(5, 5, 5);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0x404040, 1.2));

      camera.position.z = 4;

      const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);
        brain.rotation.y += 0.003;
        brain.rotation.z += 0.001;
        points.rotation.y += 0.0005;
        
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.03;
        brain.scale.set(scale, scale, scale);
        
        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!containerRef.current || !rendererRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameIdRef.current);
        if (rendererRef.current) {
          rendererRef.current.dispose();
          if (containerRef.current?.contains(rendererRef.current.domElement)) {
            containerRef.current.removeChild(rendererRef.current.domElement);
          }
        }
        geometry.dispose();
        material.dispose();
        particleGeo.dispose();
        particleMat.dispose();
      };
    }, 100);

    return () => clearTimeout(initTimer);
  }, []);

  return <div ref={containerRef} className="w-full h-full" style={{ minHeight: '200px' }} />;
};

export default Brain3D;
