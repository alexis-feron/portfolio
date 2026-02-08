'use client';

import React, { useRef, useState } from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { classes } from 'utils/style';

export const Timeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const mousePos = e.pageX - containerRef.current.offsetLeft;
    const delta = mousePos - startX;
    containerRef.current.scrollLeft = scrollLeft - delta;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section 
        className={classes(
            'flex flex-wrap items-baseline justify-center py-3xl px-l z-20 relative',
            '[--lineHeightBody:1.1]',
            'max-[1680px]:px-[var(--space-3xl)]',
            'max-[696px]:p-[var(--space-l)] max-[400px]:p-[var(--space-l)] max-[820px]:max-h-[420px]:p-[var(--space-l)]'
        )}
    >
      <VerticalTimeline 
        className="before:!bg-text-body before:!w-[2px]" // Using !important to override library styles if needed, specifically the line color
      >
        <VerticalTimelineElement
          visible={true}
          contentStyle={{
            background: 'transparent',
            color: 'var(--colorTextBody)',
            boxShadow: 'none',
            border: '3px solid var(--colorTextTitle)',
          }}
          iconStyle={{
            background: 'rgb(var(--rgbAccent) / 1)',
            color: 'var(--colorTextBody)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none',
          }}
          icon={
            <img
              src="https://iconape.com/wp-content/png_logo_vector/design-230.png"
              style={{ width: '25px', height: '25px' }}
              alt="Icon of a suitcase"
              title="Icon of a suitcase"
            />
          }
          contentArrowStyle={{ borderRight: '15px solid var(--colorTextTitle)' }}
        >
          <h3 className="text-[length:var(--text-body-m)] font-bold leading-[var(--lineHeightTitle)] text-[var(--colorTextTitle)]">Web developer in apprenticeship at Ultrō</h3>
          <div
            className={classes(
                'flex mt-[10px] whitespace-nowrap overflow-x-auto pb-[10px]',
                '[&>div]:inline-block [&>div]:border-[1.5px] [&>div]:border-text-body [&>div]:rounded-[15px] [&>div]:px-[7px] [&>div]:py-[3px] [&>div]:mr-[10px] [&>div]:select-none',
                // Scrollbar styling using arbitrary variants
                '[&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar]:mt-[5px]',
                '[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:rounded-[5px]',
                '[&::-webkit-scrollbar-thumb]:bg-text-light [&::-webkit-scrollbar-thumb]:rounded-[5px]'
            )}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div>NextJS</div>
            <div>React</div>
            <div>Shopify</div>
            <div>Pipedream</div>
          </div>
          <p className="text-[length:var(--text-body-m)]">Clermont-Ferrand, France</p>
          <p className="text-[length:var(--text-body-m)]">September 2023 - Currently</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          visible={true}
          contentStyle={{
            background: 'transparent',
            color: 'var(--colorTextBody)',
            boxShadow: 'none',
            border: '3px solid var(--colorTextTitle)',
          }}
          iconStyle={{
            background: 'rgb(var(--rgbAccent) / 1)',
            color: 'var(--colorTextBody)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none',
          }}
          icon={
            <img
              src="https://icons.veryicon.com/png/o/object/material-design-icons/school-9.png"
              style={{ width: '25px', height: '25px' }}
              alt="icon of a school graduation cap"
              title="icon of a school graduation cap"
            />
          }
          contentArrowStyle={{ borderRight: '15px solid var(--colorTextTitle)' }}
        >
          <h3 className="text-[length:var(--text-body-m)] font-bold leading-[var(--lineHeightTitle)] text-[var(--colorTextTitle)]">Master's degree in Fullstack Development</h3>
          <div
            className={classes(
                'flex mt-[10px] whitespace-nowrap overflow-x-auto pb-[10px]',
                '[&>div]:inline-block [&>div]:border-[1.5px] [&>div]:border-text-body [&>div]:rounded-[15px] [&>div]:px-[7px] [&>div]:py-[3px] [&>div]:mr-[10px] [&>div]:select-none',
                '[&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar]:mt-[5px]',
                '[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:rounded-[5px]',
                '[&::-webkit-scrollbar-thumb]:bg-text-light [&::-webkit-scrollbar-thumb]:rounded-[5px]'
            )}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div>Typescript</div>
            <div>Supabase</div>
            <div>Prisma</div>
            <div>Hono</div>
          </div>
          <p className="text-[length:var(--text-body-m)]">Lyon, France</p>
          <p className="text-[length:var(--text-body-m)]">September 2025 - Currently</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          visible={true}
          contentStyle={{
            background: 'transparent',
            color: 'var(--colorTextBody)',
            boxShadow: 'none',
            border: '3px solid var(--colorTextTitle)',
          }}
          iconStyle={{
            background: 'rgb(var(--rgbAccent) / 1)',
            color: 'var(--colorTextBody)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none',
          }}
          icon={
            <img
              src="https://iconape.com/wp-content/png_logo_vector/design-230.png"
              style={{ width: '25px', height: '25px' }}
              alt="icon of a suitcase"
              title="icon of a suitcase"
            />
          }
          contentArrowStyle={{ borderRight: '15px solid var(--colorTextTitle)' }}
        >
          <h3 className="text-[length:var(--text-body-m)] font-bold leading-[var(--lineHeightTitle)] text-[var(--colorTextTitle)]">Web developer internship at Radar Technologies</h3>
          <div
            className={classes(
                'flex mt-[10px] whitespace-nowrap overflow-x-auto pb-[10px]',
                '[&>div]:inline-block [&>div]:border-[1.5px] [&>div]:border-text-body [&>div]:rounded-[15px] [&>div]:px-[7px] [&>div]:py-[3px] [&>div]:mr-[10px] [&>div]:select-none',
                '[&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar]:mt-[5px]',
                '[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:rounded-[5px]',
                '[&::-webkit-scrollbar-thumb]:bg-text-light [&::-webkit-scrollbar-thumb]:rounded-[5px]'
            )}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div>PHP</div>
            <div>MVC</div>
            <div>Unit tests</div>
          </div>
          <p className="text-[length:var(--text-body-m)]">Cournon d&apos;Auvergne, France</p>
          <p className="text-[length:var(--text-body-m)]">April 2023 - June 2023</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          visible={true}
          contentStyle={{
            background: 'transparent',
            color: 'var(--colorTextBody)',
            boxShadow: 'none',
            border: '3px solid var(--colorTextTitle)',
          }}
          iconStyle={{
            background: 'rgb(var(--rgbAccent) / 1)',
            color: 'var(--colorTextBody)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none',
          }}
          icon={
            <img
              src="https://icons.veryicon.com/png/o/object/material-design-icons/school-9.png"
              style={{ width: '25px', height: '25px' }}
              alt="icon of a school graduation cap"
              title="icon of a school graduation cap"
            />
          }
          contentArrowStyle={{ borderRight: '15px solid var(--colorTextTitle)' }}
        >
          <h3 className="text-[length:var(--text-body-m)] font-bold leading-[var(--lineHeightTitle)] text-[var(--colorTextTitle)]">University Bachelor of Technology in Computer Science</h3>
          <div
            className={classes(
                'flex mt-[10px] whitespace-nowrap overflow-x-auto pb-[10px]',
                '[&>div]:inline-block [&>div]:border-[1.5px] [&>div]:border-text-body [&>div]:rounded-[15px] [&>div]:px-[7px] [&>div]:py-[3px] [&>div]:mr-[10px] [&>div]:select-none',
                '[&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar]:mt-[5px]',
                '[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:rounded-[5px]',
                '[&::-webkit-scrollbar-thumb]:bg-text-light [&::-webkit-scrollbar-thumb]:rounded-[5px]'
            )}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div>Javascript</div>
            <div>PostgreSQL</div>
            <div>MongoDB</div>
            <div>Docker</div>
            <div>Angular</div>
            <div>VueJS</div>
          </div>
          <p className="text-[length:var(--text-body-m)]">Clermont-Ferrand, France</p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </section>
  );
};
