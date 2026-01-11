
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Assistant3DProps {
  isThinking?: boolean;
  isSpeaking?: boolean;
}

const Assistant3D: React.FC<Assistant3DProps> = ({ isThinking, isSpeaking }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);
  const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Core Geometry - The "Neural Core"
    const geometry = new THREE.IcosahedronGeometry(1, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0x4CC9F0,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      emissive: 0x4CC9F0,
      emissiveIntensity: 0.5,
    });
    materialRef.current = material;
    
    const core = new THREE.Mesh(geometry, material);
    scene.add(core);

    // Inner glow
    const innerGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x2A9D8F,
      transparent: true,
      opacity: 0.3,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerCore);

    // Orbital Ring - For "Gesturing"
    const ringGeo = new THREE.TorusGeometry(1.4, 0.02, 16, 100);
    const ringMat = new THREE.MeshPhongMaterial({
      color: 0x7209B7,
      transparent: true,
      opacity: 0.4,
      emissive: 0x7209B7,
      emissiveIntensity: 1,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ringRef.current = ring;
    scene.add(ring);

    // Particles
    const particlesCount = 150;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const radius = 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4CC9F0,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(particleGeo, particleMat);
    scene.add(points);

    const light = new THREE.PointLight(0xffffff, 1.5, 100);
    light.position.set(2, 2, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    camera.position.z = 3.5;

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      
      // Base rotation
      core.rotation.y += isThinking ? 0.08 : 0.01;
      core.rotation.z += 0.005;
      
      // 1. Nodding Animation (Subtle X-axis tilt & Y-axis oscillation)
      // When speaking, the "nod" is more pronounced to simulate communication.
      const nodFrequency = isSpeaking ? 6 : 2;
      const nodIntensity = isSpeaking ? 0.2 : 0.05;
      core.position.y = Math.sin(time * nodFrequency) * nodIntensity;
      core.rotation.x = Math.sin(time * nodFrequency * 0.5) * (nodIntensity * 0.5);

      // 2. Gesturing Animation (Ring scale and rotation)
      if (ringRef.current) {
        ringRef.current.rotation.y += isSpeaking ? 0.06 : 0.02;
        ringRef.current.rotation.x += isSpeaking ? 0.03 : 0.01;
        
        // Expand and contract the ring dynamically when speaking to simulate gesturing
        const gesturePulse = isSpeaking ? Math.sin(time * 8) * 0.15 : 0;
        const targetScale = isSpeaking ? 1.3 : (isThinking ? 1.15 : 1.0);
        const currentScale = ringRef.current.scale.x;
        const lerpFactor = 0.1;
        const newScale = currentScale + ((targetScale + gesturePulse) - currentScale) * lerpFactor;
        ringRef.current.scale.set(newScale, newScale, newScale);
        
        // Dynamic Emissive lerping for state colors
        const rMat = ringRef.current.material as THREE.MeshPhongMaterial;
        const targetEmissive = isThinking 
          ? new THREE.Color(0xF4A261) // Amber for thinking
          : (isSpeaking ? new THREE.Color(0x2A9D8F) : new THREE.Color(0x7209B7)); // Teal for speaking, Purple for idle
        
        rMat.emissive.lerp(targetEmissive, 0.1);
      }

      // 3. Thinking Animation (Vibrating Jitter & Scale pulses)
      const pulseSpeed = isThinking ? 15 : (isSpeaking ? 7 : 3);
      const pulseScale = 1 + Math.sin(time * pulseSpeed) * (isThinking ? 0.12 : 0.04);
      core.scale.set(pulseScale, pulseScale, pulseScale);
      
      if (isThinking) {
        // High-frequency jitter effect for "computation"
        core.position.x = (Math.random() - 0.5) * 0.04;
        core.position.z = (Math.random() - 0.5) * 0.04;
      } else {
        core.position.x = 0;
        core.position.z = 0;
      }

      // 4. Particle Field Dynamics
      points.rotation.y += 0.002;
      const particleScaleTarget = isSpeaking ? 1.8 : 1.0;
      const pScale = points.scale.x + (particleScaleTarget - points.scale.x) * 0.05;
      points.scale.set(pScale, pScale, pScale);

      // 5. Neural Core Material Reactivity
      if (materialRef.current) {
        // Intense emission pulses when thinking or speaking
        materialRef.current.emissiveIntensity = isThinking 
          ? 1.5 + Math.sin(time * 25) * 0.8 
          : (isSpeaking ? 1.2 : 0.5);
        
        const coreTargetColor = isThinking 
          ? new THREE.Color(0xF4A261) 
          : (isSpeaking ? new THREE.Color(0x2A9D8F) : new THREE.Color(0x4CC9F0));
        
        materialRef.current.color.lerp(coreTargetColor, 0.1);
      }

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
      geometry.dispose();
      material.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [isThinking, isSpeaking]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default Assistant3D;
