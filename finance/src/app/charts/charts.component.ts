import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { YahooHttpService } from '../yahoo-http.service';
import { stockDataApple } from '../localData';
import * as d3 from 'd3'
import { axisBottom, svg } from 'd3'

interface Datum {
    x: Date,
    y: number
}

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
    private data: Datum[] = [];
    private ys: number[] = [];
    symbol: string = '';
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
        this.ys = Array.from(this.data).map((d: Datum) => d.y)
        this.createSvg()
        this.drawLineChart(this.data)
    }

    updateStock(newStock: any) {
        this.input = 1
        this.rawData = newStock;
        this.symbol = Object.keys(this.rawData)[0]
        this.data = this.formatData(this.rawData[this.symbol])
        this.ys = Array.from(this.data).map((d: Datum) => d.y)
        this.createSvg()
        this.drawLineChart(this.data)
    }

    updateSmoothing() {
        let ysNew = this.movingAverage(this.ys, this.input)
        let smoothData: Datum[] = Array.from(this.data)
        for (let i = 0; i < smoothData.length; i++) {
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
        let formattedData: Datum[] = []
        let dateFormat = d3.timeParse('%s')
        for (let i = 0; i < data.timestamp.length; i++) {
            let datum: Datum = { x: dateFormat(data.timestamp[i]) as Date, y: data.close[i] }
            formattedData.push(datum)
        }
        return formattedData
    }

    private createSvg(): void {
        if (this.svg) { // Don't keep drawing new svgs when selecting new stock
            d3.select('svg').remove()
        }
        this.svg = d3.select('figure#chart')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    }

    private drawLineChart(data: Datum[]): void {
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

        this.updateSmoothing()
    }

    private updateChart(data: Datum[]) {
        let n = data.length;

        // Scales
        let xTimeScale = d3.scaleTime()
            .domain(<[Date, Date]>d3.extent(data, d => d.x)) //TODO: VERIFY W chart
            .range([0, this.width])
        let xScale = d3.scaleLinear()
            .domain([0, n - 1])
            .range([0, this.width]);
        let yScale = d3.scaleLinear()
            .domain(<[number, number]>d3.extent(data, d => d.y))
            .range([this.height, 0]);

        // Define axes, line, and area under curve
        let xAxis = d3.axisBottom(xTimeScale)
            .tickSizeInner(9)
            .tickSizeOuter(0)
            .tickPadding(5)
            .ticks(4)

        let yAxis = d3.axisLeft(yScale)
            .ticks(4)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickPadding(5);

        // Add line, area under curve, and markers to svg
        let line = d3.line<Datum>()
            .x((d: Datum) => xTimeScale(d.x))
            .y((d: Datum) => yScale(d.y));
        let area = d3.area<Datum>()
            .x((d: Datum) => xTimeScale(d.x))
            .y0(this.height)
            .y1((d: Datum) => yScale(d.y));

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

        if (data.length < 100) { // Don't add markers if too much data
            const radius = 3
            let circles = this.svg.selectAll('circle').data(data)
            circles.join('circle').transition(t)
                .attr('cx', (d: Datum) => xTimeScale(d.x))
                .attr('cy', (d: Datum) => yScale(d.y))
                .attr('r', radius)

            circles.on('mouseover', function (event: any, d: Datum) {
                d3.select(event.target)
                    .transition()
                    .duration(200)
                    .attr('r', radius * 2)
                    .attr('fill', 'yellow')
                    .attr('stroke', 'black')

                d3.select('#tooltip')
                    .style('left', event.x + "px")
                    .style('top', event.y + "px")
                    .select('#value')
                    .html(() => '<b>Price</b> $' + d.y + '<br><b>Date</b> ' + d3.timeFormat('%b %d')(d.x))
                d3.select('#tooltip').classed('hidden', false)
            }).on('mouseout', function (event: any, d: Datum) {
                d3.select(event.target)
                    .transition()
                    .duration(200)
                    .attr('r', radius)
                    .attr('fill', '#000000')
                d3.select('#tooltip').classed('hidden', true)
            })
        }

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
