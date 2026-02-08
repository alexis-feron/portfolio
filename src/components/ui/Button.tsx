'use client';

import { Icon, IconType } from 'components/ui/Icon/Icon';
import { Loader } from 'components/ui/Loader';
import { Transition } from 'components/ui/Transition';
import {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    CSSProperties,
    forwardRef,
    ReactNode
} from 'react';
import { classes } from 'utils/style';

interface BaseProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  secondary?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: IconType;
  iconEnd?: IconType;
  iconHoverShift?: boolean;
  iconOnly?: boolean;
  [key: string]: any;
}

type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; as?: 'a' };
type ButtonNativeProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; as?: 'button' };

type ButtonProps = AnchorProps | ButtonNativeProps;

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  ({ className, style, loading, loadingText = 'loading', secondary, icon, iconEnd, iconHoverShift, iconOnly, children, ...rest }, ref) => {
    
    const isAnchor = 'href' in rest && rest.href !== undefined;
    const isSecondary = secondary;
    const isIconOnly = iconOnly;

    // Common classes
    const baseClasses = `
        h-[var(--buttonSize)] 
        px-[var(--buttonPadding)] 
        cursor-pointer 
        transition-[opacity,color,background] 
        duration-s 
        ease-fast-out-slow-in 
        inline-flex 
        items-center 
        text-[var(--buttonTextColor)] 
        relative 
        isolate
        [--buttonSize:calc((56/16)*1rem)]
        [--buttonFontSize:calc((18/16)*1rem)]
        [--buttonPadding:var(--space-l)]
        [--buttonTextColor:var(--color-background)]
        [--buttonTextOpacity:1]
        active:duration-[calc(var(--animate-duration-xs)/2)]
        
        after:content-['']
        after:transition-[opacity,color,background]
        after:duration-m
        after:ease-fast-out-slow-in
        after:bg-primary
        after:absolute
        after:inset-0
        after:-z-10
        after:[clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)]

        hover:scale-105
        active:scale-100
        
        motion-reduce:transition-[transform,opacity,color,background]
    `;

    const secondaryClasses = `
       [--buttonSpace:var(--space-l)]
       [--buttonTextColor:var(--color-primary)]
       bg-none
       pl-[var(--buttonSpace)]
       pr-[var(--buttonSpace)]
       relative
       left-[calc(var(--buttonSpace)*-1)]
       h-[calc((32/16)*1rem)]

       after:content-['']
       after:h-[calc((32/16)*1rem)]
       after:absolute
       after:inset-0
       after:bg-[rgb(var(--rgbPrimary)/0.2)]
       after:scale-x-0
       after:origin-right
       after:[clip-path:none]
       
       hover:transform-none
       hover:bg-transparent
       
       hover:after:scale-x-100
       hover:after:origin-left

       motion-reduce:after:transition-[transform]
       motion-reduce:after:duration-m
       motion-reduce:after:ease-fast-out-slow-in
    `;
    
    const iconOnlyClasses = `
        [--buttonPadding:0]
        [--buttonTextColor:var(--color-text-body)]
        w-[var(--buttonSize)]
        items-center
        justify-center
        p-0
        
        hover:transform-none

        after:!bg-transparent
        hover:after:bg-[rgb(var(--rgbText)/0.1)]
    `;

    const loadingClasses = `[--buttonTextOpacity:0]`;
    const disabledClasses = `pointer-events-none opacity-40`;

    const computedClasses = classes(
        baseClasses,
        isSecondary && secondaryClasses,
        isIconOnly && iconOnlyClasses,
        loading && loadingClasses,
        rest.disabled && disabledClasses,
        className
    );

    const content = (
         <ButtonContent
            loading={loading}
            loadingText={loadingText}
            icon={icon}
            iconEnd={iconEnd}
            iconHoverShift={iconHoverShift}
            iconOnly={iconOnly}
        >
            {children}
        </ButtonContent>
    );

    if (isAnchor) {
        const { href, ...anchorRest } = rest as AnchorProps;
        const isExternal = href.includes('://');
        
        return (
            <a
                className={computedClasses}
                href={href}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                target={isExternal ? '_blank' : undefined}
                ref={ref as any}
                style={style}
                {...anchorRest}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            className={computedClasses}
            ref={ref as any}
            style={style}
            {...(rest as ButtonNativeProps)}
        >
             {content}
        </button>
    );
  }
);

Button.displayName = 'Button';

interface ButtonContentProps {
    loading?: boolean;
    loadingText?: string;
    icon?: IconType;
    iconEnd?: IconType;
    iconHoverShift?: boolean;
    iconOnly?: boolean;
    children?: ReactNode;
}

const ButtonContent = ({ loading, loadingText, icon, iconEnd, iconHoverShift, iconOnly, children }: ButtonContentProps) => {
    return (
        <>
            {!!icon && (
                 <Icon
                    className={classes(
                        "transition-[opacity,fill] duration-s ease-fast-out-slow-in motion-reduce:transition-[transform,opacity,fill]",
                        !iconOnly && "mr-s",
                        iconHoverShift && "group-hover:translate-x-xs", // Assessing how to handle group hover from parent in simple way or just custom classes
                         loading && "opacity-0"
                    )}
                    data-start={!iconOnly}
                    data-shift={iconHoverShift}
                    icon={icon}
                />
            )}
            {!!children && (
                 <div className="text-[length:var(--buttonFontSize)] font-medium opacity-[var(--buttonTextOpacity)] relative leading-none flex-auto flex items-center justify-center transition-opacity duration-m ease-fast-out-slow-in">
                    {children}
                </div>
            )}
             {!!iconEnd && (
                <Icon
                   className={classes(
                        "transition-[opacity,fill] duration-s ease-fast-out-slow-in motion-reduce:transition-[transform,opacity,fill]",
                        !iconOnly && "ml-s",
                         iconHoverShift && "group-hover:translate-x-xs",
                         loading && "opacity-0"
                    )}
                    data-end={!iconOnly}
                    data-shift={iconHoverShift}
                    icon={iconEnd}
                />
            )}
            <Transition unmount in={loading}>
                {(visible) => (
                    <Loader
                        className={classes(
                             "absolute left-1/2 -translate-x-1/2 text-background opacity-0 transition-opacity duration-m ease-linear delay-[0s]",
                             visible && "opacity-100"
                        )}
                        size={32}
                        text={loadingText}
                        data-visible={visible}
                    />
                )}
            </Transition>
        </>
    );
};
