"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";

const getCities = (t: (s: string) => string) => [
    { name: t("Istanbul"), lat: 41.01, lon: 28.95 },
    { name: t("Ankara"), lat: 41.01, lon: 28.95 },
    { name: t("London"), lat: 51.51, lon: -0.13 },
    { name: t("Paris"), lat: 48.85, lon: 2.35 },
    { name: t("Berlin"), lat: 52.52, lon: 13.40 },
    { name: t("Moscow"), lat: 55.75, lon: 37.62 },
    { name: t("Dubai"), lat: 25.20, lon: 55.27 },
    { name: t("Mumbai"), lat: 19.08, lon: 72.88 },
    { name: t("Singapore"), lat: 1.35, lon: 103.82 },
    { name: t("Tokyo"), lat: 35.68, lon: 139.69 },
    { name: t("Shanghai"), lat: 31.23, lon: 121.47 },
    { name: t("Sydney"), lat: -33.87, lon: 151.21 },
    { name: t("New York"), lat: 40.71, lon: -74.01 },
    { name: t("Los Angeles"), lat: 34.05, lon: -118.24 },
    { name: t("Sao Paulo"), lat: -23.55, lon: -46.63 },
];

function ll2v3(lat: number, lon: number, r: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
    );
}

export function Globe3D() {
    const { t, language } = useLanguage();
    const CITIES = getCities(t);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const W = el.clientWidth;
        const H = el.clientHeight;

        /* ── Renderer ── */
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        el.appendChild(renderer.domElement);

        /* ── Overlay div for HTML labels ── */
        const labelLayer = document.createElement("div");
        labelLayer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden;";
        el.appendChild(labelLayer);

        /* ── Scene ── */
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
        camera.position.z = 2.8;

        /* ── Earth ── */
        const geo = new THREE.SphereGeometry(1, 72, 72);
        const loader = new THREE.TextureLoader();

        // NASA Blue Marble — served from three.js CDN
        const earthTex = loader.load("https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg");
        const bumpTex = loader.load("https://threejs.org/examples/textures/earth_specular_2048.jpg");

        const mat = new THREE.MeshPhongMaterial({
            map: earthTex,
            specularMap: bumpTex,
            specular: new THREE.Color(0x2255aa),
            shininess: 18,
        });
        const earth = new THREE.Mesh(geo, mat);
        scene.add(earth);

        /* ── Atmosphere ── */
        const atmMat = new THREE.MeshPhongMaterial({
            color: 0x3388ff,
            transparent: true,
            opacity: 0.07,
            side: THREE.FrontSide,
        });
        scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.035, 48, 48), atmMat));

        /* ── Lights ── */
        scene.add(new THREE.AmbientLight(0xffffff, 0.45));
        const sun = new THREE.DirectionalLight(0xfff5e0, 1.4);
        sun.position.set(5, 3, 5);
        scene.add(sun);
        const fill = new THREE.DirectionalLight(0x4488cc, 0.2);
        fill.position.set(-5, -2, -5);
        scene.add(fill);

        /* ── City markers (3D dots) ── */
        const dotGeo = new THREE.SphereGeometry(0.012, 8, 8);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });

        const cityLocalPositions = CITIES.map(c => ll2v3(c.lat, c.lon, 1.012));
        const dots: THREE.Mesh[] = [];
        cityLocalPositions.forEach(pos => {
            const dot = new THREE.Mesh(dotGeo, dotMat);
            dot.position.copy(pos);
            earth.add(dot);
            dots.push(dot);
        });

        /* ── HTML label divs ── */
        const labelDivs: HTMLDivElement[] = CITIES.map(city => {
            const div = document.createElement("div");
            div.textContent = city.name;
            div.style.cssText = `
        position: absolute;
        font-size: 10px;
        font-weight: 700;
        font-family: system-ui, sans-serif;
        color: #fff;
        background: rgba(0,0,0,0.6);
        padding: 1px 6px;
        border-radius: 5px;
        border: 1px solid rgba(255,220,60,0.45);
        letter-spacing: 0.04em;
        white-space: nowrap;
        transform: translate(-50%, -180%);
        pointer-events: none;
        transition: opacity 0.15s;
      `;
            labelLayer.appendChild(div);
            return div;
        });

        /* ── Stars ── */
        const sv: number[] = [];
        for (let i = 0; i < 2500; i++) {
            const r = 9 + Math.random();
            const t = Math.random() * Math.PI * 2;
            const p = Math.acos(2 * Math.random() - 1);
            sv.push(r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t));
        }
        const sGeo = new THREE.BufferGeometry();
        sGeo.setAttribute("position", new THREE.Float32BufferAttribute(sv, 3));
        scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.016, transparent: true, opacity: 0.6 })));

        /* ── Drag ── */
        let drag = false;
        let prev = { x: 0, y: 0 };
        let vel = { x: 0, y: 0.0012 };

        const down = (e: MouseEvent | TouchEvent) => {
            drag = true;
            const p = "touches" in e ? e.touches[0] : e;
            prev = { x: p.clientX, y: p.clientY };
        };
        const up = () => { drag = false; };
        const move = (e: MouseEvent | TouchEvent) => {
            if (!drag) return;
            const p = "touches" in e ? e.touches[0] : e;
            vel.y = (p.clientX - prev.x) * 0.005;
            vel.x = (p.clientY - prev.y) * 0.004;
            prev = { x: p.clientX, y: p.clientY };
        };

        renderer.domElement.addEventListener("mousedown", down);
        renderer.domElement.addEventListener("touchstart", down, { passive: true });
        window.addEventListener("mouseup", up);
        window.addEventListener("touchend", up);
        window.addEventListener("mousemove", move);
        window.addEventListener("touchmove", move as any, { passive: true });

        /* ── Helpers for label projection ── */
        const worldPos = new THREE.Vector3();
        const projected = new THREE.Vector3();

        /* ── Animation loop ── */
        let animId: number;
        const animate = () => {
            animId = requestAnimationFrame(animate);

            // Auto-rotate or decelerate
            if (!drag) { vel.y = 0.0009; vel.x *= 0.93; }
            else { vel.x *= 0.88; vel.y *= 0.88; }

            earth.rotation.y += vel.y;
            earth.rotation.x = Math.max(-0.45, Math.min(0.45, earth.rotation.x + vel.x));

            renderer.render(scene, camera);

            /* ── Update HTML labels: project 3D → 2D and hide back-face ── */
            const wCanvas = renderer.domElement.clientWidth;
            const hCanvas = renderer.domElement.clientHeight;

            dots.forEach((dot, i) => {
                // Get world position of the dot (after earth rotation)
                dot.getWorldPosition(worldPos);

                // Visibility: dot is on front face if it faces the camera
                const cameraDir = camera.position.clone().sub(worldPos);
                const surfaceNormal = worldPos.clone().normalize();
                const frontFacing = cameraDir.dot(surfaceNormal) > 0;

                const div = labelDivs[i];
                if (!frontFacing) {
                    div.style.opacity = "0";
                    return;
                }

                // Project to NDC then to pixel coords
                projected.copy(worldPos).project(camera);
                const x = (projected.x * 0.5 + 0.5) * wCanvas;
                const y = (-projected.y * 0.5 + 0.5) * hCanvas;

                div.style.opacity = "1";
                div.style.left = `${x}px`;
                div.style.top = `${y}px`;
            });
        };
        animate();

        /* ── Resize ── */
        const resize = () => {
            if (!el) return;
            const w = el.clientWidth, h = el.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mouseup", up);
            window.removeEventListener("mousemove", move);
            renderer.dispose();
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
            if (el.contains(labelLayer)) el.removeChild(labelLayer);
        };
    }, [language]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full cursor-grab active:cursor-grabbing"
        />
    );
}
