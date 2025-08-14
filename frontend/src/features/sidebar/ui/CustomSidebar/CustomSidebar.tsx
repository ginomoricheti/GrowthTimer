import { useRef, useState } from "react";
import styles from "./CustomSidebar.module.css";
import { faBook, faFolder, faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import SidebarMenuItem from "../SidebarMenuItem/SidebarMenuItem";
import { faGithub, faReddit } from '@fortawesome/free-brands-svg-icons';
import { openUrl } from '@tauri-apps/plugin-opener';

const CustomSidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSidebar = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setExpanded(true);
  };

  const hideSidebar = () => {
    hoverTimeoutRef.current = setTimeout(() => setExpanded(false), 200);
  };

  const openLink = async (url: string) => {
    try {
      await openUrl(url);
    } catch (error) {
      console.error("The link could not be opened:", error);
    }
  };

  return (
    <div
      className={styles.sidebarContainer}
      onMouseEnter={showSidebar}
      onMouseLeave={hideSidebar}
      style={{ width: expanded ? "250px" : "50px" }}
    >
      <div className={styles.menu}>
        <SidebarMenuItem
          icon={faFolder}
          label="Projects"
          expanded={expanded}
          subItems={[
            { label: "Create Project" },
            { label: "Delete Projects" },
          ]}
        />
        <SidebarMenuItem
          icon={faBullseye}
          label="Goals"
          expanded={expanded}
          subItems={[
            { label: "Create Goal" },
            { label: "Delete Goals" },
          ]}
        />
      </div>

      <div className={styles.footer} style={{ flexDirection: expanded ? "row" : "column" }}>
        <div onClick={() => openLink("https://github.com/ginomoricheti/GrowthTimer")} className={styles.footerIcon}>
          <FontAwesomeIcon icon={faBook as unknown as IconProp} />
        </div>
        <div onClick={() => openLink("https://github.com/ginomoricheti")} className={styles.footerIcon}>
          <FontAwesomeIcon icon={faGithub as unknown as IconProp} />
        </div>
        <div onClick={() => openLink("https://www.reddit.com/user/Thought_Trick/")} className={styles.footerIcon}>
          <FontAwesomeIcon icon={faReddit as unknown as IconProp} />
        </div>
      </div>
    </div>
  );
};

export default CustomSidebar;
