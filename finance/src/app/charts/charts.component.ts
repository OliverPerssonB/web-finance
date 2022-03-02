import { Component, OnInit } from '@angular/core';
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
    private data: any;
    private svg: any;
    private margin: any = { top: 20, right: 0, bottom: 50, left: 0 };
    private width: number = 700 - this.margin.left - this.margin.right;
    private height: number = 300 - this.margin.top - this.margin.bottom;
    public symbol: string;

    constructor(private server: YahooHttpService) { }

    ngOnInit(): void {
        this.data = stockDataApple;
        console.log("Data available:");
        console.log("-------------");
        console.log(this.data);
        console.log("-------------");


        this.symbol = Object.keys(this.data)[0]
        let formattedData = this.formatData(this.data.AAPL)
        this.createSvg()
        this.drawLineChart(formattedData)
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
        this.svg = d3.select('figure#chart')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    }

    private drawLineChart(data: any[]): void {
        let n = data.length

        // Scales
        let xTimeScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.x.getTime()))
            .range([0, this.width])
        // .nice()
        let xScale = d3.scaleLinear()
            .domain([0, n - 1])
            .range([0, this.width])
        let yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.y))
            .range([this.height, 0])

        // Define axes, line, and area under curve
        let xAxis = d3.axisBottom(xTimeScale)
            .tickSizeInner(9)
            .tickSizeOuter(0)
            .tickPadding(5)
            .ticks(d3.timeWeek)
            .tickFormat(d3.timeFormat('%b %d'))

        let yAxis = d3.axisLeft(yScale)
            .ticks(4)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickPadding(5)

        // @ts-ignore
        let line = d3.line().x((d, i) => xScale(i)).y(d => yScale(d.y))

        // @ts-ignore
        let area = d3.area().x((d, i) => xScale(i)).y0(this.height).y1(d => yScale(d.y))

        // Add line, area under curve, and markers to svg
        this.svg.append('path')
            .attr('class', 'area')
            .attr('d', area(data))
            .attr('fill', '#751fa2')
            .attr('opacity', 0.1)

        this.svg.append('path')
            .attr('class', 'line')
            .attr('d', line(data))
            .attr('fill', 'none')
            .attr('stroke', '#751fa2')

        this.svg.selectAll('.marker')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => xScale(i))
            .attr('cy', d => yScale(d.y))
            .attr('r', 1.5)

        // Add axes to svg
        this.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${this.height})`)
            .call(xAxis)

        let ax = this.svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', `translate(${this.width}, 0)`)
            .call(yAxis)
        // Remove y axis, keep tick labels
        ax.selectAll('path')
            .style('stroke', 'none')

        // Tick label font size
        this.svg.selectAll('text')
            .attr('font-size', '10px')
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
