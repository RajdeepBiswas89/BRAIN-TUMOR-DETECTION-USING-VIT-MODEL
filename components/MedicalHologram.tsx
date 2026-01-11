import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MedicalHologram: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 300;
    const height = containerRef.current.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });

    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create DNA helix structure
    const helixGroup = new THREE.Group();
    const radius = 1;
    const height_helix = 4;
    const turns = 3;
    const segments = 100;

    const strand1Material = new THREE.MeshPhongMaterial({
      color: 0x4CC9F0,
      transparent: true,
      opacity: 0.8,
      emissive: 0x4CC9F0,
      emissiveIntensity: 0.5
    });

    const strand2Material = new THREE.MeshPhongMaterial({
      color: 0x2A9D8F,
      transparent: true,
      opacity: 0.8,
      emissive: 0x2A9D8F,
      emissiveIntensity: 0.5
    });

    // Create two strands
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * turns;
      const y = t * height_helix - height_helix / 2;

      // Strand 1
      const sphere1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        strand1Material
      );
      sphere1.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      );
      helixGroup.add(sphere1);

      // Strand 2 (opposite side)
      const sphere2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        strand2Material
      );
      sphere2.position.set(
        Math.cos(angle + Math.PI) * radius,
        y,
        Math.sin(angle + Math.PI) * radius
      );
      helixGroup.add(sphere2);

      // Connecting bars every few segments
      if (i % 5 === 0) {
        const barGeometry = new THREE.CylinderGeometry(0.02, 0.02, radius * 2, 8);
        const barMaterial = new THREE.MeshPhongMaterial({
          color: 0x4361EE,
          transparent: true,
          opacity: 0.3
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.position.set(0, y, 0);
        bar.rotation.z = Math.PI / 2;
        bar.rotation.y = angle;
        helixGroup.add(bar);
      }
    }

    scene.add(helixGroup);

    // Floating particles around the helix
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ 
      color: 0x4CC9F0, 
      size: 0.03, 
      transparent: true, 
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Glowing ring
    const ringGeometry = new THREE.TorusGeometry(2.5, 0.03, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: 0x2A9D8F,
      transparent: true,
      opacity: 0.4,
      emissive: 0x2A9D8F,
      emissiveIntensity: 0.8
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x4CC9F0, 1.5, 50);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x2A9D8F, 1.5, 50);
    pointLight2.position.set(-3, -3, 3);
    scene.add(pointLight2);

    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    let time = 0;
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Rotate helix
      helixGroup.rotation.y += 0.01;
      
      // Float helix up and down
      helixGroup.position.y = Math.sin(time) * 0.2;
      
      // Rotate particles
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.001;
      
      // Pulse ring
      const scale = 1 + Math.sin(time * 2) * 0.05;
      ring.scale.set(scale, scale, scale);
      ring.rotation.z += 0.005;

      // Move lights
      pointLight1.position.x = Math.sin(time * 0.7) * 3;
      pointLight1.position.z = Math.cos(time * 0.7) * 3;
      
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
      }
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default MedicalHologram;
