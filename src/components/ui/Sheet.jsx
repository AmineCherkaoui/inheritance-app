import React, { useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../utils';

const SheetContext = createContext(null);

export function useSheet() {
  return useContext(SheetContext);
}

/**
 * Reusable Sheet / Drawer Component
 *
 * Props:
 * - isOpen: boolean (whether the sheet is open)
 * - onClose: function (callback when closing)
 * - side: 'right' | 'left' | 'top' | 'bottom' (default: 'right')
 * - size: 'sm' | 'md' | 'lg' | 'xl' | 'full' | custom width class
 * - closeOnBackdropClick: boolean (default: true)
 * - closeOnEsc: boolean (default: true)
 * - showCloseButton: boolean (default: false, or use <Sheet.Close />)
 * - backdropClassName: string (custom classes for backdrop)
 * - className: string (custom classes for sheet panel)
 * - dir: 'rtl' | 'ltr' (default: 'rtl')
 */
export default function Sheet({
  isOpen = false,
  onClose,
  side = 'right',
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEsc = true,
  showCloseButton = false,
  backdropClassName,
  className,
  dir = 'rtl',
  children
}) {
  // ESC key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose?.();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);

  const getPlacementClasses = () => {
    switch (side) {
      case 'left':
        return {
          panel: 'fixed top-0 bottom-0 left-0 h-full',
          variants: {
            initial: { x: '-100%' },
            animate: { x: 0 },
            exit: { x: '-100%' }
          }
        };
      case 'top':
        return {
          panel: 'fixed top-0 left-0 right-0 w-full',
          variants: {
            initial: { y: '-100%' },
            animate: { y: 0 },
            exit: { y: '-100%' }
          }
        };
      case 'bottom':
        return {
          panel: 'fixed bottom-0 left-0 right-0 w-full',
          variants: {
            initial: { y: '100%' },
            animate: { y: 0 },
            exit: { y: '100%' }
          }
        };
      case 'right':
      default:
        return {
          panel: 'fixed top-0 bottom-0 right-0 h-full',
          variants: {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' }
          }
        };
    }
  };

  const getSizeClasses = () => {
    const isHorizontal = side === 'left' || side === 'right';
    if (isHorizontal) {
      switch (size) {
        case 'sm':
          return 'w-full max-w-xs';
        case 'md':
          return 'w-full max-w-sm sm:max-w-md';
        case 'lg':
          return 'w-full max-w-lg';
        case 'xl':
          return 'w-full max-w-2xl';
        case 'full':
          return 'w-full max-w-full';
        default:
          return size; // allows custom Tailwind class e.g. "max-w-md"
      }
    } else {
      switch (size) {
        case 'sm':
          return 'max-h-[30vh]';
        case 'md':
          return 'max-h-[50vh]';
        case 'lg':
          return 'max-h-[75vh]';
        case 'xl':
        case 'full':
          return 'max-h-full h-full';
        default:
          return size;
      }
    }
  };

  const { panel, variants } = getPlacementClasses();
  const sizeClasses = getSizeClasses();

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <SheetContext.Provider value={{ onClose, side }}>
          <div
            dir={dir}
            className="fixed inset-0 z-50 select-none font-sans"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              onClick={closeOnBackdropClick ? onClose : undefined}
              className={cn(
                'fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity',
                backdropClassName
              )}
            />

            {/* Sheet Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              initial={variants.initial}
              animate={variants.animate}
              exit={variants.exit}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'z-10 flex flex-col shadow-2xl overflow-hidden focus:outline-hidden will-change-transform',
                panel,
                sizeClasses,
                className
              )}
            >
              {showCloseButton && (
                <div className="absolute top-3 left-3 z-20">
                  <SheetClose />
                </div>
              )}
              {children}
            </motion.div>
          </div>
        </SheetContext.Provider>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Compound Header Component
export function SheetHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 p-4 sm:p-5 border-b border-border/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Compound Title Component
export function SheetTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn('text-base sm:text-lg font-black text-foreground', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

// Compound Description Component
export function SheetDescription({ className, children, ...props }) {
  return (
    <p
      className={cn('text-xs text-muted-foreground leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  );
}

// Compound Body Component
export function SheetBody({ className, children, ...props }) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto p-4 sm:p-5 space-y-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Compound Footer Component
export function SheetFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 p-4 border-t border-border/50 bg-muted/20',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Compound Close Button Component
export function SheetClose({ className, children, onClick, ...props }) {
  const context = useSheet();
  const handleClick = (e) => {
    onClick?.(e);
    context?.onClose?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="إغلاق"
      className={cn(
        'p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer active:scale-95',
        className
      )}
      {...props}
    >
      {children || <X size={20} className="stroke-2.5" />}
    </button>
  );
}

// Attach sub-components to Sheet
Sheet.Header = SheetHeader;
Sheet.Title = SheetTitle;
Sheet.Description = SheetDescription;
Sheet.Body = SheetBody;
Sheet.Content = SheetBody;
Sheet.Footer = SheetFooter;
Sheet.Close = SheetClose;
