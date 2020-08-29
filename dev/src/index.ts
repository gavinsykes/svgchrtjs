/**
 * @author Gavin Sykes <gavin@gavinsykes.uk> (https://gavinsykes.uk/) [@gavinsykes_uk](https://twitter.com/gavinsykes_uk)
 * @license MIT
 */

import defaultSettings, { SettingsObject } from './defaultSettings';
import initialLayout, { getChartArea } from './layout';
import deepObjectMerge from './deepObjectMerge';
import appendSVGChild from './appendSVGChild';
import plot from './plot';
import placePlot from './placePlot';
import buildSurround from './buildSurround';
import render from './render';

/**
 * buildSurround takes a SettingsObject and HTMLElement as its arguments. It generates an SVG element onto which it applies the title, description, subtitle and chart area.
 *
 * The return value is the generted chart area.
 *
 * @param {SettingsObject} settings - the settings to apply to the visualisation.
 *
 * @param {HTMLElement} target - the HTML element in which to build the visualisation.
 *
 */
class SVGChrt {
  defaultSettings = defaultSettings;
  layout = initialLayout;
  appendSVGChild = appendSVGChild;
  plot = plot;
  placePlot = placePlot;
  deepObjectMerge = deepObjectMerge;
  getChartArea = getChartArea;
  settings: SettingsObject;
  target: HTMLElement;
  chartArea: SVGGraphicsElement | null;
  data: Record<string, unknown>;
  constructor(options = {}, data = {}) {
    this.settings = deepObjectMerge(
      this.defaultSettings,
      options
    ) as SettingsObject;
    this.target = /^#\w*/i.test(this.settings.target)
      ? (document.querySelector(this.settings.target) as HTMLElement)
      : (document.querySelector(`#${this.settings.target}`) as HTMLElement);
    this.chartArea = null;
    this.data = data;
  }

  render() {
    if (!this.target) {
      throw new Error(
        `Sorry, ${this.settings.target} doesn't appear to exist in the document. Please use a target <div> or <section> that is already in the document to display your visualisation.`
      );
      return;
    }
    const tET = this.target.tagName.toLowerCase();
    if (!['div', 'section'].includes(tET)) {
      throw new Error(
        `Sorry, ${this.settings.target} doesn't appear to be a <div> or <section>. You need to select one of those from the document to display your visualisation.`
      );
      return;
    }
    this.chartArea = buildSurround(this.settings, this.target);
    if (this.plot instanceof Function) {
      this.plot(this.chartArea);
      this.placePlot(this.chartArea);
    }
  }
}

module.exports = SVGChrt;
