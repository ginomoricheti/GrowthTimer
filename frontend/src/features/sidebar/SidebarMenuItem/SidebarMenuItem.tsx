import { useState } from "react";
import styles from "./SidebarMenuItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SubItem {
  label: string;
  subItems?: SubItem[];
}

interface SidebarMenuItemProps {
  icon: any;
  label?: string;
  subItems?: SubItem[];
  expanded: boolean;
  level?: number; // nivel de indentación
}

const SidebarMenuItem = ({
  icon,
  label,
  subItems,
  expanded,
  level = 0,
}: SidebarMenuItemProps) => {
  const [open, setOpen] = useState(false);

  const toggleSubMenu = () => {
    if (subItems) setOpen(!open);
  };

  return (
    <div className={styles.menuItem}>
      <div
        className={styles.menuButton}
        onClick={toggleSubMenu}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarMenuItem;
