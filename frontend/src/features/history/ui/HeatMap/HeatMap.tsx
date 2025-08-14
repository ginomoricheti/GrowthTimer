/* eslint-disable @typescript-eslint/no-explicit-any */
import './HeatMap.css'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { PomodoroRecordGet } from '@/shared/types';
import React from 'react';

interface HeatMapProps {
  data: PomodoroRecordGet[],
}

const HeatMap = ({ data }: HeatMapProps) => {
  console.log(data);

  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredDay, setHoveredDay] = useState<any>(null);

  // State for modal
  const [modal, setModal] = useState<{
    visible: boolean;
    data: PomodoroRecordGet | null;
  }>({ visible: false, data: null });

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showHeatMap = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const hideHeatMap = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsVisible(false), 100);
  };

  // Heatmap Config - Reduced height
  const config = {
    box: 7,  // Reduced from 8 to 7
    spacing: 1,
    year: 2025,
    weekDays: ["S", "M", "T", "W", "T", "F", "S"],
    colors: [
      'rgba(255, 255, 255, 0.03)',
      '#2a2a2a',
      '#1b4332',
      '#2d5a3d',
      '#40916c',
      '#52b788',
      '#74c69d'
    ],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

  // Calculate dimensions dynamically - Reduced total height
  const totalWidth = 12 * 7 * (config.box + config.spacing) + 15;
  const totalHeight = 7 * (config.box + config.spacing) + 40;

  // Function to get color based on minutes
  const getColor = (minutes: number): string => {
    if (minutes === 0) return config.colors[0];
    const index = Math.min(Math.floor(minutes / 70) + 1, config.colors.length - 1);
    return config.colors[index];
  };

  // Function to format date
  const formatDate = (date: Date | string): string => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Function to format time
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} minutes`;
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} and ${mins} minutes`;
  };

  // Generate data for all days of the year
  const generateYearData  = useMemo(() => {
    // 1. Agrupar por fecha y sumar minutos
    const dailySummary = new Map();
    
    data.forEach(d => {
      // Extraer solo la fecha (sin hora)
      const dateStr = d.date instanceof Date 
        ? d.date.toISOString().slice(0, 10) 
        : d.date.split(' ')[0];
      
      if (dailySummary.has(dateStr)) {
        const existing = dailySummary.get(dateStr);
        existing.minutes += d.minutes;
      } else {
        dailySummary.set(dateStr, {
          date: dateStr,
          minutes: d.minutes,
          project: d.project,
          task: d.task
        });
      }
    });
    
    const allDates = [];

    for (let m = 0; m < 12; m++) {
      const start = new Date(config.year, m, 1);
      const end = new Date(config.year, m + 1, 0);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().slice(0, 10);
        const entry = dailySummary.get(dateStr);
        
        const month = d.getMonth();
        const week = Math.floor((d.getDate() + new Date(d.getFullYear(), month, 1).getDay() - 1) / 7);
        const x = 25 + month * 7 * (config.box + config.spacing) + week * (config.box + config.spacing);
        const y = 20 + d.getDay() * (config.box + config.spacing);

        allDates.push({
          date: dateStr,
          minutes: entry?.minutes ?? 0,
          project: entry?.project ?? "-",
          task: entry?.task ?? undefined,
          x,
          y
        });
      }
    }
    
    return allDates;
  }, [data]);

  // Draw square with effects
  const drawSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, isHovered: boolean = false) => {
    const radius = 1;
    
    // Shadow for hover
    if (isHovered) {
      ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    // Square with rounded corners
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, config.box, config.box, radius);
    ctx.fill();

    // Subtle border
    if (isHovered) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  // Draw text with better rendering
  const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, options: any = {}) => {
    const { 
      fontSize = 10, 
      color = '#8b949e', 
      align = 'left', 
      baseline = 'top',
      bold = false 
    } = options;

    ctx.fillStyle = color;
    ctx.font = `${bold ? 'bold ' : ''}${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
  };

  // Draw heatmap on canvas
  const drawHeatMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configure canvas for high resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = totalWidth * dpr;
    canvas.height = totalHeight * dpr;
    canvas.style.width = `${totalWidth}px`;
    canvas.style.height = `${totalHeight}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas with soft background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Antialiasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw weekday labels
    config.weekDays.forEach((day, i) => {
      drawText(ctx, day.substr(0, 3), 15, 20 + i * (config.box + config.spacing) + config.box / 2, {
        fontSize: 7,
        color: '#888888',
        align: 'right',
        baseline: 'middle'
      });
    });

    // Draw month labels
    config.monthNames.forEach((month, i) => {
      drawText(ctx, month, 25 + i * 7 * (config.box + config.spacing) + 22, 8, {
        fontSize: 10,
        color: '#ffffff',
        align: 'center',
        bold: true
      });
    });

    // Draw heatmap squares
    const yearData = generateYearData;
    
    yearData.forEach(day => {
      const isHovered = hoveredDay && hoveredDay.date === day.date;
      drawSquare(ctx, day.x, day.y, getColor(day.minutes), isHovered);
    });

    // Draw improved legend
    const legendData = [0, 70, 140, 210, 280, 420];
    const legendY = totalHeight - 14;
    const legendStartX = (totalWidth / 2) - 30;

    drawText(ctx, "Less", legendStartX - 25, legendY + config.box / 2, {
      fontSize: 8,
      color: '#888888',
      align: 'right',
      baseline: 'middle'
    });

    // Legend squares
    legendData.forEach((value, i) => {
      drawSquare(ctx, legendStartX + i * (config.box + config.spacing), legendY, getColor(value));
    });

    drawText(ctx, "More", legendStartX + legendData.length * (config.box + config.spacing) + 5, legendY + config.box / 2, {
      fontSize: 8,
      color: '#888888',
      align: 'left',
      baseline: 'middle'
    });

  }, [generateYearData, hoveredDay, totalWidth, totalHeight]);

  // Handle click
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const yearData = generateYearData;
    const clickedDay = yearData.find(day => 
      x >= day.x && x <= day.x + config.box &&
      y >= day.y && y <= day.y + config.box
    );

    if (clickedDay) {
      setModal({
        visible: true,
        data: clickedDay
      });
    }
  }, [generateYearData]);

  // Enhanced hover handling
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const yearData = generateYearData;
    const newHoveredDay = yearData.find(day => 
      x >= day.x && x <= day.x + config.box &&
      y >= day.y && y <= day.y + config.box
    );

    if (newHoveredDay !== hoveredDay) {
      setHoveredDay(newHoveredDay);
      
      if (newHoveredDay) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  }, [generateYearData, hoveredDay]);

  const handleMouseLeave = useCallback(() => {
    setHoveredDay(null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default';
    }
    hideHeatMap();
  }, []);

  // Close modal
  const closeModal = () => {
    setModal({ visible: false, data: null });
  };

  // Redraw when hover changes
  useEffect(() => {
    if (isVisible) {
      drawHeatMap();
    }
  }, [isVisible, drawHeatMap, hoveredDay]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        className='hoverHistoryZone'
        onMouseEnter={showHeatMap}
        onMouseLeave={hideHeatMap}
      />
      
      <div
        id="orderHeatMapBox"
        className={isVisible ? 'visible' : ''}
        onMouseEnter={showHeatMap}
        onMouseLeave={handleMouseLeave}
        style={{ 
          background: '#1a1a1a',
          borderRadius: '12px',
          padding: '10px 10px 0 5px',
          border: '1px solid #333333',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)'
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{ 
            display: 'block',
            borderRadius: '8px'
          }}
          />
      </div>

      {/* Informational modal */}
      {modal.visible && modal.data && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: '#2a2a2a',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid #444444',
              boxShadow: '0 20px 80px rgba(0, 0, 0, 0.9)',
              color: '#ffffff',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
              minWidth: '400px',
              maxWidth: '500px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ 
                margin: 0, 
                color: '#ffffff',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                Daily Activity
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#888888',
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#444444';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = '#888888';
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ lineHeight: '1.6' }}>
              <div style={{ 
                background: '#1a1a1a', 
                padding: '16px', 
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #333333'
              }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#53ae5e',
                  fontSize: '16px'
                }}>
                  {formatDate(modal.data.date)}
                </h3>
                <div style={{ 
                  color: '#888888',
                  fontSize: '14px'
                }}>
                  {modal.data.date.toLocaleString()}
                </div>
              </div>

              {modal.data.minutes > 0 ? (
                <div>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    marginBottom: '12px'
                  }}>
                    <span style={{ 
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#53ae5e'
                    }}>
                      {formatTime(modal.data.minutes)}
                    </span>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#ffffff' }}>Project:</strong>
                    <span style={{ marginLeft: '8px', color: '#888888' }}>
                      {modal.data.project}
                    </span>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#ffffff' }}>Task:</strong>
                    <span style={{ marginLeft: '8px', color: '#888888' }}>
                      {modal.data.task?.name}
                    </span>
                  </div>

                  <div style={{ 
                    marginTop: '20px',
                    padding: '12px',
                    background: '#1a1a1a',
                    borderRadius: '6px',
                    border: '1px solid #333333'
                  }}>
                    <div style={{ 
                      fontSize: '12px',
                      color: '#888888',
                      marginBottom: '4px'
                    }}>
                      Daily Productivity
                    </div>
                    <div style={{ 
                      fontSize: '14px',
                      color: modal.data.minutes >= 240 ? '#74c69d' : 
                            modal.data.minutes >= 120 ? '#f1c40f' : '#ff6b6b'
                    }}>
                      {modal.data.minutes >= 240 ? 'Excellent' : 
                        modal.data.minutes >= 120 ? 'Good' : 'Can be improved'}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#888888'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>😴</div>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                    No activity recorded
                  </div>
                  <div style={{ fontSize: '14px', color: '#666666' }}>
                    No productivity data for this day
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ 
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #333333',
              fontSize: '12px',
              color: '#666666',
              textAlign: 'center'
            }}>
              Click outside this window to close
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(HeatMap);