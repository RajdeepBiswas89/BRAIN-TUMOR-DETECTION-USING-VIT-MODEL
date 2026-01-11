
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LowPolyMedicalScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 1. Create Nodes (Abstract Neurons)
    const nodeCount = 30;
    const nodes: THREE.Mesh[] = [];
    const nodeGeometry = new THREE.IcosahedronGeometry(0.12, 0); 
    const nodeMaterial = new THREE.MeshPhongMaterial({
      color: 0x4CC9F0,
      transparent: true,
      opacity: 0.15,
      flatShading: true,
    });

    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10
      );
      scene.add(node);
      nodes.push(node);
    }

    // 2. Create Brainwave Patterns (EEG Lines)
    const waveCount = 5;
    const waves: { line: THREE.Line; initialPoints: THREE.Vector3[] }[] = [];
    const waveMaterial = new THREE.LineBasicMaterial({
      color: 0x2A9D8F,
      transparent: true,
      opacity: 0.1,
    });

    for (let w = 0; w < waveCount; w++) {
      const points = [];
      const segmentCount = 50;
      const xStart = -15;
      const xEnd = 15;
      const yBase = (Math.random() - 0.5) * 8;
      const zBase = (Math.random() - 0.5) * 5;

      for (let i = 0; i <= segmentCount; i++) {
        const x = xStart + (i / segmentCount) * (xEnd - xStart);
        points.push(new THREE.Vector3(x, yBase, zBase));
      }

      const waveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(waveGeo, waveMaterial);
      scene.add(line);
      waves.push({ line, initialPoints: [...points] });
    }

    // 3. Floating Medical Crosses
    const createCross = () => {
      const group = new THREE.Group();
      const crossMat = new THREE.MeshPhongMaterial({
        color: 0x7209B7,
        transparent: true,
        opacity: 0.04,
        flatShading: true
      });
      const geoH = new THREE.BoxGeometry(0.5, 0.12, 0.12);
      const geoV = new THREE.BoxGeometry(0.12, 0.5, 0.12);
      group.add(new THREE.Mesh(geoH, crossMat));
      group.add(new THREE.Mesh(geoV, crossMat));
      return group;
    };

    const crosses: THREE.Group[] = [];
    for (let i = 0; i < 8; i++) {
      const cross = createCross();
      cross.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );
      cross.rotation.set(Math.random(), Math.random(), Math.random());
      scene.add(cross);
      crosses.push(cross);
    }

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 10;

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Rotate scene slightly
      scene.rotation.y = Math.sin(time * 0.1) * 0.05;

      // Animate Brainwaves
      waves.forEach((wave, wIdx) => {
        const positions = wave.line.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < wave.initialPoints.length; i++) {
          const initial = wave.initialPoints[i];
          // Create wave effect: sine waves with different frequencies
          const waveEffect = Math.sin(time * 2 + initial.x * 0.5 + wIdx) * 0.3;
          const noiseEffect = Math.sin(time * 5 + initial.x * 2) * 0.1;
          
          positions[i * 3 + 1] = initial.y + waveEffect + noiseEffect;
        }
        wave.line.geometry.attributes.position.needsUpdate = true;
      });

      // Animate Nodes
      nodes.forEach((node, i) => {
        node.position.y += Math.sin(time + i) * 0.003;
        node.rotation.x += 0.005;
        node.rotation.y += 0.005;
      });

      // Animate Crosses
      crosses.forEach((cross, i) => {
        cross.position.y += Math.cos(time + i) * 0.004;
        cross.rotation.z += 0.002;
        cross.rotation.x += 0.001;
      });

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
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
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

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" />;
};

export default LowPolyMedicalScene;
