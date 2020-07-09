import defaultSettings, { SettingsObject } from './defaultSettings';
import initialLayout, { getChartArea } from './layout';
import deepObjectMerge from './deepObjectMerge';
import appendSVGChild from './appendSVGChild';
import updateData from './updateData';
import updateOptions from './updateOptions';
import plot from './plot';
import placePlot from './placePlot';
import buildSurround from './buildSurround';
import render from './render';

class SVGChrt {
  defaultSettings = defaultSettings;
  layout          = initialLayout;
  appendSVGChild  = appendSVGChild;
  plot            = plot;
  placePlot       = placePlot;
  deepObjectMerge = deepObjectMerge;
  settings        : SettingsObject;
  target          : HTMLElement;
  chartArea       : SVGGraphicsElement | null;
  data            : object;
  constructor(options = {}, data = {}) {
    this.settings = deepObjectMerge(this.defaultSettings, options) as SettingsObject;
    console.log(this.settings);
    this.target = /^#\w*/i.test(this.settings.target)
                ? document.querySelector(this.settings.target) as HTMLElement
                : document.querySelector(`#${this.settings.target}`) as HTMLElement;
    this.chartArea = document.querySelector('#chart-area');
  }
  render() {
    if (!this.target) {
      throw new Error(
        `Sorry, ${this.settings.target} doesn't appear to exist in the document. Please use a target <div> or <section> that is already in the document to display your visualisation.`
      );
      return;
    }
    let tET = this.target.tagName.toLowerCase();
    if (!['div', 'section'].includes(tET)) {
      throw new Error(
        `Sorry, ${this.settings.target} doesn't appear to be a <div> or <section>. You need to select one of those from the document to display your visualisation.`
      );
      return;
    }
    let c: SVGGraphicsElement = buildSurround(this.settings,this.target);
    if (this.plot instanceof Function) {
      this.plot(c);
      this.placePlot(c);
    }
  }
}

module.exports = SVGChrt;
