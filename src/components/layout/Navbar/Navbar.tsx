'use client';

import profilePicture from 'assets/profile-picture.png';
import { tokens } from 'components/layout/ThemeProvider/theme';
import { useTheme } from 'components/layout/ThemeProvider/useTheme';
import { Icon } from 'components/ui/Icon/Icon';
import { useAppContext, useScrollToHash, useWindowSize } from 'hooks';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { classes, cssProps, media, msToNum, numToMs } from 'utils/style';
import { navLinks, socialLinks } from './navData';
import { NavToggle } from './NavToggle';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const [current, setCurrent] = useState<string>();
  const [target, setTarget] = useState<string | null>(null);
  const { themeId } = useTheme();
  const { menuOpen, dispatch } = useAppContext();
  const pathname = usePathname();
  const route = pathname;
  const asPath = pathname;
  const windowSize = useWindowSize();
  const headerRef = useRef<HTMLElement>(null);
  const isMobile = windowSize.width <= media.mobile || windowSize.height <= 800;
  const scrollToHash = useScrollToHash();

  useEffect(() => {
    // Prevent ssr mismatch by storing this in state
    setCurrent(asPath);
  }, [asPath]);

  // Handle smooth scroll nav items
  useEffect(() => {
    if (!target || route !== '/') return;
    setCurrent(`${route}${target}`);
    scrollToHash(target, () => setTarget(null));
  }, [route, scrollToHash, target]);

  // Handle swapping the theme when intersecting with inverse themed elements
  useEffect(() => {
    const navItems = document.querySelectorAll('[data-navbar-item]');
    const inverseTheme = themeId === 'dark' ? 'light' : 'dark';
    const { innerHeight } = window;

    let inverseMeasurements: { element: Element; top: number; bottom: number }[] = [];
    let navItemMeasurements: { element: Element; top: number; bottom: number }[] = [];

    const isOverlap = (rect1: { top: number; bottom: number }, rect2: { top: number; bottom: number }, scrollY: number) => {
      return !(rect1.bottom - scrollY < rect2.top || rect1.top - scrollY > rect2.bottom);
    };

    const resetNavTheme = () => {
      for (const measurement of navItemMeasurements) {
        (measurement.element as HTMLElement).dataset.theme = '';
      }
    };

    const handleInversion = () => {
      const invertedElements = document.querySelectorAll(
        `[data-theme='${inverseTheme}'][data-invert]`
      );

      if (!invertedElements) return;

      inverseMeasurements = Array.from(invertedElements).map(item => ({
        element: item,
        top: (item as HTMLElement).offsetTop,
        bottom: (item as HTMLElement).offsetTop + (item as HTMLElement).offsetHeight,
      }));

      const { scrollY } = window;

      resetNavTheme();

      for (const inverseMeasurement of inverseMeasurements) {
        if (
          inverseMeasurement.top - scrollY > innerHeight ||
          inverseMeasurement.bottom - scrollY < 0
        ) {
          continue;
        }

        for (const measurement of navItemMeasurements) {
          if (isOverlap(inverseMeasurement, measurement, scrollY)) {
            (measurement.element as HTMLElement).dataset.theme = inverseTheme;
          } else {
            (measurement.element as HTMLElement).dataset.theme = '';
          }
        }
      }
    };

    // Currently only the light theme has dark full-width elements
    if (themeId === 'light') {
      navItemMeasurements = Array.from(navItems).map(item => {
        const rect = item.getBoundingClientRect();

        return {
          element: item,
          top: rect.top,
          bottom: rect.bottom,
        };
      });

      document.addEventListener('scroll', handleInversion);
      handleInversion();
    }

    return () => {
      document.removeEventListener('scroll', handleInversion);
      resetNavTheme();
    };
  }, [themeId, windowSize, asPath]);

  // Check if a nav item should be active
  const getCurrent = (url = ''): boolean | 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | undefined => {
    const nonTrailing = current?.endsWith('/') ? current?.slice(0, -1) : current;

    if (url === nonTrailing) {
      return 'page';
    }

    return undefined;
  };

  // Store the current hash to scroll to
  const handleNavItemClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const hash = event.currentTarget.href.split('#')[1];
    setTarget(null);

    if (hash && route === '/') {
      setTarget(`#${hash}`);
      event.preventDefault();
    }
  };

  const handleMobileNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    handleNavItemClick(event);
    if (menuOpen) dispatch({ type: 'toggleMenu' });
  };

  return (
    <header className={classes(
        'flex flex-col items-center justify-start p-0 w-[var(--spacing-2xl)] fixed top-[var(--spacing-outer)] left-[var(--spacing-outer)] bottom-[var(--spacing-outer)] z-40 isolate',
        'max-[696px]:[--headerNavFontSize:calc((22/16)*1rem)] max-h-[800px]:[--headerNavFontSize:calc((22/16)*1rem)]',
        'max-[696px]:bottom-auto max-h-[696px]:bottom-auto max-h-[800px]:!h-auto max-h-[800px]:!w-full max-h-[800px]:!bottom-auto max-h-[800px]:!justify-start max-h-[800px]:!items-start max-h-[800px]:!flex-row max-h-[800px]:!top-0 max-h-[800px]:!left-0'
        )} 
        ref={headerRef}
    >
      <RouterLink
        href={route === '/' ? '/#intro' : '/'}
        scroll={false}
        className={classes(
            'flex relative p-[var(--spacing-s)_var(--spacing-s)_var(--spacing-l)] z-20 rounded-full',
            'max-[696px]:pb-s'
        )}
        aria-label="Alexis Feron, Web Developer"
        onClick={handleMobileNavClick}
        title="Home"
        data-navbar-item
      >
        <img src={profilePicture.src} alt="Alexis Feron" className="w-[45px] h-[45px] min-w-[45px] min-h-[45px] rounded-full object-cover hover:animate-[pulse-blue_2s_infinite]" />
      </RouterLink>

      {isMobile && (
        <NavToggle onClick={() => dispatch({ type: 'toggleMenu' })} menuOpen={menuOpen} />
      )}

      <style jsx global>{`
        .nav-mobile-hidden {
          display: flex !important;
        }
        .nav-mobile-visible {
          display: none !important;
        }
        @media (max-height: 800px), (max-width: 696px) {
          .nav-mobile-hidden {
            display: none !important;
          }
          .nav-mobile-visible {
            display: flex !important;
          }
        }
      `}</style>

      <nav className={classes(
          "flex flex-col justify-center items-center flex-auto w-full min-h-0 z-10",
          "nav-mobile-hidden"
      )}>
        <div className="-rotate-90 flex flex-row-reverse gap-m whitespace-nowrap max-h-[800px]:gap-4 max-h-[800px]:text-sm">
          {navLinks.map(({ label, pathname }) => (
            <RouterLink
              href={pathname}
              scroll={false}
              key={label}
              className={classes(
                'p-m text-[rgb(var(--rgbText)/0.8)] font-medium text-[length:var(--headerNavFontSize)] no-underline relative transition-[color] duration-s ease-linear delay-[0.1s] leading-none inline-flex items-center',
                'hover:text-[var(--colorTextBody)] active:text-[var(--colorTextBody)] focus:text-[var(--colorTextBody)] aria-[current=page]:text-[var(--colorTextBody)]',
                
                // After element for underline
                'after:content-[""] after:absolute after:right-s after:left-s after:h-[4px] after:bg-accent after:scale-x-0 after:origin-right',
                'motion-safe:after:transition-transform motion-safe:after:duration-m motion-safe:after:ease-fast-out-slow-in',
                'hover:after:scale-x-100 hover:after:origin-left',
                'active:after:scale-x-100 active:after:origin-left',
                'focus:after:scale-x-100 focus:after:origin-left',
                'aria-[current=page]:after:scale-x-100 aria-[current=page]:after:origin-left'
              )}
              aria-current={getCurrent(pathname)}
              onClick={handleNavItemClick}
              title={label}
              data-navbar-item
            >
              {label}
            </RouterLink>
          ))}
        </div>
      </nav>
      <NavbarIcons desktop className={classes(
          "mb-[24px]",
          "nav-mobile-hidden"
      )} />
      <nav 
        className={classes(
            'fixed inset-0 bg-[rgb(var(--rgbBackground)/0.9)] transition-colors duration-l ease-fast-out-slow-in flex flex-col items-center justify-center backdrop-blur-[16px] z-[100]',
            'max-[696px]:flex max-h-[800px]:flex',
            'motion-safe:transition-[transform,background]',
            menuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-[-100%] opacity-0 pointer-events-none'
        )} 
        data-visible={menuOpen}
        aria-hidden={!menuOpen}
      >
        {/* Mobile Home/Profile Link - Absolute Top Left */}
        <RouterLink
          href={route === '/' ? '/#intro' : '/'}
          scroll={false}
          className={classes(
              'absolute top-[var(--spacing-outer)] left-[var(--spacing-outer)] z-[101]',
              'flex p-[var(--spacing-s)] rounded-full', // Simplified to uniform padding
              'pb-[var(--spacing-s)]' // Explicit bottom padding to match
          )}
          aria-label="Home"
          onClick={handleMobileNavClick}
        >
          <div className="relative grid grid-cols-[100%] grid-rows-[100%] overflow-hidden w-[45px] h-[45px] rounded-full isolate">
            <div className="absolute inset-0 bg-accent translate-y-full transition-transform duration-300" />
            <img 
              className="block w-full h-full object-cover relative z-10" 
              src={profilePicture.src} 
              width={45} 
              height={45} 
              alt="Alexis Feron" 
            />
          </div>
        </RouterLink>

        {navLinks.map(({ label, pathname }, index) => (
          <RouterLink
            href={pathname}
            scroll={false}
            key={label}
            className={classes(
                'w-full text-[length:var(--headerNavFontSize)] text-center no-underline text-[var(--colorTextBody)] p-l transition-opacity duration-s ease-fast-out-slow-in relative -top-m',
                'motion-safe:transition-[transform,opacity] motion-safe:translate-y-[calc(var(--spacing-xl)*-1)]',
                'max-[820px]:max-h-[420px]:top-auto',
                'max-[400px]:[--headerNavFontSize:calc((18/16)*1rem)] max-h-[360px]:[--headerNavFontSize:calc((18/16)*1rem)]',
                
                // After element
                'after:content-[""] after:absolute after:top-1/2 after:right-3xl after:left-3xl after:h-[4px] after:bg-accent after:scale-x-0 after:-translate-y-[1px] after:origin-right',
                'motion-safe:after:transition-transform motion-safe:after:duration-m motion-safe:after:ease-fast-out-slow-in',
                'hover:after:scale-x-100 hover:after:origin-left',
                'active:after:scale-x-100 active:after:origin-left',
                'focus:after:scale-x-100 focus:after:origin-left',

                menuOpen ? 'opacity-100 transform-none' : 'opacity-0'
            )}
            aria-current={getCurrent(pathname)}
            onClick={handleMobileNavClick}
            title={label}
            style={cssProps({
              transitionDelay: numToMs(
                Number(msToNum(tokens.base.durationS)) + index * 50
              ),
            })}
            data-visible={menuOpen}
          >
            {label}
          </RouterLink>
        ))}
        <NavbarIcons isMobile />
        <ThemeToggle isMobile style={{ 
          position: 'absolute', 
          bottom: '24px', 
          right: '24px',
          top: 'auto',
          left: 'auto',
          transform: 'none',
          zIndex: 100 
        }} />
      </nav>
      
      {!isMobile && <ThemeToggle data-navbar-item />}
    </header>
  );
};

const NavbarIcons = ({ desktop, className, isMobile }: { desktop?: boolean; className?: string; isMobile?: boolean }) => (
  <div className={classes(
          'flex flex-col items-center justify-center relative z-20',
          'nav-icons-mobile',
          className
      )}
      style={isMobile ? {
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        flexDirection: 'row',
        zIndex: 100,
        gap: 'var(--spacing-m)', // Ensure spacing between icons
        display: 'flex', // Ensure visibility
      } : {}}
      >
    {socialLinks.map(({ label, url, icon }) => (
      <a
        key={label}
        data-navbar-item={desktop || undefined}
        className={classes(
            'flex items-center justify-center p-s w-[var(--spacing-2xl)] h-[var(--spacing-2xl)] text-[var(--colorTextLight)] transition-[color] duration-m ease-fast-out-slow-in',
            'hover:text-accent focus:text-accent active:text-accent'
        )}
        aria-label={label}
        href={url}
        target="_blank"
        title={label}
        rel="noopener noreferrer"
      >
        <Icon className="fill-current transition-[fill] duration-m ease-linear" icon={icon} />
      </a>
    ))}
  </div>
);
