import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var GradientCircleChart0538D0AFFEC747F383D6C2803A2963F0: IVisualPlugin = {
    name: 'GradientCircleChart0538D0AFFEC747F383D6C2803A2963F0',
    displayName: 'Gradient Circle Chart',
    class: 'Visual',
    apiVersion: '5.3.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["GradientCircleChart0538D0AFFEC747F383D6C2803A2963F0"] = GradientCircleChart0538D0AFFEC747F383D6C2803A2963F0;
}
export default GradientCircleChart0538D0AFFEC747F383D6C2803A2963F0;