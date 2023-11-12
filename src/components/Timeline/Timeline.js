import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import styles from './Timeline.module.css';

export const Timeline = () => {
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
            />
          }
          contentArrowStyle={{ borderRight: '15px solid var(--colorTextTitle)' }}
        >
          <h3>Web developer in apprenticeship at Ultro</h3>
          <p>Clermont-Ferrand, France</p>
          <p>September 2023 - September 2025</p>
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
            />
          }
          contentArrowStyle={{ borderRight: '15px solid var(--colorTextTitle)' }}
        >
          <h3>Web developer internship at Radar Technologies</h3>
          <p>Cournon d'Auvergne, France</p>
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
            />
          }
          contentArrowStyle={{ borderRight: '15px solid var(--colorTextTitle)' }}
        >
          <h3>University Bachelor of Technology in Computer Science</h3>
          <p>Clermont-Ferrand, France</p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </section>
  );
};
