'use client';

import { Button } from 'components/ui/Button';
import { Icon } from 'components/ui/Icon/Icon';
import { ButtonHTMLAttributes } from 'react';
import { classes } from 'utils/style';

interface NavToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  menuOpen: boolean;
}

export const NavToggle = ({ menuOpen, ...rest }: NavToggleProps) => {
  return (
    <Button
      iconOnly
      className={classes('fixed top-5 right-5 left-auto z-50', 'nav-mobile-visible')}
      style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 120 }}
      aria-label="Menu"
      aria-expanded={menuOpen}
      {...rest}
    >
      <div className="flex items-center justify-center w-full h-full">
        <Icon
          className={classes(
            'absolute transition-[opacity,fill] duration-m ease-fast-out-slow-in rotate-0 fill-(--colorTextBody) w-xl h-xl text-(--colorTextBody)',
            'motion-safe:delay-100 motion-safe:transition-[opacity,transform,fill]',
            menuOpen
              ? 'opacity-0 motion-safe:delay-[0s] motion-safe:rotate-45'
              : 'opacity-100'
          )}
          data-menu={true}
          data-open={menuOpen}
          icon="menu"
        />
        <Icon
          className={classes(
            'absolute transition-[opacity,fill] duration-m ease-fast-out-slow-in rotate-0 fill-(--colorTextBody) w-xl h-xl',
            'motion-safe:delay-100 motion-safe:transition-[opacity,transform,fill]',
            !menuOpen
              ? 'opacity-0 motion-safe:delay-[0s] motion-safe:-rotate-45'
              : 'opacity-100 motion-safe:delay-100 motion-safe:rotate-0'
          )}
          data-close={true}
          data-open={menuOpen}
          icon="close"
        />
      </div>
    </Button>
  );
};
