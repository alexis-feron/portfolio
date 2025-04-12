import { classes } from '@/lib/style';
import styles from './Icon.module.css';
import ArrowRight from './svg/arrow-right.svg';
import ChevronRight from './svg/chevron-right.svg';
import Close from './svg/close.svg';
import Error from './svg/error.svg';
import Github from './svg/github.svg';
import Instagram from './svg/instagram.svg';
import Menu from './svg/menu.svg';
import Pause from './svg/pause.svg';
import Play from './svg/play.svg';
import Send from './svg/send.svg';
import X from './svg/x.svg';

export const icons = {
  arrowRight: ArrowRight,
  chevronRight: ChevronRight,
  close: Close,
  error: Error,
  instagram: Instagram,
  github: Github,
  menu: Menu,
  pause: Pause,
  play: Play,
  send: Send,
  x: X,
};

export const Icon = ({ icon, className, ...rest }) => {
  const IconComponent = icons[icon];

  return (
    <IconComponent aria-hidden className={classes(styles.icon, className)} {...rest} />
  );
};
