import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { YahooHttpService } from '../yahoo-http.service';
import { stockDataApple } from '../localData';
import * as d3 from 'd3'
import { axisBottom, svg } from 'd3'

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
    private subscription: any;
    private rawData: any;
    private svg: any;
    private margin: any = { top: 20, right: 0, bottom: 50, left: 0 };
    private width: number = 700 - this.margin.left - this.margin.right;
    private height: number = 300 - this.margin.top - this.margin.bottom;
    private data;
    private ys: number[];
    symbol: string;
    input: number = 1;

    constructor(private server: YahooHttpService) { }

    ngOnInit(): void {
        this.rawData = stockDataApple;
        console.log("Data available:");
        console.log("-------------");
        console.log(this.rawData);
        console.log("-------------");


        this.symbol = Object.keys(this.rawData)[0]
        this.data = this.formatData(this.rawData.AAPL)
        // @ts-ignore
        this.ys = Array.from(this.data).map(d => d.y)
        this.createSvg()
        this.drawLineChart(this.data)
    }

    updateStock(newStock) {
        this.rawData = newStock;
        // this.data = this.formatData(this.rawData.AAPL)
        // this.updateData()
        this.symbol = Object.keys(this.rawData)[0]
        this.data = this.formatData(this.rawData[this.symbol])
        // @ts-ignore
        this.ys = Array.from(this.data).map(d => d.y)
        this.createSvg()
        this.drawLineChart(this.data)
    }

    updateData() {
        let ysNew = this.movingAverage(this.ys, this.input)
        let smoothData = Array.from(this.data)
        for (let i = 0; i < smoothData.length; i++) {
            // @ts-ignore
            smoothData[i].y = ysNew[i]
        }
        this.updateChart(smoothData)
    }

    private movingAverage(values: number[], k: number): number[] {
        let result: number[] = [];
        for (let i = 0; i < values.length; i++) {
            let sum = 0;
            let n_entries = 0;
            let end = k % 2 == 0 ? i + Math.floor(k / 2) - 1 : i + Math.floor(k / 2)
            for (let j = i - Math.floor(k / 2); j <= end; j++) {
                if (j >= 0 && j < values.length) {
                    sum += values[j]
                    n_entries += 1
                }
            }
            result.push(Number((sum / n_entries).toFixed(2)))
        }
        return result
    }

    private formatData(data: any) {
        let formattedData = []
        let dateFormat = d3.timeParse('%s')
        for (let i = 0; i < data.timestamp.length; i++) {
            let datum = { x: dateFormat(data.timestamp[i]), y: data.close[i] }
            formattedData.push(datum)
        }
        return formattedData
    }

    private createSvg(): void {
        if (this.svg) {
            d3.select('svg').remove()
        }
        this.svg = d3.select('figure#chart')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    }

    private drawLineChart(data: any[]): void {
        // Update line, area, and markers
        let { xAxis, yAxis } = this.updateChart(data);

        // Add x- and y-axis and keep them constant, i.e. don't update when data changes
        this.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${this.height})`)
            .call(xAxis)
        let ax = this.svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', `translate(${this.width}, 0)`)
            .call(yAxis)
        ax.selectAll('path')
            .style('stroke', 'none')
        this.svg.selectAll('text')
            .attr('font-size', '10px')
    }

    private updateChart(data: any[]) {
        let n = data.length;

        // Scales
        let xTimeScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.x.getTime()))
            .range([0, this.width]);
        // .nice()
        let xScale = d3.scaleLinear()
            .domain([0, n - 1])
            .range([0, this.width]);
        let yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.y))
            .range([this.height, 0]);

        // Define axes, line, and area under curve
        let xAxis = d3.axisBottom(xTimeScale)
            .tickSizeInner(9)
            .tickSizeOuter(0)
            .tickPadding(5)
            .ticks(d3.timeWeek)
            .tickFormat(d3.timeFormat('%b %d'));

        let yAxis = d3.axisLeft(yScale)
            .ticks(4)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickPadding(5);

        // Add line, area under curve, and markers to svg
        // @ts-ignore
        let line = d3.line()
            // @ts-ignore
            .x((d, i) => xTimeScale(d.x))
            // @ts-ignore
            .y(d => yScale(d.y));
        // @ts-ignore
        let area = d3.area()
            // @ts-ignore
            .x((d, i) => xTimeScale(d.x))
            .y0(this.height)
            // @ts-ignore
            .y1(d => yScale(d.y));

        // const transitionTime = 3000;
        const t = d3.transition().duration(300).ease(d3.easeLinear)
        this.svg.selectAll('.line')
            .data([data])
            .join('path')
            .transition(t)
            .attr('class', 'line')
            .attr('d', line(data))
            .attr('fill', 'none')
            .attr('stroke', '#751fa2');

        this.svg.selectAll('.area')
            .data([data])
            .join('path')
            .transition(t)
            .attr('class', 'area')
            .attr('d', area(data))
            .attr('fill', '#751fa2')
            .attr('opacity', 0.1);

        const radius = 3
        let circles = this.svg.selectAll('circle').data(data)
        circles.join('circle').transition(t)
            .attr('cx', (d, i) => xTimeScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', radius)

        circles.on('mouseover', function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', radius * 2)
                .attr('fill', 'yellow')
                .attr('stroke', 'black')

            d3.select('#tooltip')
                .transition()
                .duration(200)
                .style('left', event.x + "px")
                .style('top', event.y + "px")
                .select('#value')
                .text('Price: $' + d.y + '\nDate: ' + d3.timeFormat('%b %d')(d.x))
            d3.select('#tooltip').classed('hidden', false)
        }).on('mouseout', function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', radius)
                .attr('fill', '#000000')
            d3.select('#tooltip').classed('hidden', true)
        })

        return { xAxis, yAxis };
    }

    fetchData() {
        let data = this.server.getStock();
        this.subscription = data.subscribe(obj => {
            console.log("Received data from server:");
            console.log("--------");
            console.log(obj);
            console.log("--------");
        });
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
