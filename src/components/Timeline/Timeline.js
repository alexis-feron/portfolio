import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import styles from './Timeline.module.css';
import React, { useRef, useState } from 'react';

export const Timeline = () => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = e => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = e => {
    if (!isDragging) return;
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
    <section className={styles.timeline}>
      <VerticalTimeline className={styles.vertical_timeline}>
        <VerticalTimelineElement
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
              alt=""
            />
          }
          contentArrowStyle={{ borderRight: '15px solid var(--colorTextTitle)' }}
        >
          <h3>Web developer in apprenticeship at Ultrō</h3>
          <div
            className={styles.languages}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div>NextJS</div>
            <div>React</div>
            <div>Swell</div>
            <div>Pipedream</div>
          </div>
          <p>Clermont-Ferrand, France</p>
          <p>September 2023 - Currently</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
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
              alt=""
            />
          }
          contentArrowStyle={{ borderRight: '15px solid var(--colorTextTitle)' }}
        >
          <h3>Web developer internship at Radar Technologies</h3>
          <div
            className={styles.languages}
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
          <p>Cournon d&apos;Auvergne, France</p>
          <p>April 2023 - June 2023</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
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
              alt=""
            />
          }
          contentArrowStyle={{ borderRight: '15px solid var(--colorTextTitle)' }}
        >
          <h3>University Bachelor of Technology in Computer Science</h3>
          <div
            className={styles.languages}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div>Javascript</div>
            <div>PostgreeSQL</div>
            <div>MongoDB</div>
            <div>Docker</div>
            <div>Java</div>
            <div>Kotlin</div>
          </div>
          <p>Clermont-Ferrand, France</p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </section>
  );
};
