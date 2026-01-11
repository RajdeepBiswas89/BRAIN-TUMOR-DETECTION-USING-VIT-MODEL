
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Doctor3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Materials
    const skinMat = new THREE.MeshPhongMaterial({ color: 0xffdbac });
    const whiteCoatMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const blueScrubMat = new THREE.MeshPhongMaterial({ color: 0x4361EE });
    const hairMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const eyeMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const stethoscopeMat = new THREE.MeshPhongMaterial({ color: 0x555555 });

    // Head Group for nodding/looking
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.3;
    group.add(headGroup);

    // Head
    const headGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const head = new THREE.Mesh(headGeo, skinMat);
    headGroup.add(head);

    // Hair/Cap
    const hairGeo = new THREE.SphereGeometry(0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    headGroup.add(hair);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.15, 0.05, 0.45);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.15, 0.05, 0.45);
    headGroup.add(leftEye, rightEye);

    // Mask
    const maskGeo = new THREE.BoxGeometry(0.4, 0.2, 0.1);
    const mask = new THREE.Mesh(maskGeo, blueScrubMat);
    mask.position.set(0, -0.1, 0.45);
    headGroup.add(mask);

    // Torso (White Coat)
    const torsoGeo = new THREE.CylinderGeometry(0.4, 0.5, 1.2, 32);
    const torso = new THREE.Mesh(torsoGeo, whiteCoatMat);
    torso.position.y = 0.4;
    group.add(torso);

    // Inner Scrubs
    const scrubGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
    const scrubs = new THREE.Mesh(scrubGeo, blueScrubMat);
    scrubs.position.y = 0.95;
    group.add(scrubs);

    // Waving Arm (Right Arm)
    const armGroup = new THREE.Group();
    armGroup.position.set(0.5, 0.8, 0); // Shoulder position
    group.add(armGroup);

    const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 16);
    const arm = new THREE.Mesh(armGeo, whiteCoatMat);
    arm.position.y = -0.35;
    armGroup.add(arm);

    const handGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.y = -0.7;
    armGroup.add(hand);

    // Static Left Arm
    const leftArmGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 16);
    const leftArm = new THREE.Mesh(leftArmGeo, whiteCoatMat);
    leftArm.position.set(-0.5, 0.45, 0);
    leftArm.rotation.z = 0.1;
    group.add(leftArm);

    // Stethoscope
    const stethTorusGeo = new THREE.TorusGeometry(0.45, 0.03, 16, 32, Math.PI);
    const stethTorus = new THREE.Mesh(stethTorusGeo, stethoscopeMat);
    stethTorus.rotation.x = Math.PI / 2;
    stethTorus.position.y = 0.9;
    group.add(stethTorus);

    const chestPieceGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
    const chestPiece = new THREE.Mesh(chestPieceGeo, stethoscopeMat);
    chestPiece.rotation.x = Math.PI / 2;
    chestPiece.position.set(0.2, 0.5, 0.45);
    group.add(chestPiece);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x4cc9f0, 0.5);
    pointLight.position.set(-2, 1, 2);
    scene.add(pointLight);

    camera.position.set(0, 1.2, 3.5);
    camera.lookAt(0, 1, 0);

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Gentle floating animation
      group.position.y = Math.sin(time) * 0.05;
      
      // Head looking around slightly
      headGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
      headGroup.rotation.x = Math.sin(time * 0.3) * 0.05;
      
      // Waving arm animation
      // Start with shoulder rotation to wave
      armGroup.rotation.z = Math.PI / 1.5 + Math.sin(time * 4) * 0.5;
      armGroup.rotation.x = Math.sin(time * 2) * 0.2;

      // Subtle rotation for the whole model
      group.rotation.y = Math.sin(time * 0.2) * 0.05;

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

export default Doctor3D;
