import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
export interface VData {
    value: number;
}
export declare function TransformData(options: VisualUpdateOptions): VData | null;
