import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FloatingBrain3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const initTimer = setTimeout(() => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth || 400;
      const height = containerRef.current.clientHeight || 400;

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

      // Create main brain mesh with more detail
      const brainGeometry = new THREE.IcosahedronGeometry(2, 4);
      const brainMaterial = new THREE.MeshPhongMaterial({
        color: 0x4361EE,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
        emissive: 0x2A9D8F,
        emissiveIntensity: 0.6
      });
      
      const brain = new THREE.Mesh(brainGeometry, brainMaterial);
      scene.add(brain);

      // Inner glowing core
      const coreGeometry = new THREE.SphereGeometry(1.5, 32, 32);
      const coreMaterial = new THREE.MeshPhongMaterial({
        color: 0x4CC9F0,
        transparent: true,
        opacity: 0.2,
        emissive: 0x4CC9F0,
        emissiveIntensity: 1
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      scene.add(core);

      // Neural network particles
      const particlesCount = 500;
      const positions = new Float32Array(particlesCount * 3);
      const colors = new Float32Array(particlesCount * 3);
      
      for (let i = 0; i < particlesCount; i++) {
        // Distribute particles in a sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 2 + Math.random() * 1.5;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Color gradient from teal to blue
        const t = Math.random();
        colors[i * 3] = 0.16 + t * 0.1; // R
        colors[i * 3 + 1] = 0.61 + t * 0.1; // G
        colors[i * 3 + 2] = 0.56 + t * 0.38; // B
      }
      
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const particleMat = new THREE.PointsMaterial({ 
        size: 0.05, 
        transparent: true, 
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });
      const points = new THREE.Points(particleGeo, particleMat);
      scene.add(points);

      // Orbital rings
      const ringGeometry = new THREE.TorusGeometry(3, 0.02, 16, 100);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0x2A9D8F,
        transparent: true,
        opacity: 0.3,
        emissive: 0x2A9D8F,
        emissiveIntensity: 0.5
      });
      
      const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
      ring1.rotation.x = Math.PI / 3;
      scene.add(ring1);
      
      const ring2 = new THREE.Mesh(ringGeometry, ringMaterial.clone());
      ring2.rotation.y = Math.PI / 3;
      scene.add(ring2);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x4CC9F0, 2, 100);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0x4361EE, 2, 100);
      pointLight2.position.set(-5, -5, 5);
      scene.add(pointLight2);

      camera.position.z = 7;

      // Animation
      let time = 0;
      const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);
        time += 0.01;
        
        // Rotate brain
        brain.rotation.y += 0.002;
        brain.rotation.x += 0.001;
        
        // Pulse core
        const scale = 1 + Math.sin(time * 2) * 0.05;
        core.scale.set(scale, scale, scale);
        
        // Rotate particles
        points.rotation.y += 0.001;
        points.rotation.x -= 0.0005;
        
        // Rotate rings in opposite directions
        ring1.rotation.z += 0.003;
        ring2.rotation.z -= 0.002;
        
        // Move lights
        pointLight1.position.x = Math.sin(time) * 5;
        pointLight1.position.y = Math.cos(time) * 5;
        pointLight2.position.x = Math.cos(time * 0.7) * 5;
        pointLight2.position.y = Math.sin(time * 0.7) * 5;
        
        // Float up and down
        brain.position.y = Math.sin(time * 0.5) * 0.3;
        core.position.y = Math.sin(time * 0.5) * 0.3;
        
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
        brainGeometry.dispose();
        brainMaterial.dispose();
        coreGeometry.dispose();
        coreMaterial.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        ringGeometry.dispose();
        ringMaterial.dispose();
      };
    }, 100);

    return () => clearTimeout(initTimer);
  }, []);

  return <div ref={containerRef} className="w-full h-full" style={{ minHeight: '300px' }} />;
};

export default FloatingBrain3D;
