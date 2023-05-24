/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import { select, arc, interpolate, interpolateBasis } from "d3"; // Import d3 moduls
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>; // Shorters selection: d3.Selection<SVGElement, any, any, any>
import { TransformData} from "./data"; // Import the transformed data
import { setStyle } from "./setstyle"; // Import the style
import ISelectionManager = powerbi.extensibility.ISelectionManager;


import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private selectionManager: ISelectionManager;
    private svg: Selection<SVGElement>;
    private parentGroup: Selection<SVGElement>;
    private backgroundArc: Selection<SVGElement>;
    private progressArc: Selection<SVGElement>;
    private pctLabel: Selection<SVGElement>;
    private arrowLabel: Selection<SVGElement>;
    private gradient: Selection<SVGElement>;
    static margin = { top: 5, right: 5, bottom: 5, left: 5 };

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.selectionManager = options.host.createSelectionManager();
        this.handleContextMenu();

        if (document) {
            // Create the DOM element classes and ids
            this.svg = select(this.target).append('svg').classed('mainGroup', true);
            this.parentGroup = this.svg.append('g').classed('parentGroup', true);
            this.backgroundArc = this.parentGroup.append('path').classed('backgroundArc', true);
            this.progressArc = this.parentGroup.append('path').classed('progressArc', true);
            this.pctLabel = this.parentGroup.append('text').classed('pctLabel', true);
            this.arrowLabel = this.parentGroup.append('text').classed('arrow', true);
            this.gradient = this.svg.append("defs").append("linearGradient").attr("id", "gradient")
            this.gradient.append("stop").attr("id", "gradientFirst")
            this.gradient.append("stop").attr("id", "gradientSecond")
        }
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);
        console.log('Visual update', options);
        setStyle(this.formattingSettings)

        // Define variables
        const result = TransformData(options)
        const pct = result.value
        const { width, height } = options.viewport;
        const margin = Visual.margin;
        const chartHeight = height - margin.top - margin.bottom;
        const chartWidth = width - margin.left - margin.right;
        const fullCircle = Math.PI * 2
        const r = Math.min(chartWidth, chartHeight) / 2
        const animationSettings = this.formattingSettings.animationSettingsCard;
        const duration = animationSettings.duration.value

        // Attach the drawing area responsive size
        this.svg.attr('width', width).attr('height', height)
        this.parentGroup.attr('transform', `translate(${margin.left},${margin.top})`);

        // Attach the gradient svg settings
        this.gradient
            .attr("x1", "50%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%")
        this.gradient.select('#gradientFirst')
            .attr("offset", "0%");
        this.gradient.select('#gradientSecond')
            .attr("offset", "100%");

        // Create the Arcs
        const bgArc = arc()
            .innerRadius(r / 1.5)
            .outerRadius(r)
            .startAngle(0)
            .endAngle(fullCircle)
        const progArc = arc()
            .innerRadius(r / 1.5)
            .outerRadius(r)
            .startAngle(0)
            .endAngle(0)
            .cornerRadius(60)

        // Attach the static background arc
        this.backgroundArc.attr('d', bgArc)
            .attr('transform', `translate(${r}, ${r})`);

        // Attach the progress arc label and the animation
        this.progressArc
            .attr('d', progArc)
            .attr('transform', `translate(${r}, ${r})`)
            .transition()
            .duration(duration)
            .attrTween('d', () => {
                const minimumInterpValue = 0.4;
                const interp = interpolate(minimumInterpValue, Math.max(fullCircle * pct, minimumInterpValue));
                const interpBasis = interpolateBasis(Array(40).fill(60).concat([0]));
                return (t: number) => {
                    progArc.endAngle(interp(t));
                    if (pct >= 1) {
                        progArc.cornerRadius(interpBasis(t));
                    }
                    return progArc(null);
                };
            });

        // Attach the percentage text label, and the animation for it
        const pctLabel = this.pctLabel
            .attr('x', r)
            .attr('y', r * 1.14)
            .attr('font-size', r / 2.5)
        pctLabel
            .transition()
            .duration(duration)
            .tween('text', function () {
                return function (t) {
                    pctLabel.text(Math.round((pct * 100) * t) + '%');
                }
            })

        // Attach the design arrow on the top
        this.arrowLabel
            .attr('x', r * 1.18)
            .attr('y', r * 0.25)
            .attr('font-size', r / 4)
            .text('>')
    }

    private handleContextMenu() {
        select(this.target).on("contextmenu", (event: MouseEvent) => {
            // Pass the appropriate dataPoint object instead of the empty object if needed
            this.selectionManager.showContextMenu({}, {
                x: event.clientX,
                y: event.clientY,
            });
            event.preventDefault();
        });
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);

    }
}