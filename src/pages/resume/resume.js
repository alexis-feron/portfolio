import styles from './resume.module.css';
import cv from 'assets/cv.png';
import Image from 'next/image';
import { Button } from 'components/Button';
import dynamic from 'next/dynamic';

export function Resume() {
  const downloadCV = () => {
    console.log(cv);
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
    import('layouts/Home/Background').then(mod => mod.Background)
  );

  return (
    <section className={styles.page}>
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
