import React, { useState } from 'react';
import styles from './SettingsPopup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workTime: number, breakTime: number) => void;
  currentWorkTime: number;
  currentBreakTime: number;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  currentWorkTime,
  currentBreakTime
}) => {
  const [workTime, setWorkTime] = useState(currentWorkTime);
  const [breakTime, setBreakTime] = useState(currentBreakTime);

  const handleSave = () => {
    if (workTime > 0 && breakTime > 0) {
      onSave(workTime, breakTime);
      onClose();
    }
  };

  const handleCancel = () => {
    setWorkTime(currentWorkTime);
    setBreakTime(currentBreakTime);
    onClose();
  };

  const presetTimes = [
    { work: 25, break: 5, name: "Classic Pomodoro" },
    { work: 50, break: 10, name: "Long session" },
    { work: 15, break: 5, name: "Short session" },
    { work: 45, break: 15, name: "Deep work" },
  ];

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2>Timer settings</h2>
          <button className={styles.closeButton} onClick={handleCancel}>
            <FontAwesomeIcon icon={faTimes as unknown as IconProp} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Manual Configuration</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="workTime">Work time (minutes):</label>
              <input
                type="number"
                id="workTime"
                min="1"
                max="120"
                value={workTime}
                onChange={(e) => setWorkTime(Number(e.target.value))}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="breakTime">Break time (minutes):</label>
              <input
                type="number"
                id="breakTime"
                min="1"
                max="60"
                value={breakTime}
                onChange={(e) => setBreakTime(Number(e.target.value))}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3>Predefined Settings</h3>
            <div className={styles.presets}>
              {presetTimes.map((preset, index) => (
                <button
                  key={index}
                  className={`${styles.presetButton} ${
                    workTime === preset.work && breakTime === preset.break 
                      ? styles.activePreset 
                      : ''
                  }`}
                  onClick={() => {
                    setWorkTime(preset.work);
                    setBreakTime(preset.break);
                  }}
                >
                  <div className={styles.presetName}>{preset.name}</div>
                  <div className={styles.presetTime}>
                    {preset.work}min / {preset.break}min
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button 
            className={styles.saveButton} 
            onClick={handleSave}
            disabled={workTime <= 0 || breakTime <= 0}
          >
            <FontAwesomeIcon icon={faCheck as unknown as IconProp} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;