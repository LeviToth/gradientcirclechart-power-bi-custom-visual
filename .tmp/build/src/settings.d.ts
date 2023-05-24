import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * ColorSettings Formatting Card #1
 */
declare class ColorSettings extends FormattingSettingsCard {
    fontColor: formattingSettings.ColorPicker;
    fontFamily: formattingSettings.FontPicker;
    gradiantColorFirst: formattingSettings.ColorPicker;
    gradiantColorSecond: formattingSettings.ColorPicker;
    arrowColor: formattingSettings.ColorPicker;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * AnimationSettings Formatting Card #2
 */
declare class AnimationSettings extends FormattingSettingsCard {
    duration: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
* visual settings model class
*
*/
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    colorSettingsCard: ColorSettings;
    animationSettingsCard: AnimationSettings;
    cards: (ColorSettings | AnimationSettings)[];
}
export {};
