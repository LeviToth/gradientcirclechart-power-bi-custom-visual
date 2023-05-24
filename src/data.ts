"use strict";

import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

export interface VData {
    value: number
}

export function TransformData(options: VisualUpdateOptions): VData | null {
    try {
        const dataView = options.dataViews[0];
        const singleDataView = dataView.single;
        return {
            value: singleDataView.value as number
        };

    } catch (error) {
        return null;
    }
}