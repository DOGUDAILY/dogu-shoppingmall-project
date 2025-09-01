import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Product3DPage = () => {
  const mountRef = useRef(null);
  const navigate = useNavigate();
  const productList = useSelector((state) => state.product.productList);

  useEffect(() => {
    if (!productList.length) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // 빛
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // 큐브 생성
    const cubes = [];
    const loader = new THREE.TextureLoader();

    productList.forEach((product, index) => {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = [
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // 오른쪽
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // 왼쪽
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // 위
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // 아래
        new THREE.MeshBasicMaterial({
          map: loader.load(product.image), // 앞면에 이미지
        }),
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // 뒷면
      ];
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = (index % 5) * 3 - 6; // 가로로 배치
      cube.position.y = -Math.floor(index / 5) * 3 + 3; // 세로로 배치
      cube.userData = { id: product._id };
      scene.add(cube);
      cubes.push(cube);
    });

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cubes);
      if (intersects.length > 0) {
        const clickedCube = intersects[0].object;
        navigate(`/product/${clickedCube.userData.id}`);
      }
    };

    renderer.domElement.addEventListener("click", handleClick);

    const animate = () => {
      requestAnimationFrame(animate);
      cubes.forEach((cube) => {
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.005;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.domElement.removeEventListener("click", handleClick);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [productList]);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default Product3DPage;
