import React from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router';
import { cn } from '../../utils';
import { NAV_ITEMS, ROUTES } from '../../constants/links';

export default function TopNav({ activeHref, className, items = NAV_ITEMS }) {
  const location = useLocation();
  const currentPath = location.pathname + location.hash;

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full shrink-0 z-10", className)}
    >
      <nav className="w-full flex items-center justify-center gap-2 sm:gap-4 bg-primary-950 text-secondary-300 px-4 sm:px-8 rounded-xl text-xs sm:text-sm font-bold relative">
        {items.map((item, idx) => {
          const isActive = activeHref !== undefined
            ? activeHref === item.href
            : item.href === ROUTES.HOME
              ? currentPath === ROUTES.HOME || currentPath === ''
              : currentPath === item.href;

          return (
            <Link
              key={idx}
              to={item.href}
              className={` relative px-4 py-4  transition-colors duration-200 select-none ${isActive
                ? 'text-secondary-200 font-extrabold'
                : 'text-secondary-100 hover:text-white '
                }`}
            >
              <span className="relative z-10">{item.label}</span>


              {/* Morphing bottom border line indicator */}
              {isActive && (
                <motion.div
                  layoutId="topNavActiveBorder"
                  className="absolute bottom-0 inset-x-1 h-0.75 bg-secondary-200 rounded-full z-10 shadow-xs shadow-secondary-300/50"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </motion.header>
  );
}
