/////////////////////////////////////////////////////////////////////////
// A library of JavaScript system functions 
/////////////////////////////////////////////////////////////////////////
namespace Taffy
{
    "use strict";
    export namespace System
    {
        let _debug = false;
        export var Console = (window ? window.console : console);

        /** Clones a data object */
        export function clone<T>(obj: T): T
        {
            return <T>JSON.parse(JSON.stringify(obj));
        }
        /** Determines if a value is null or undefined, as opposed to falsy */
        export function isNullOrUndefined(val: any): boolean
        {
            return (val === null || val === void(0));
        }
        /** Determines if a value is undefined, as opposed to falsy */
        export function isUndefined(val: any): boolean
        {
            return (val === void(0));
        }
        /** Determines if a value is a number */
        export function isNumber(val: any): boolean
        {
            return (typeof val === "number");
        }
        /** Determines if a value is a string */
        export function isString(val: any): boolean
        {
            return (typeof val === "string");
        }
        /** Determines if a number is finite.  If the argument is NaN, positive infinity, or negative infinity, this method returns false. */
        export function isFiniteNumber(val: number): boolean
        {
            return !isNullOrUndefined(val) && isFinite(val);
        }
        /** Determines if a number is NaN */
        export function isNotANumber(val: number): boolean
        {
            return isNaN(val);
        }
        /** Coerces a number to a 32-bit integer (may increase performance of math operations) */
        export function toInt32(n: number): number
        {
            return n | 0;
        }
        /** Puts a function in the event queue to be run.
            *  This will let other events in the queue (such as UI updates) be handled before the function runs.
            */
        export function queueFn(callback: Function): void
        {
            setTimeout(callback, 0);
        }

        /////////////////////////////////////////////////////////////////////////
        // JSON /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /** Converts a value to a json string */
        export function toJson(value: any): string
        {
            return JSON.stringify(value);
        }
        /** Parses a json string to an object of the specified type */
        export function parseJson<T>(text: string): T
        {
            return <T>JSON.parse(text);
        }
    }
}