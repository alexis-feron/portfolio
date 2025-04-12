'use client';

import { Button } from '@/components/Button';
import { Meta } from '@/components/Meta';
import cv from 'assets/cv.png';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect } from 'react';
import styles from './resume.module.css';

export default function Resume() {
  const downloadCV = () => {
    const cvUrl = cv.src;
    const link = document.createElement('a');
    link.href = cvUrl;
    link.target = '_blank';
    link.download = 'Resume-Alexis-Feron.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const Background = dynamic(() =>
    import('@/features/Home/Background').then(mod => mod.Background)
  );

  useEffect(() => {
    const pageSection = document.querySelector(`.${styles.page}`);

    const handleScroll = e => {
      e.preventDefault();
    };

    pageSection.addEventListener('touchmove', handleScroll, { passive: false });
    pageSection.addEventListener('scroll', handleScroll);

    return () => {
      pageSection.removeEventListener('touchmove', handleScroll);
      pageSection.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className={styles.page}>
      <Meta
        title="Alexis Feron resume"
        description="Alexis Feron, Web Developer Full-Stack resume"
      />
      <Background />
      <div className={styles.cv}>
        <div className={styles.tilt_box_wrap}>
          <span className={styles.t_over}></span>
          <span className={styles.t_over}></span>
          <span className={styles.t_over}></span>
          <span className={styles.t_over}></span>
          <span className={styles.t_over}></span>
          <span className={styles.t_over}></span>
          <span className={styles.t_over}></span>
          <span className={styles.t_over}></span>
          <span className={styles.t_over}></span>
          <div className={styles.tilt_box}>
            <Image className={styles.img} src={cv} alt="resume" />
          </div>
        </div>
      </div>
      <div className={styles.download}>
        <Button className={styles.button} onClick={downloadCV}>
          Download my resume
        </Button>
      </div>
    </section>
  );
}
