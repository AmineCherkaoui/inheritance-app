/**
 * Application Routes & Navigation Links Constants
 * Modify links here to update them globally across the application.
 */

export const ROUTES = {
  HOME: '/',
  CALCULATION: '/hissab',
  ABOUT: '/#about',
  RULES: '/#rules',
  ABOUT_US: '/#about-us',
};

export const NAV_ITEMS = [
  { label: 'الرئيسية', href: ROUTES.HOME },
  { label: 'عن الميراث', href: ROUTES.ABOUT },
  { label: 'أحكام الميراث', href: ROUTES.RULES },
  { label: 'من نحن؟', href: ROUTES.ABOUT_US },
  { label: 'حاسبة الميراث', href: ROUTES.CALCULATION },
];

export const MOBILE_NAV_ITEMS = [
  { label: 'الرئيسية', href: ROUTES.HOME },
  { label: 'عن الميراث', href: ROUTES.ABOUT },
  { label: 'أحكام الميراث', href: ROUTES.RULES },
  { label: 'من نحن؟', href: ROUTES.ABOUT_US },
];
