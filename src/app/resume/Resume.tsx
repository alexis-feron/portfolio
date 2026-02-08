'use client';

import cv from 'assets/cv.png';
import { Button } from 'components/ui/Button';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect } from 'react';
import { classes } from 'utils/style';

const Background = dynamic(() =>
  import('components/sections/Background').then(mod => mod.Background)
);

export function Resume() {
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

  useEffect(() => {
    // We target the section by id or logic. Since we removed module class, we use a consistent ID or class.
    const pageSection = document.getElementById('resume-page');

    if (!pageSection) return;

    const handleScroll = (e: Event) => {
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
    <section 
        id="resume-page"
        className={classes(
            'grid grid-cols-[3fr_2fr] h-[100%] pl-[140px]',
            'max-[1040px]:pt-[80px] max-[1040px]:pb-[80px] max-[1040px]:pl-[80px] max-[1040px]:grid-cols-1 max-[1040px]:min-h-[100vh] max-[1040px]:h-auto',
            'max-[696px]:pl-0'
        )}
    >
      <Background />
      <div className={classes(
          'w-full m-auto mb-0 mt-[80px] sticky top-[80px] rounded-[0_20px_20px_0]',
          'max-[1680px]:m-auto max-[1680px]:inline-block'
          // Note: .cv original styles: background-size cover etc were unused as it's just a container.
      )}>
        <div className={classes(
            'h-[74.96vh] sticky transition-all duration-500 ease-out perspective-[1000px] w-[53vh] m-auto hover:scale-110 hover:duration-300 hover:ease-linear',
            'max-[1040px]:h-[52.32vh] max-[1040px]:w-[45vh] max-[1040px]:-mt-[30px]',
            'max-[696px]:h-[49.49vh] max-[696px]:w-[37vh]'
        )}>
          {/* Tilt Overlays using peer */}
          <span className="peer/tl absolute w-1/3 h-1/3 left-0 top-0 z-10"></span>
          <span className="peer/tc absolute w-1/3 h-1/3 left-1/3 top-0 z-10"></span>
          <span className="peer/tr absolute w-1/3 h-1/3 left-2/3 top-0 z-10"></span>
          <span className="peer/ml absolute w-1/3 h-1/3 left-0 top-1/3 z-10"></span>
          <span className="peer/mc absolute w-1/3 h-1/3 left-1/3 top-1/3 z-10"></span>
          <span className="peer/mr absolute w-1/3 h-1/3 left-2/3 top-1/3 z-10"></span>
          <span className="peer/bl absolute w-1/3 h-1/3 left-0 top-2/3 z-10"></span>
          <span className="peer/bc absolute w-1/3 h-1/3 left-1/3 top-2/3 z-10"></span>
          <span className="peer/br absolute w-1/3 h-1/3 left-2/3 top-2/3 z-10"></span>
          
          <div className={classes(
              'm-0 relative flex items-center justify-around transition-all duration-[600ms] ease-out perspective-[1000px] preserve-3d',
              
              // Transforms based on peer hover
              'peer-hover/tl:rotate-x-[-20deg] peer-hover/tl:rotate-y-[20deg]',
              'peer-hover/tc:rotate-x-[-20deg] peer-hover/tc:rotate-y-0',
              'peer-hover/tr:rotate-x-[-20deg] peer-hover/tr:rotate-y-[-20deg]',
              
              'peer-hover/ml:rotate-x-0 peer-hover/ml:rotate-y-[20deg]',
              'peer-hover/mc:rotate-x-0 peer-hover/mc:rotate-y-0',
              'peer-hover/mr:rotate-x-0 peer-hover/mr:rotate-y-[-20deg]',
              
              'peer-hover/bl:rotate-x-[20deg] peer-hover/bl:rotate-y-[20deg]',
              'peer-hover/bc:rotate-x-[20deg] peer-hover/bc:rotate-y-0',
              'peer-hover/br:rotate-x-[20deg] peer-hover/br:rotate-y-[-20deg]'
          )}>
             {/* 
                Original CSS: .tilt_box strong { transform: translateZ(40px) }. 
                But Resume.tsx DOES NOT HAVE strong elements. It has Image.
                Maybe the original template had text?
                I see only <Image src={cv} ... /> in Step 667.
                So the `strong` selector was unused.
             */}
            <Image 
                className="w-full h-full object-cover object-center" 
                src={cv} 
                alt="Alexis Feron Resume" 
            />
          </div>
        </div>
      </div>
      <div className={classes(
          'flex justify-start items-center mt-[20px] mb-[20px] ml-[15px]',
          'max-[1040px]:w-auto max-[1040px]:mt-0 max-[1040px]:mb-0 max-[1040px]:relative max-[1040px]:justify-around max-[1040px]:ml-0'
      )}>
        <Button 
            className={classes(
                'max-[1040px]:fixed max-[1040px]:bottom-0 max-[1040px]:mb-[25px]'
            )} 
            onClick={downloadCV}
        >
          Download my resume
        </Button>
      </div>
    </section>
  );
}
