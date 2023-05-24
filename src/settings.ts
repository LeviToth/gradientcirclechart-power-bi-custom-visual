/*
 *  Power BI Visualizations
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

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * ColorSettings Formatting Card #1
 */
class ColorSettings extends FormattingSettingsCard {
    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font color",
        value: { value: "black" }
    });

    fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Font style",
        value: 'Segoe UI Light'
    });

    gradiantColorFirst = new formattingSettings.ColorPicker({
        name: "gradiantColorFirst",
        displayName: "Gradient first color",
        value: { value: "#025d93" }
    });

    gradiantColorSecond = new formattingSettings.ColorPicker({
        name: "gradiantColorSecond",
        displayName: "Gradient second color",
        value: { value: "#86f4ee" }
    });

    arrowColor = new formattingSettings.ColorPicker({
        name: "arrowColor",
        displayName: "Arrow color",
        value: { value: "black" }
    });

    name: string = "colorSettings";
    displayName: string = "Data colors";
    slices: Array<FormattingSettingsSlice> = [this.fontColor, this.fontFamily, this.gradiantColorFirst, this.gradiantColorSecond, this.arrowColor];

}

/**
 * AnimationSettings Formatting Card #2
 */
class AnimationSettings extends FormattingSettingsCard {
    duration = new formattingSettings.NumUpDown({
        name: "duration",
        displayName: "Animation duration",
        value: 1000
    });

    name: string = "animationSettings";
    displayName: string = "Animation";
    slices: Array<FormattingSettingsSlice> = [this.duration];
}


/**
* visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    colorSettingsCard = new ColorSettings();
    animationSettingsCard = new AnimationSettings();

    cards = [this.colorSettingsCard, this.animationSettingsCard];
}
