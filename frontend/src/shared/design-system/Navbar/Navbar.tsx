import { useState } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);

  let hoverTimeout: ReturnType<typeof setTimeout>;

  const showNavbar = () => {
    clearTimeout(hoverTimeout);
    setIsVisible(true);
  };

  const hideNavbar = () => {
    hoverTimeout = setTimeout(() => setIsVisible(false), 100);
  };

  return (
    <>
      <div
        className={styles.hoverZone}
        onMouseEnter={showNavbar}
        onMouseLeave={hideNavbar}
      ></div>

      <div
        className={`${styles.navbarContainer} ${isVisible ? styles.show : ''}`}
        onMouseEnter={showNavbar}
        onMouseLeave={hideNavbar}
      >

      <Link to='/' className={styles.navItem} >Pomodoro</Link>
      <Link to='/projects' className={styles.navItem} >Projects</Link>
      <Link to='/history' className={styles.navItem} >History</Link>

      </div>
    </>
  );
};

export default Navbar;
