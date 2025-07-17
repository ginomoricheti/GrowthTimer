import './HeatMap.css'
import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { PomodoroRecord } from '@/shared/types';

const HeatMap = () => {
  const [isVisible, setIsVisible] = useState(false);

  let hoverTimeout: ReturnType<typeof setTimeout>;

  const showHeatMap = () => {
    clearTimeout(hoverTimeout);
    setIsVisible(true);
  };

  const hideHeatMap = () => {
    hoverTimeout = setTimeout(() => setIsVisible(false), 100);
  };

  useEffect(() => {
    drawHeatMap();
  }, []);

  const drawHeatMap = () => {
    const dataset: PomodoroRecord[] = [
      { date: "2025-01-15", minutes: 100, project: "Inglés", task: "Listening" },
      { date: "2025-02-16", minutes: 400, project: "Inglés", task: "Listening" },
      { date: "2025-03-17", minutes: 300, project: "Inglés", task: "Listening" },
      { date: "2025-04-14", minutes: 350, project: "Inglés", task: "Listening" },
      { date: "2025-05-13", minutes: 270, project: "Inglés", task: "Listening" },
      { date: "2025-06-13", minutes: 270, project: "Inglés", task: "Listening" },
      { date: "2025-07-13", minutes: 270, project: "Inglés", task: "Listening" },
      { date: "2025-08-15", minutes: 270, project: "Inglés", task: "Listening" },
      { date: "2025-09-17", minutes: 270, project: "Inglés", task: "Listening" },
      { date: "2025-10-03", minutes: 270, project: "Inglés", task: "Listening" },
      { date: "2025-11-01", minutes: 270, project: "Inglés", task: "Listening" },
      { date: "2025-12-01", minutes: 270, project: "Inglés", task: "Listening" },
      { date: "2025-01-30", minutes: 270, project: "Inglés", task: "Listening" },
    ];

    d3.select('#orderHeatMap').selectAll('*').remove();

    const box = 8;
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const year = 2025;

    const colorScale = d3.scaleQuantize<string>()
      .domain([0, 420])
      .range([
        '#dfe1e4',
        '#a8d5a2',
        '#7cc47b',
        '#4fa851',
        '#268f2a',
        '#145d14'
      ]);

    // Index full records by date
    const dataMap = new Map(dataset.map(d => [d.date, d]));

    const svgWidth = 12 * 7 * box + 25;
    const svgHeight = 7 * box + 45;

    const svg = d3.select('#orderHeatMap')
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const g = svg.append('g')
      .attr('transform', `translate(25, 20)`);

    // Weekday labels on the left (once)
    g.selectAll('text.day')
      .data(weekDays)
      .enter()
      .append('text')
      .attr('class', 'day')
      .text(d => d[0])
      .attr('x', -10)
      .attr('y', (_, i) => i * box + box / 1.5)
      .attr('text-anchor', 'end')
      .style('font-size', '6px')
      .style('fill', '#aaa');

    // Draw each day of the year
    const allDates: (PomodoroRecord & { date: string })[] = [];

    for (let m = 0; m < 12; m++) {
      const start = new Date(year, m, 1);
      const end = new Date(year, m + 1, 0);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().slice(0, 10);
        const entry = dataMap.get(dateStr);
        allDates.push({
          date: dateStr,
          minutes: entry?.minutes ?? 0,
          project: entry?.project ?? "-",
          task: entry?.task ?? "-"
        });
      }
    }

    // Grid
    g.selectAll('rect')
      .data(allDates)
      .enter()
      .append('rect')
      .attr('width', box)
      .attr('height', box)
      .attr('x', d => {
        const date = new Date(d.date);
        const month = date.getMonth();
        const week = Math.floor((date.getDate() + new Date(date.getFullYear(), month, 1).getDay() - 1) / 7);
        return month * 7 * box + week * box;
      })
      .attr('y', d => new Date(d.date).getDay() * box)
      .attr('fill', d => d.minutes === 0 ? '#2f2f2f' : colorScale(d.minutes))
      .append('title')
      .text(d =>
        `${d.date}\nProject: ${d.project}\nTask: ${d.task}\nTime: ${d.minutes} min`
      );

    // Month labels
    const monthNames = d3.range(12).map(m => d3.timeFormat('%b')(new Date(year, m, 1)));

    g.selectAll('text.month-label')
      .data(monthNames)
      .enter()
      .append('text')
      .attr('x', (_, i) => i * 7 * box + 15)
      .attr('y', -5)
      .attr('text-anchor', 'start')
      .text(d => d)
      .style('font-size', '8px')
      .style('fill', '#fff');

    // Legend
    const legendData = [0, 70, 140, 210, 280, 420];
    const legendLabels = ["0m", "70m", "140m", "210m", "280m", "420m"];
    const legendSpacing = box * 6;

    const legend = svg.append('g')
      .attr('transform', `translate(${(svgWidth - legendSpacing * legendData.length) / 2}, ${svgHeight - 15})`);

    legend.selectAll('rect')
      .data(legendData)
      .enter()
      .append('rect')
      .attr('width', box)
      .attr('height', box)
      .attr('x', (_, i) => i * legendSpacing)
      .attr('fill', d => colorScale(d));

    legend.selectAll('text')
      .data(legendLabels)
      .enter()
      .append('text')
      .attr('x', (_, i) => i * legendSpacing + box + 2)
      .attr('y', box / 2)
      .attr('dominant-baseline', 'middle')
      .text(d => d)
      .style('font-size', '8px')
      .style('fill', '#fff');
  }

  return (
    <>
      <div
        className='hoverHistoryZone'
        onMouseEnter={showHeatMap}
        onMouseLeave={hideHeatMap}
      ></div>
      <div
        id="orderHeatMap"
        className={isVisible ? 'visible' : ''}
        onMouseEnter={showHeatMap}
        onMouseLeave={hideHeatMap}
      />
    </>
  );
};

export default HeatMap;
