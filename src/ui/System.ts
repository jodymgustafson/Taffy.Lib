namespace Taffy
{
    "use strict";
    export namespace System
    {
        /** Puts URL query parameters into a map (an object). The values are url decoded. */
        export function getQueryParameters(): any
        {
            let args = {};
            let urlParams = window.location.search.slice(1);
            if (urlParams.length > 0)
            {
                urlParams.split("&").forEach(function (param)
                {
                    var tokens = param.split("=");
                    args[tokens[0]] = decodeURIComponent(tokens[1]);
                });
            }
            return args;
        }
        
        /** Opens a new browser window */
        export function openWindow(url?: string, target?: string, features?: string, replace?: boolean): Window
        {
            return window.open(url, target, features, replace);
        }

        /** Returns true of the browser supports touch events */
        export function isTouchSupported(): boolean
        {
            return ("ontouchstart" in document.documentElement);
        }
        /** Returns true of the browser supports pointer events */
        export function isPointerSupported(): boolean
        {
            return ("onpointerdown" in document.documentElement);
        }
        /** Returns true of the browser supports mouse events */
        export function isMouseSupported(): boolean
        {
            return ("onmousedown" in document.documentElement);
        }

        /////////////////////////////////////////////////////////////////////////
        // Timing ///////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////

        export function setInterval(callback: Function, timeout?: any, ...args: any[]): number
        {
            return window.setInterval(callback, timeout, args);
        }

        export function clearInterval(handle: number): void
        {
            window.clearInterval(handle);
        }

        export function setTimeout(callback: Function, timeout?: any, ...args: any[]): number
        {
            return window.setTimeout(callback, timeout, args);
        }

        export function clearTimeout(handle: number): void
        {
            window.clearTimeout(handle);
        }
        
        /////////////////////////////////////////////////////////////////////////
        // Dialogs //////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////

        /** Shows a confirm dialog and returns the result */
        export function confirm(message?: string): boolean
        {
            return window.confirm(message);
        }
        /** Shows an alert dialog */
        export function alert(message?: string): void
        {
            window.alert(message);
        }

        /////////////////////////////////////////////////////////////////////////
        // Timing ///////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////

        /** Requests an animation frame and returns the handle */
        export function requestAnimationFrame(callback: FrameRequestCallback): number
        {
            return window.requestAnimationFrame(callback);
        }

        export function cancelAnimationFrame(handle: number): void
        {
            window.cancelAnimationFrame(handle);
        }

        /** Adds a function to be called when the DOM is ready */
        export function ready(callback: () => any): void
        {
            // If the dom has been loaded it will not fire an event so need to check if loaded and fire the callback immediately
            if (document.readyState == "interactive" || document.readyState == "complete")
            {
                callback();
            }
            else
            {
                document.addEventListener("DOMContentLoaded", (evt) => callback());
            }
        }

        // Static initializer
        (() =>
        {
            // Normalize requestAnimationFrame
            window.requestAnimationFrame = window.requestAnimationFrame || window["msRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] ||
                function (callback: FrameRequestCallback)
                {
                    return setTimeout(callback, 0);
                };
            window.cancelAnimationFrame = window.cancelAnimationFrame || window["msCancelRequestAnimationFrame"] || window["mozCancelAnimationFrame"] || function (handle: number) { };
        })();
    }
}
