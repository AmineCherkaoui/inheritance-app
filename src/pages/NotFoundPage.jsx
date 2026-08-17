import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import TopNav from '../components/calculatorV3/TopNav';
import MobileNav from '../components/calculatorV3/MobileNav';
import { ROUTES } from '../constants/links';

export default function NotFoundPage() {
  return (
    <div
      className="relative min-h-svh w-full bg-primary-950 text-white flex flex-col justify-between select-none font-sans overflow-hidden bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/images/bg-home.png')",
        backgroundPosition: 'left center',
        backgroundSize: 'cover'
      }}
      dir="rtl"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none z-0" />

      {/* Mobile Top Navigation */}
      <div className="md:hidden w-full flex items-center justify-between backdrop-blur-md px-4 py-2.5 relative z-10">
        <MobileNav />
      </div>

      {/* Desktop Top Navigation */}
      <header className="relative z-10 w-full pt-4 sm:pt-6 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col items-center">
        <div className="hidden md:flex w-full justify-center max-w-2xl">
          <TopNav />
        </div>
      </header>

      {/* Middle 404 Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 my-auto py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center space-y-4 max-w-md mx-auto"
        >
          {/* Logo */}
          <img
            src="/images/logo.svg"
            alt="حساب الفرائض والمواريث"
            className="w-36 sm:w-44 drop-shadow-2xl"
          />

          {/* 404 Number Badge */}
          <div className="text-5xl sm:text-7xl font-black text-secondary-200 font-mono tracking-widest drop-shadow-lg pt-2">
            404
          </div>

          <img
            src="/images/divider.png"
            alt="فاصل"
            className="w-40 sm:w-48 opacity-80 drop-shadow-md"
          />

          {/* Error Message */}
          <div className="space-y-1 pt-1">
            <h1 className="text-xl sm:text-2xl font-black text-white">
              الصفحة غير موجودة
            </h1>
            <p className="text-xs sm:text-sm text-secondary-100/80 leading-relaxed max-w-xs sm:max-w-sm">
              عذراً، الصفحة التي تحاول الوصول إليها غير متوفرة أو قد تم تغيير رابطها.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="mt-8 flex flex-col sm:flex-row gap-8"
        >
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link
              to={ROUTES.HOME}
              className="px-6 py-2.5 text-center rounded-2xl bg-white/10 border border-secondary-200/30 text-white font-bold text-xs sm:text-sm hover:bg-white/20 transition-all gap-2"
            >
              <span>الرئيسية</span>
            </Link>
          </motion.div>

          <motion.div whileTap={{ scale: 0.95 }}>
            <Link
              to={ROUTES.CALCULATION}
              className="px-8 py-2.5 rounded-2xl bg-secondary-200 text-primary-950 font-black text-xs sm:text-sm hover:bg-secondary-100 transition-all text-center tracking-wide gap-2"
            >
              <span>حساب الميراث</span>
            </Link>
          </motion.div>
        </motion.div>
      </main>


    </div>
  );
}
