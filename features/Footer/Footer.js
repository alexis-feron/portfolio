import { Text } from '@/components/Text';
import { classes } from '@/lib/style';
import styles from './Footer.module.css';

export const Footer = ({ className }) => (
  <footer className={classes(styles.footer, className)}>
    <Text size="s" align="center">
      <span
        className={styles.date}
      >{`© ${new Date().getFullYear()} Alexis Feron.`}</span>
    </Text>
  </footer>
);
