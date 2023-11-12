import { Footer } from 'components/Footer';
import { Contact } from 'components/Contact';
import { Meta } from 'components/Meta';
import { Intro } from 'layouts/Home/Intro';
import { Profile } from 'layouts/Home/Profile';
import { ProjectSummary } from 'layouts/Home/ProjectSummary';
import { useEffect, useRef, useState } from 'react';
import styles from './Home.module.css';
import bigbraingames from 'assets/bigbraingames.png';
import gamecenter from 'assets/gamecenter.png';
import { Timeline } from 'components/Timeline';

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const details = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const contact = useRef();

  useEffect(() => {
    const sections = [intro, details, projectOne, projectTwo, contact];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <Meta title="Web Developer" description="" />
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Timeline />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Big Brain Games"
        description="AI mini-games website created with NextJS"
        buttonText="View website"
        buttonLink="https://big-brain-games.vercel.app"
        model={{
          type: 'laptop',
          alt: 'Big Brain Games preview',
          textures: [
            {
              srcSet: [bigbraingames, bigbraingames],
              placeholder: bigbraingames,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="Game center"
        description="Esport website created with Vue"
        buttonText="View website"
        buttonLink="https://alexis-feron.github.io/game-center/"
        model={{
          type: 'laptop',
          alt: 'Game center preview',
          textures: [
            {
              srcSet: [gamecenter, gamecenter],
              placeholder: gamecenter,
            },
          ],
        }}
      />
      <Contact
        id="contact"
        sectionRef={contact}
        visible={visibleSections.includes(contact.current)}
      />
      <Footer />
    </div>
  );
};
