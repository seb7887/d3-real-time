import React from 'react';
import * as d3 from 'd3';

class Chart extends React.Component {
  state = {
    marketStatus: [],
    chartProps: {}
  };

  componentDidMount = async () => {
    const res = await fetch(`http://localhost:7777/api/market`);
    const marketStatus = await res.json();
    this.formatDate(marketStatus);
    this.buildChart();
  }

  formatDate = marketStatus => {
    marketStatus.forEach(ms => {
      if (ms.date === 'string') {
        ms.date = this.parseDate(ms.date);
      }
    });
    this.setState({ marketStatus });
  }

  parseDate = d3.timeParse('%d-%m-%Y');

  buildChart() {
    const { marketStatus, chartProps } = this.state;

    // Set the dimensions of the canvas
    const margin = { top: 30, right: 20, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 270 - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
      .domain(d3.extent(marketStatus, d => {
        if (d.date instanceof Date) {
          return d.date.getTime();
        }
      }))
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(marketStatus, d => { return Math.max(d.close, d.open) })])
      .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    const valueline = d3.line()
      .x(d => {
        if (d.date instanceof Date) {
          return xScale(d.date.getTime());
        }
      })
      .y(d => {
        return yScale(d.close);
      });

    const valueline2 = d3.line()
      .x(d => {
        if (d.date instanceof Date) {
          return xScale(d.date.getTime());
        }
      })
      .y(d => {
        return yScale(d.open);
      });

    console.log('line(x)', valueline(marketStatus));

    const svg = d3.select('body')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg.append('path')
      .attr('class', 'line')
      .attr('d', valueline(marketStatus))
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', 2);

    svg.append('path')
      .attr('class', 'line')
      .attr('d', valueline2(marketStatus))
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', 2);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    chartProps.svg = svg;
    chartProps.valueline = valueline;
    chartProps.valueline2 = valueline2;
    chartProps.xAxis = xAxis;
    chartProps.yAxis = yAxis;

    this.setState({ chartProps });
  }
  
  render() {
    return (
      <div>Chart</div>
    )
  }
}

export default Chart;
