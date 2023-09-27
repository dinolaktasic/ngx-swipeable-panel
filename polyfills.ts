/* eslint-disable */
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

(window as any).global = window;

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

// https://stackoverflow.com/questions/46715190/error-in-ie-11-browser-exception-object-doesnt-support-property-or-method-m
if (!Element.prototype.matches) {
  Element.prototype.matches = (Element as any).prototype.msMatchesSelector;
}

// https://github.com/aws-amplify/amplify-js/issues/403
// import 'whatwg-fetch';

/**
 * If the application will be indexed by Google Search, the following is required.
 * Googlebot uses a renderer based on Chrome 41.
 * https://developers.google.com/search/docs/guides/rendering
 **/
// import 'core-js/es6/array';

/** Requires the following for the Reflect API. */
import 'reflect-metadata';

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 */

(window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
// (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
(window as any).__zone_symbol__BLACK_LISTED_EVENTS = [
  'scroll',
  'mousemove',
  'pointermove',
]; // disable patch specified eventNames

/*
 * in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 * with the following flag, it will bypass `zone.js` patch for IE/Edge
 */
// (window as any).__Zone_enable_cross_context_check = true;

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js'; // Included with Angular CLI.

/**
 * package base64url requires Buffer, so nodejs's Buffer needs to be polyfilled.
 * https://github.com/brianloveswords/base64url/issues/33
 *
 * Usage of the browserified buffer package
 * https://github.com/feross/buffer#usage
 *
 */
// (window as any).Buffer = require('buffer/').Buffer;
