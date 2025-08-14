/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import styles from "./SidebarMenuItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateGoalPopup from "../CreateGoalPopup/CreateGoalPopup";
import CreateProjectPopup from "../CreateProjectPopup/CreateProjectPopup";


interface SubItem {
  label: string;
  subItems?: SubItem[];
}

interface SidebarMenuItemProps {
  icon: any;
  label?: string;
  subItems?: SubItem[];
  expanded: boolean;
  level?: number;
  projects?: any[];
  categories?: any[];
}

type ActivePopup = 'goal' | 'project' | null;

const SidebarMenuItem = ({
  icon,
  label,
  subItems,
  expanded,
  level = 0,
  projects = [],
}: SidebarMenuItemProps) => {
  const [open, setOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<ActivePopup>(null);

  const toggleSubMenu = () => {
    if (subItems) setOpen(!open);
  };

  const handleItemClick = (itemLabel: string) => {
    if (itemLabel === "Create Goal") {
      setActivePopup('goal');
    } else if (itemLabel === "Create Project") {
      setActivePopup('project');
    } else {
      if (subItems) {
        toggleSubMenu();
      }
    }
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  return (
    <>
      <div className={styles.menuItem}>
        <div
          className={styles.menuButton}
          onClick={() => handleItemClick(label || '')}
          style={{ paddingLeft: 10 + level * 15 }}
        >
          <FontAwesomeIcon icon={icon} />
          {expanded && <span className={styles.menuLabel}>{label}</span>}
        </div>
        {subItems && expanded && open && (
          <div className={styles.subMenu}>
            {subItems.map((item) => (
              <SidebarMenuItem
                key={item.label}
                icon={icon}
                label={item.label}
                subItems={item.subItems}
                expanded={expanded}
                level={level + 1}
                projects={projects}
              />
            ))}
          </div>
        )}
      </div>

      {/* Popup for create a Goal */}
      <CreateGoalPopup
        isOpen={activePopup === 'goal'}
        onClose={closePopup}
      />

      {/* Popup for create a  Project */}
      <CreateProjectPopup
        isOpen={activePopup === 'project'}
        onClose={closePopup}
      />
    </>
  );
};

export default SidebarMenuItem;