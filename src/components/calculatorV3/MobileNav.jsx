import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router';
import { X } from 'lucide-react';
import Sheet, { SheetClose } from '../ui/Sheet';
import { cn } from '../../utils';
import { MOBILE_NAV_ITEMS, ROUTES } from '../../constants/links';

export default function MobileNav({
  activeHref,
  items = MOBILE_NAV_ITEMS
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname + location.hash;

  const linksContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.10,
        delayChildren: 0.2
      }
    }
  };

  const linkItemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="فتح القائمة الرئيسية"
        className="size-10 text-secondary-200 border-none flex items-center justify-center cursor-pointer transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="size-12" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </motion.button>

      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        side="right"
        size="sm"
        dir="rtl"
        className="bg-primary-950 text-white border-l border-secondary-100/40 flex flex-col justify-between overflow-hidden py-4 rounded-l-4xl"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-cover pointer-events-none"
          style={{ backgroundImage: "url('/images/motif.svg')" }}
        />

        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 px-4 pt-2 flex flex-col items-center"
        >
          <div className="w-full flex items-center justify-start">
            <SheetClose
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-secondary-200/80 hover:text-secondary-200 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={24} className="stroke-3" />
            </SheetClose>
          </div>

          <motion.div
            initial={{ opacity: 0, }}
            animate={{ opacity: 1, }}
            transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
            className="flex flex-col items-center mt-2 space-y-4"
          >
            <img src="/images/logo.svg" alt="شعار حساب الفرائض والمواريث" className="w-32" />
            <img src="/images/divider.png" alt="فاصل" className="w-48 opacity-85" />
          </motion.div>
        </motion.div>

        {/* Middle Navigation Links with Staggered Motion */}
        <motion.div
          variants={linksContainerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col w-full my-auto py-6"
        >
          {items.map((item, idx) => {
            const isActive =
              activeHref !== undefined
                ? activeHref === item.href
                : item.href === ROUTES.HOME
                  ? currentPath === ROUTES.HOME || currentPath === ''
                  : currentPath === item.href;

            return (
              <motion.div
                key={idx}
                variants={linkItemVariants}
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'w-full text-right py-4 px-6 transition-colors duration-200 text-base font-bold sm:text-lg select-none block',
                    isActive
                      ? 'bg-primary-500/20 text-secondary-300 border-r-4 border-primary-200/40'
                      : 'text-secondary-100 hover:text-secondary-200 hover:bg-white/5'
                  )}
                >
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08, ease: 'easeOut', }}
          className="relative z-10 px-6 pt-4 pb-2 flex justify-center w-full"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={ROUTES.CALCULATION}
              onClick={() => setIsOpen(false)}
              className="px-8 py-2.5 rounded-2xl bg-secondary-200 text-primary-950 font-black text-sm sm:text-base shadow-xl hover:bg-white transition-all text-center tracking-wide block"
            >
              حساب الميراث
            </Link>
          </motion.div>
        </motion.div>
      </Sheet>
    </>
  );
}
