'use client';

import bigbraingames from 'assets/bigbraingames.png';
import gamecenter from 'assets/gamecenter.png';
import splits from 'assets/splits.png';
import { Footer } from 'components/layout/Footer';
import { Contact } from 'components/sections/Contact';

import { Intro } from 'components/sections/Intro';
import { Profile } from 'components/sections/Profile';
import { ProjectSummary } from 'components/sections/ProjectSummary';
import { Timeline } from 'components/sections/Timeline';
import { Suspense, useEffect, useRef, useState } from 'react';
import { classes } from 'utils/style';

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState<Element[]>([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef<HTMLDivElement>(null);
  const details = useRef<HTMLDivElement>(null);
  const projectOne = useRef<HTMLDivElement>(null);
  const projectTwo = useRef<HTMLDivElement>(null);
  const projectThree = useRef<HTMLDivElement>(null);
  const contact = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = [intro, details, projectOne, projectTwo, projectThree, contact];

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

    const handleScroll = () => {
      setScrollIndicatorHidden(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    sections.forEach(section => {
      if (section.current) {
        sectionObserver.observe(section.current);
      }
    });

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visibleSections]);

  return (
    <div className="overflow-x-hidden w-full">
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current as Element)}
        id="details"
      />
      <Timeline />
      <Suspense fallback={<div className="flex items-center justify-center p-xl font-medium">Loading...</div>}>
        <ProjectSummary
          id="project-1"
          sectionRef={projectOne}
          visible={visibleSections.includes(projectOne.current as Element)}
          index={1}
          title="Big Brain Games"
          description="Play Blackjack and Nim against the AI and find out your ranking. Made with NextJS"
          buttonText="View website"
          buttonLink="https://big-brain-games.alexis-feron.com"
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
      </Suspense>
      <Suspense fallback={<div className="flex items-center justify-center p-xl font-medium">Loading...</div>}>
        <ProjectSummary
          id="project-2"
          alternate
          sectionRef={projectTwo}
          visible={visibleSections.includes(projectTwo.current as Element)}
          index={2}
          title="Game center"
          description="An area dedicated to esports news and results. Made with VueJS"
          buttonText="View website"
          buttonLink="https://game-center.alexis-feron.com/"
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
      </Suspense>
      <Suspense fallback={<div className="flex items-center justify-center p-xl font-medium">Loading...</div>}>
        <ProjectSummary
          id="project-3"
          sectionRef={projectThree}
          visible={visibleSections.includes(projectThree.current as Element)}
          index={3}
          title="Splits"
          description="Your one-stop destination for F1 standings, game, and upcoming events. Made with NextJS"
          buttonText="View website"
          buttonLink="https://splits.alexis-feron.com"
          model={{
            type: 'laptop',
            alt: 'Splits preview',
            textures: [
              {
                srcSet: [splits, splits],
                placeholder: splits,
              },
            ],
          }}
        />
      </Suspense>

      <Contact
        id="contact"
        sectionRef={contact}
        visible={visibleSections.includes(contact.current as Element)}
        className="" // Contact component handles its own styles, logic removed unused class
      />
      <Footer />
    </div>
  );
};
