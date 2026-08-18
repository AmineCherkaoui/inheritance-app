import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import TopNav from '../components/calculatorV3/TopNav';
import MobileNav from '../components/calculatorV3/MobileNav';
import { ROUTES } from '../constants/links';

export default function HomePage() {
  return (
    <div
      className="relative min-h-svh w-full text-white flex flex-col justify-between select-none font-sans overflow-hidden bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/images/bg-home.png')",
        backgroundPosition: 'left center',
        backgroundSize: 'cover'
      }}
      dir="rtl"
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />

      {/* Mobile Top Navigation */}
      <div className="md:hidden w-full flex items-center justify-between backdrop-blur-md px-4 py-2.5 relative z-10">
        <MobileNav activeHref={ROUTES.HOME} />
      </div>

      {/* Desktop Top Navigation */}
      <header className="relative z-10 w-full pt-4 sm:pt-6 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col items-center">
        <div className="hidden md:flex w-full justify-center max-w-4xl   shadow rounded-xl">
          <TopNav activeHref={ROUTES.HOME} />
        </div>
      </header>

      {/* Middle Hero Section: Logo + CTA Button */}
      <main className="container mx-auto relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 my-auto py-8">
        {/* Center Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center space-y-4"
        >
          <img
            src="/images/logo.svg"
            alt="حساب الفرائض والمواريث"
            className="w-48 sm:w-60 md:w-72 drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="relative max-w-5xl mx-auto w-full flex items-center justify-center px-3 sm:px-8 py-3 sm:py-6 overflow-hidden sm:overflow-visible"
        >
          {/* Right motif (RTL Start) */}
          <img
            src="/images/home-motif.svg"
            alt=""
            className="absolute hidden lg:block -right-32 inset-y-0 h-full w-[56%] object-fill scale-x-[-1] object-left opacity-25 sm:opacity-30 pointer-events-none select-none"
          />

          {/* Left motif (RTL End) */}
          <img
            src="/images/home-motif.svg"
            alt=""
            className="absolute hidden lg:block -left-32 inset-y-0 h-full w-[56%] object-fill object-left opacity-25 sm:opacity-30 pointer-events-none select-none"
          />

          {/* Text Content */}
          <p className="relative z-10 text-secondary-100 font-bold text-xs sm:text-sm md:text-[15px] leading-relaxed sm:leading-loose text-center  max-w-4xl drop-shadow-md">
            الميراث في المغرب هو منظومة قانونية مستمدة من أحكام الشريعة الإسلامية، وتُنظَّم بموجب مدونة الأسرة، في إطار المرجعية الفقهية المالكية والاجتهاد، بهدف تنظيم انتقال أموال المتوفى وحقوقه إلى مستحقيها، وفق قواعد شرعية وقانونية محددة.
          </p>
        </motion.div>

        {/* Main CTA Button: حساب الميراث */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          className="mt-8 sm:mt-10"
        >
          <motion.div
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={ROUTES.CALCULATION}
              className="px-8 py-2.5 rounded-2xl bg-secondary-200 text-primary-950 font-black text-sm sm:text-base hover:bg-secondary-100 transition-all text-center tracking-wide block"
            >
              حساب الميراث
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
