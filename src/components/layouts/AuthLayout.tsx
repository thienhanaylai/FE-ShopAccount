import { Outlet, useLocation } from "react-router";
import { Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingParticles } from "./FloatingParticles";

const containerClass = "min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900";
const bgImageClass = "absolute inset-0 bg-[url('https://images.unsplash.com/photo-1641650265007-b2db704cd9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmVvbiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzM5MzY4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-20";
const bgOverlayClass = "absolute inset-0 bg-gradient-to-t from-slate-900/90 via-purple-900/50 to-slate-900/90";
const orbPurpleClass = "absolute top-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20";
const orbCyanClass = "absolute top-40 -right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20";
const orbPinkClass = "absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20";
const contentWrapperClass = "relative z-10 min-h-screen flex flex-col items-center justify-center p-4";
const logoBlurClass = "absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl blur-lg opacity-75";
const logoBgClass = "relative w-14 h-14 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center";
const logoTextClass = "text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent";

export function AuthLayout() {
  const location = useLocation();

  return (
    <div className={containerClass}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className={bgImageClass} />
        <div className={bgOverlayClass} />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Animated Gradient Orbs */}
      <motion.div
        className={orbPurpleClass}
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={orbCyanClass}
        animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={orbPinkClass}
        animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className={contentWrapperClass}>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="relative">
            <div className={logoBlurClass} />
            <div className={logoBgClass}>
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <span className={logoTextClass}>
              Shop Acc Giá Rẻ
            </span>
          </div>
        </motion.div>

        {/* Forms with AnimatePresence */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <div key={location.pathname}>
              <Outlet />
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}