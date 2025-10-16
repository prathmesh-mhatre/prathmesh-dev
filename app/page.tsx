"use client";
import Image from "next/image";
import useMousePosition from "./utils/useMousePosition";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import BinaryTextFill from "./components/BinaryTextFill";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;
  const [isMd, setIsMd] = useState(false);
  const [isLg, setIsLg] = useState(false);
  useEffect(() => {
    const update = () => {
      setIsMd(window.matchMedia("(min-width: 768px)").matches);
      setIsLg(window.matchMedia("(min-width: 1024px)").matches);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return (
    <main className="flex items-center justify-center h-screen">
      <motion.div
        className="w-full h-full flex items-center justify-center mask"
        animate={{ webkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`, webkitMaskSize: `${size}px ${size}px` }}
        transition={{ type: "tween", ease: "backOut" }}
      >
        <div className="text-[2.5rem] md:text-[6rem] lg:text-[10rem] font-bold" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <BinaryTextFill text="BinaryBrain.Dev" fontSize={isLg ? 160 : isMd ? 96 : 64} fontWeight={700} density={1.6} color="#e5e5e5" />
          <div className="text-[0.5rem] md:text-[1rem] lg:text-[1.5rem] font-bold text-center">Blame the developer (that’s me).</div>
        </div>
      </motion.div>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="text-[2.5rem] md:text-[6rem] lg:text-[10rem] font-bold">Prathmesh.Dev</div>
        <div className="text-[0.5rem] md:text-[1rem] lg:text-[1.5rem] font-bold">Website under construction...</div>
      </div>
    </main>
  );
}
