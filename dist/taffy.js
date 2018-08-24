var Taffy;
(function (Taffy) {
    "use strict";
    /**
     * A class for storing and manipulating an unsigned byte value (0 to 255)
     * Usage: import {Byte} from "./Byte";
     */
    var Byte = /** @class */ (function () {
        /**
         * Create a new instance from a number.
         * If the number is too big or small to fit into a byte it will be truncated and the overflow flag set.
         * @param n
         */
        function Byte(n) {
            this._overflow = false;
            this._value = 0;
            this._value = Byte.truncate(n);
            this._overflow = (this._value !== n);
        }
        Object.defineProperty(Byte.prototype, "overflow", {
            /** Used to determine if the number was modified to fit into a byte value */
            get: function () { return this._overflow; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Byte.prototype, "value", {
            /** Gets the value of the byte as a number **/
            get: function () { return this._value; },
            enumerable: true,
            configurable: true
        });
        /** Makes a number fit into a byte by truncating it */
        Byte.truncate = function (b) {
            if (b > Byte.MAX_VALUE)
                return Byte.MAX_VALUE;
            if (b < Byte.MIN_VALUE)
                return Byte.MIN_VALUE;
            return b | 0;
        };
        /** Makes a number fit into a byte using modulus */
        Byte.mod = function (b) {
            return (Math.abs(b) | 0) % 256;
        };
        /**
         * Checks is a number is in the range of a byte value
         */
        Byte.isByte = function (b) {
            return b >= Byte.MIN_VALUE && b <= Byte.MAX_VALUE;
        };
        Byte.MIN_VALUE = 0;
        Byte.MAX_VALUE = 255;
        return Byte;
    }());
    Taffy.Byte = Byte;
})(Taffy || (Taffy = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Taffy;
(function (Taffy) {
    "use strict";
    /**
     * An immutable color object
     * Usage: import {Color} from "./Color";
     */
    var Color = /** @class */ (function () {
        function Color(sOrRed, g, b, a) {
            this.reHex = /^#?([\da-f]{3}|[\da-f]{6})$/i;
            this.reRgb = /^rgb\s*\(\s*(\d{0,3})\s*,\s*(\d{0,3})\s*,\s*(\d{0,3})\s*\)$/i;
            this.reRgba = /^rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*((0\.|\.)?\d+)\s*\)$/i;
            if (arguments.length >= 3) {
                this.r = this.validateByte(arguments[0]);
                this.g = this.validateByte(arguments[1]);
                this.b = this.validateByte(arguments[2]);
                if (arguments.length === 4) {
                    this.a = Math.min(1, Math.max(0, arguments[3]));
                }
                else
                    this.a = 1;
            }
            else
                this.parse(sOrRed);
        }
        Color.prototype.red = function () {
            return this.r;
        };
        Color.prototype.green = function () {
            return this.g;
        };
        Color.prototype.blue = function () {
            return this.b;
        };
        Color.prototype.alpha = function () {
            return this.a;
        };
        /**
        * Gets the rgb(x,x,x) value of the color
        * @return String rgb color
        */
        Color.prototype.toRGB = function () {
            return this._rgb || (this._rgb = "rgb(" + this.r + "," + this.g + "," + this.b + ")");
        };
        /**
         * Gets the rgba(x,x,x,x) value of the color
        * @param alpha Optional overide for the alpha
        * @return String rgba color
        */
        Color.prototype.toRGBA = function (alpha) {
            return this._rgba || (this._rgba = "rgba(" + this.r + "," + this.g + "," + this.b + "," + (alpha || this.a) + ")");
        };
        /** Gets the hex value of the color
        * @param shorthandAcceptable If true will return #333 instead of #333333, default is false
        * @return String hex color
        */
        Color.prototype.toHex = function (shorthandAcceptable) {
            if (shorthandAcceptable === void 0) { shorthandAcceptable = false; }
            if (this._hex)
                return this._hex;
            this._hex = "#" + this.toColorPart(this.r) + this.toColorPart(this.g) + this.toColorPart(this.b);
            if (shorthandAcceptable) {
                this._hex = this._hex.replace(/^#([\da-f])\1([\da-f])\2([\da-f])\3$/i, "#$1$2$3");
            }
            return this._hex;
        };
        /**
        * Get a color that is lighter than this color
        * @param amount Amount to lighten where 0 is 0% and 1 is 100%
        */
        Color.prototype.lighter = function (amount) {
            if (amount === void 0) { amount = .1; }
            var pct = 1 + amount;
            return new Color(Taffy.Byte.truncate(pct * this.r), Taffy.Byte.truncate(pct * this.g), Taffy.Byte.truncate(pct * this.b), this.a);
        };
        /**
        * Get a color that is darker than this color
        * @param amount Amount to darken where 0 is 0% and 1 is 100%
        */
        Color.prototype.darker = function (amount) {
            if (amount === void 0) { amount = .1; }
            var pct = Math.max(0, 1 - amount);
            return new Color(Taffy.Byte.truncate(pct * this.r), Taffy.Byte.truncate(pct * this.g), Taffy.Byte.truncate(pct * this.b), this.a);
        };
        /**
         * Get a color that is more transparent than this color
         * @param amount Amount to fade where 0 is 0% and 1 is 100%
         */
        Color.prototype.fade = function (amount) {
            if (amount === void 0) { amount = .1; }
            var pct = Math.max(0, 1 - amount);
            return new Color(this.r, this.g, this.b, pct * this.a);
        };
        Color.prototype.validateByte = function (n) {
            if (!Taffy.Byte.isByte(n))
                throw new Error("Invalid value for color component: " + n);
            return n;
        };
        Color.prototype.toColorPart = function (n) {
            return ((n < 16 ? '0' : '') + n.toString(16));
        };
        /**
        * Parse color strings into Color objects.
        * @param str hexadecimal, shorthand hex, rgb() or rgba()
        * @return Color {r: XXX, g: XXX, b: XXX, a: x} or undefined if invalid
        */
        Color.prototype.parse = function (str) {
            if (this.reHex.test(str)) {
                // Remove hash if present
                str = str.replace(/^#/, '');
                // If shorthand hex convert to long
                str = str.replace(/^([\da-f])([\da-f])([\da-f])$/i, "$1$1$2$2$3$3");
                // Convert each part to number and place in object
                this.r = Taffy.Convert.toInt(str.slice(0, 2), 16);
                this.g = Taffy.Convert.toInt(str.slice(2, 4), 16);
                this.b = Taffy.Convert.toInt(str.slice(4, 6), 16);
                this.a = 1;
            }
            else if (this.reRgb.test(str)) {
                var parts = str.match(this.reRgb);
                this.r = Taffy.Convert.toInt(parts[1]);
                this.g = Taffy.Convert.toInt(parts[2]);
                this.b = Taffy.Convert.toInt(parts[3]);
                this.a = 1;
            }
            else if (this.reRgba.test(str)) {
                var parts = str.match(this.reRgba);
                this.r = Taffy.Convert.toInt(parts[1]);
                this.g = Taffy.Convert.toInt(parts[2]);
                this.b = Taffy.Convert.toInt(parts[3]);
                this.a = Taffy.Convert.toFloat(parts[4]);
            }
        };
        return Color;
    }());
    Taffy.Color = Color;
    ///////////////////////////////////////////////////////////////////////////////
    /**
     * A set of static color objects by name
     */
    Taffy.colors = {
        red: new Color(255, 0, 0),
        yellow: new Color(255, 255, 0),
        green: new Color(0, 255, 0),
        cyan: new Color(0, 255, 255),
        blue: new Color(0, 0, 255),
        purple: new Color(255, 0, 255),
    };
    ///////////////////////////////////////////////////////////////////////////////
    /**
     * A mutable color object
     */
    var MutableColor = /** @class */ (function (_super) {
        __extends(MutableColor, _super);
        function MutableColor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MutableColor.prototype.red = function (r) {
            if (Taffy.System.isUndefined(r))
                return this.r;
            this.r = this.validateByte(r);
            this.reset();
            return this;
        };
        MutableColor.prototype.green = function (g) {
            if (Taffy.System.isUndefined(g))
                return this.g;
            this.g = this.validateByte(g);
            this.reset();
            return this;
        };
        MutableColor.prototype.blue = function (b) {
            if (Taffy.System.isUndefined(b))
                return this.b;
            this.b = this.validateByte(b);
            this.reset();
            return this;
        };
        MutableColor.prototype.alpha = function (a) {
            if (Taffy.System.isUndefined(a))
                return this.a;
            this.a = Math.min(1, Math.max(0, a));
            this.reset();
            return this;
        };
        /**
        * Makes the color lighter
        * @param amount Amount to lighten where 0 is 0% and 1 is 100%
        */
        MutableColor.prototype.lighter = function (amount) {
            if (amount === void 0) { amount = .1; }
            var pct = 1 + amount;
            return this.red(Taffy.Byte.truncate(pct * this.r)).green(Taffy.Byte.truncate(pct * this.g)).blue(Taffy.Byte.truncate(pct * this.b));
        };
        /**
        * Makes the color darker
        * @param amount Amount to darken where 0 is 0% and 1 is 100%
        */
        MutableColor.prototype.darker = function (amount) {
            if (amount === void 0) { amount = .1; }
            var pct = Math.max(0, 1 - amount);
            return this.red(Taffy.Byte.truncate(pct * this.r)).green(Taffy.Byte.truncate(pct * this.g)).blue(Taffy.Byte.truncate(pct * this.b));
        };
        /**
         * Makes the color more transparent
         * @param amount Amount to fade where 0 is 0% and 1 is 100%
         */
        MutableColor.prototype.fade = function (amount) {
            if (amount === void 0) { amount = .1; }
            var pct = Math.max(0, 1 - amount);
            return this.alpha(pct * this.a);
        };
        MutableColor.prototype.reset = function () {
            this._rgb = this._rgba = this._hex = null;
        };
        return MutableColor;
    }(Color));
    Taffy.MutableColor = MutableColor;
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    "use strict";
    var Convert;
    (function (Convert) {
        /** Parses a string into a decimal number (i.e. not an integer) */
        function toFloat(str) {
            return parseFloat(str);
        }
        Convert.toFloat = toFloat;
        /** Parses a string into an integer number */
        function toInt(str, radix) {
            if (radix === void 0) { radix = 10; }
            return parseInt(str, radix);
        }
        Convert.toInt = toInt;
        /** Converts a value to a string or empty string if undefined or null */
        function toString(val) {
            return (Taffy.System.isNullOrUndefined(val)) ? "" : val.toString();
        }
        Convert.toString = toString;
        /** Converts a css-type dasherized string to camel case. (e.g. background-color => backgroundColor) */
        function toCamelCase(name) {
            var result = "";
            name.split("-").forEach(function (s, i) {
                result += (i > 0 ? s[0].toUpperCase() + s.slice(1) : s);
            });
            return result;
        }
        Convert.toCamelCase = toCamelCase;
    })(Convert = Taffy.Convert || (Taffy.Convert = {}));
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    "use strict";
    /**
    * Defines a wrapper for a Json file that includes info about the file as
    * well as the data to be saved stored in the data property.
    */
    var JsonFile = /** @class */ (function () {
        function JsonFile(fileType, data) {
            this.fileType = fileType;
            this.data = data;
            this.createdDate = new Date();
            this.updatedDate = new Date();
        }
        return JsonFile;
    }());
    Taffy.JsonFile = JsonFile;
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    "use strict";
    /** Key codes for handling keyboard events */
    var KeyCode;
    (function (KeyCode) {
        KeyCode[KeyCode["NUL"] = 0] = "NUL";
        KeyCode[KeyCode["TAB"] = 9] = "TAB";
        KeyCode[KeyCode["ENTER"] = 13] = "ENTER";
        KeyCode[KeyCode["SHIFT"] = 16] = "SHIFT";
        KeyCode[KeyCode["CONTROL"] = 17] = "CONTROL";
        KeyCode[KeyCode["ALT"] = 18] = "ALT";
        KeyCode[KeyCode["ESCAPE"] = 27] = "ESCAPE";
        KeyCode[KeyCode["SPACE"] = 32] = "SPACE";
        KeyCode[KeyCode["HOME"] = 36] = "HOME";
        KeyCode[KeyCode["LEFT"] = 37] = "LEFT";
        KeyCode[KeyCode["UP"] = 38] = "UP";
        KeyCode[KeyCode["RIGHT"] = 39] = "RIGHT";
        KeyCode[KeyCode["DOWN"] = 40] = "DOWN";
        KeyCode[KeyCode["DELETE"] = 46] = "DELETE";
        KeyCode[KeyCode["NUM0"] = 48] = "NUM0";
        KeyCode[KeyCode["NUM1"] = 49] = "NUM1";
        KeyCode[KeyCode["NUM2"] = 50] = "NUM2";
        KeyCode[KeyCode["NUM3"] = 51] = "NUM3";
        KeyCode[KeyCode["NUM4"] = 52] = "NUM4";
        KeyCode[KeyCode["NUM5"] = 53] = "NUM5";
        KeyCode[KeyCode["NUM6"] = 54] = "NUM6";
        KeyCode[KeyCode["NUM7"] = 55] = "NUM7";
        KeyCode[KeyCode["NUM8"] = 56] = "NUM8";
        KeyCode[KeyCode["NUM9"] = 57] = "NUM9";
        KeyCode[KeyCode["A"] = 65] = "A";
        KeyCode[KeyCode["B"] = 66] = "B";
        KeyCode[KeyCode["C"] = 67] = "C";
        KeyCode[KeyCode["D"] = 68] = "D";
        KeyCode[KeyCode["E"] = 69] = "E";
        KeyCode[KeyCode["F"] = 70] = "F";
        KeyCode[KeyCode["G"] = 71] = "G";
        KeyCode[KeyCode["H"] = 72] = "H";
        KeyCode[KeyCode["I"] = 73] = "I";
        KeyCode[KeyCode["J"] = 74] = "J";
        KeyCode[KeyCode["K"] = 75] = "K";
        KeyCode[KeyCode["L"] = 76] = "L";
        KeyCode[KeyCode["M"] = 77] = "M";
        KeyCode[KeyCode["N"] = 78] = "N";
        KeyCode[KeyCode["O"] = 79] = "O";
        KeyCode[KeyCode["P"] = 80] = "P";
        KeyCode[KeyCode["Q"] = 81] = "Q";
        KeyCode[KeyCode["R"] = 82] = "R";
        KeyCode[KeyCode["S"] = 83] = "S";
        KeyCode[KeyCode["T"] = 84] = "T";
        KeyCode[KeyCode["U"] = 85] = "U";
        KeyCode[KeyCode["V"] = 86] = "V";
        KeyCode[KeyCode["W"] = 87] = "W";
        KeyCode[KeyCode["X"] = 88] = "X";
        KeyCode[KeyCode["Y"] = 89] = "Y";
        KeyCode[KeyCode["Z"] = 90] = "Z";
        KeyCode[KeyCode["PLUS"] = 107] = "PLUS";
        KeyCode[KeyCode["MINUS"] = 109] = "MINUS";
        KeyCode[KeyCode["COMMA"] = 188] = "COMMA";
        KeyCode[KeyCode["PERIOD"] = 190] = "PERIOD";
    })(KeyCode = Taffy.KeyCode || (Taffy.KeyCode = {}));
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    "use strict";
    /**
    * Implements a typed map where the key is a string
    */
    var Map = /** @class */ (function () {
        function Map() {
            this._map = {};
        }
        Map.prototype.setItem = function (key, value) {
            this._map[key] = value;
        };
        Map.prototype.getItem = function (key) {
            return this._map[key];
        };
        Map.prototype.removeItem = function (key) {
            delete this._map[key];
        };
        Map.prototype.clear = function () {
            this._map = {};
        };
        Map.prototype.containsKey = function (key) {
            return (this._map[key] !== undefined);
        };
        Map.prototype.each = function (callback) {
            for (var name in this._map) {
                callback(this._map[name], name, this);
            }
        };
        Map.prototype.eachKey = function (callback) {
            for (var name in this._map) {
                callback(name);
            }
        };
        return Map;
    }());
    Taffy.Map = Map;
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    "use strict";
    var Random;
    (function (Random) {
        /**
        * Gets a random number between 0 and max
        * @param max
        */
        function nextTo(max) {
            if (max === void 0) { max = 1; }
            return Math.random() * max;
        }
        Random.nextTo = nextTo;
        /**
        * Gets a random number between min and max
        * @param min
        * @param max
        */
        function next(min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 1; }
            var range = max - min;
            return Math.random() * range + min;
        }
        Random.next = next;
        /**
        * Gets a random integer between min and max
        * @param min
        * @param max
        */
        function nextInt(min, max) {
            return next(min, max + 1) | 0;
        }
        Random.nextInt = nextInt;
        /**
        * Gets a random integer between 0 and max
        * @param max
        */
        function nextIntTo(max) {
            return nextTo(max + 1) | 0;
        }
        Random.nextIntTo = nextIntTo;
        /**
         * Gets a random boolean value
         */
        function nextBoolean() {
            return Math.random() < .5;
        }
        Random.nextBoolean = nextBoolean;
    })(Random = Taffy.Random || (Taffy.Random = {}));
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    "use strict";
    var Rectangle = /** @class */ (function () {
        function Rectangle(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        Object.defineProperty(Rectangle.prototype, "top", {
            get: function () { return this.y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            get: function () { return this.y + this.h; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "left", {
            get: function () { return this.x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "right", {
            get: function () { return this.x + this.w; },
            enumerable: true,
            configurable: true
        });
        /** Moves the rect to a new position */
        Rectangle.prototype.moveTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        /** Determines if this rect intersects with another */
        Rectangle.prototype.intersects = function (rect) {
            var result = this.x < rect.x + rect.w &&
                this.x + this.w > rect.x &&
                this.y < rect.y + rect.h &&
                this.y + this.h > rect.y;
            return result;
        };
        /** Determines if this rect contains a point */
        Rectangle.prototype.contains = function (x, y) {
            var result = this.x < x &&
                this.x + this.w > x &&
                this.y < y &&
                this.y + this.h > y;
            return result;
        };
        return Rectangle;
    }());
    Taffy.Rectangle = Rectangle;
})(Taffy || (Taffy = {}));
/////////////////////////////////////////////////////////////////////////
// A library of JavaScript system functions 
/////////////////////////////////////////////////////////////////////////
var Taffy;
(function (Taffy) {
    "use strict";
    var System;
    (function (System) {
        var _debug = false;
        System.Console = (window ? window.console : console);
        /** Clones a data object */
        function clone(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
        System.clone = clone;
        /** Determines if a value is null or undefined, as opposed to falsy */
        function isNullOrUndefined(val) {
            return (val === null || val === void (0));
        }
        System.isNullOrUndefined = isNullOrUndefined;
        /** Determines if a value is undefined, as opposed to falsy */
        function isUndefined(val) {
            return (val === void (0));
        }
        System.isUndefined = isUndefined;
        /** Determines if a value is a number */
        function isNumber(val) {
            return (typeof val === "number");
        }
        System.isNumber = isNumber;
        /** Determines if a value is a string */
        function isString(val) {
            return (typeof val === "string");
        }
        System.isString = isString;
        /** Determines if a number is finite.  If the argument is NaN, positive infinity, or negative infinity, this method returns false. */
        function isFiniteNumber(val) {
            return !isNullOrUndefined(val) && isFinite(val);
        }
        System.isFiniteNumber = isFiniteNumber;
        /** Determines if a number is NaN */
        function isNotANumber(val) {
            return isNaN(val);
        }
        System.isNotANumber = isNotANumber;
        /** Coerces a number to a 32-bit integer (may increase performance of math operations) */
        function toInt32(n) {
            return n | 0;
        }
        System.toInt32 = toInt32;
        /** Puts a function in the event queue to be run.
            *  This will let other events in the queue (such as UI updates) be handled before the function runs.
            */
        function queueFn(callback) {
            System.setTimeout(callback, 0);
        }
        System.queueFn = queueFn;
        /////////////////////////////////////////////////////////////////////////
        // JSON /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /** Converts a value to a json string */
        function toJson(value) {
            return JSON.stringify(value);
        }
        System.toJson = toJson;
        /** Parses a json string to an object of the specified type */
        function parseJson(text) {
            return JSON.parse(text);
        }
        System.parseJson = parseJson;
    })(System = Taffy.System || (Taffy.System = {}));
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    Taffy.version = "1.1";
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    "use strict";
    var LocalStorage;
    (function (LocalStorage) {
        var _isAvailable = Boolean(("localStorage" in window) && window["localStorage"]);
        /** Used to determine if local storage available */
        function isAvailable() {
            return _isAvailable;
        }
        LocalStorage.isAvailable = isAvailable;
    })(LocalStorage = Taffy.LocalStorage || (Taffy.LocalStorage = {}));
    /**
    * Wrapper for localstorage that optionally prefixes all keys with the app name
    */
    var AppStorage = /** @class */ (function () {
        /** @param appName Name of the application(optional) */
        function AppStorage(appName) {
            this._prefix = "";
            this._prefix = (appName ? appName + "." : "");
        }
        Object.defineProperty(AppStorage, "isAvailable", {
            /** Used to determine if local storage available */
            get: function () {
                return LocalStorage.isAvailable();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppStorage.prototype, "prefix", {
            /** Gets the prefix that is prepended to each key */
            get: function () { return this._prefix; },
            enumerable: true,
            configurable: true
        });
        /**
            * Sets the value with the specified key into localStorage.
            * @param key Key
            * @param val Value
            * @param replacer Replacer function to use when stringifying the value
            */
        AppStorage.prototype.setValue = function (key, val, replacer) {
            if (AppStorage.isAvailable) {
                localStorage.setItem(this._prefix + key, JSON.stringify(val, replacer));
            }
            return this;
        };
        /**
            * Gets the value with the specified key from localStorage
            * @returns The value or null if not found
            */
        AppStorage.prototype.getValue = function (key, reviver) {
            if (AppStorage.isAvailable) {
                var item = this.getItem(key);
                return item != null ? JSON.parse(item, reviver) : null;
            }
            return null;
        };
        /**
            * Gets the raw value of an item from localStorage without parsing it
            * @returns The value or null if not found
            */
        AppStorage.prototype.getItem = function (key) {
            return (AppStorage.isAvailable ? localStorage.getItem(this._prefix + key) : null);
        };
        /** Removes the value with the specified key */
        AppStorage.prototype.remove = function (key) {
            if (AppStorage.isAvailable) {
                localStorage.removeItem(this._prefix + key);
            }
            return this;
        };
        /** Removes all items associated with the app */
        AppStorage.prototype.removeAll = function () {
            var keys = this.getKeys();
            for (var i in keys) {
                this.remove(keys[i]);
            }
            return this;
        };
        /**
            * Determines if the specified key has a value in localStorage
            * @returns True if the key has a value
            */
        AppStorage.prototype.contains = function (key) {
            return this.getItem(key) !== null;
        };
        /**
            * Gets the keys from localStorage for the application that optionally match a filter
            * @param filter: (Optional) A function that returns true if the key should be included in the result
            * @returns An array of keys
            */
        AppStorage.prototype.getKeys = function (filter) {
            var keys = [];
            if (AppStorage.isAvailable) {
                for (var key in localStorage) {
                    if (this.isAppKey(key)) {
                        // Remove the prefix from the key
                        if (this._prefix)
                            key = key.slice(this._prefix.length);
                        // Check the filter
                        if (!filter || filter(key)) {
                            keys.push(key);
                        }
                    }
                }
            }
            return keys;
        };
        AppStorage.prototype.isAppKey = function (key) {
            if (this._prefix) {
                return key.indexOf(this._prefix) === 0;
            }
            return true;
        };
        /** Adds a storage event handler */
        AppStorage.prototype.addStorageListener = function (callback, useCapture) {
            addEventListener("storage", callback, useCapture);
            return this;
        };
        return AppStorage;
    }());
    Taffy.AppStorage = AppStorage;
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    "use strict";
    var AppStorageAsync = /** @class */ (function () {
        /** @param appName Name of the application(optional) */
        function AppStorageAsync(appName) {
            this._prefix = "";
            this._prefix = (appName ? appName + "." : "");
        }
        Object.defineProperty(AppStorageAsync, "isAvailable", {
            /** Used to determine if local storage available */
            get: function () {
                return Taffy.LocalStorage.isAvailable();
            },
            enumerable: true,
            configurable: true
        });
        /** Gets the prefix that is prepended to each key */
        AppStorageAsync.prototype.prefix = function () { return this._prefix; };
        /**
            * Sets the value with the specified key into localStorage.
            * @param key Key
            * @param val Value
            * @param callback Optional function to call when saved
            * @param replacer Optional replacer function to use when stringifying the value
            */
        AppStorageAsync.prototype.setValue = function (key, val, callback, replacer) {
            if (AppStorageAsync.isAvailable) {
                localStorage.setItem(this._prefix + key, JSON.stringify(val, replacer));
            }
            if (callback)
                callback();
            return this;
        };
        /**
            * Gets the value with the specified key from localStorage
            * @key Key
            * @callback Fuction to call with the value. Value will be null if not found.
            * @reviver Optional reviver to use when parsing the JSON
            */
        AppStorageAsync.prototype.getValue = function (key, callback, reviver) {
            if (AppStorageAsync.isAvailable) {
                var item = this.getRawItem(key);
                callback(item != null ? JSON.parse(item, reviver) : null);
            }
            else {
                callback(null);
            }
            return this;
        };
        /**
            * Sets the value with the specified key into localStorage.
            * Note: For localstorage this is the same as calling setValue without a replacer.
            * @param key Key
            * @param val Value
            * @param callback Optional function to call when saved
            * @param replacer Optional replacer function to use when stringifying the value
            */
        AppStorageAsync.prototype.setItem = function (key, val, callback) {
            return this.setValue(key, val, callback);
        };
        /**
            * Gets the raw value of an item from localStorage without parsing it.
            * Note: For localstorage this is the same as calling getValue without a reviver.
            * @callback Fuction to call with the item. Value will be null if not found.
            */
        AppStorageAsync.prototype.getItem = function (key, callback) {
            return this.getValue(key, callback);
        };
        /** Removes the value with the specified key */
        AppStorageAsync.prototype.remove = function (key, callback) {
            if (AppStorageAsync.isAvailable) {
                localStorage.removeItem(this._prefix + key);
            }
            if (callback)
                callback();
            return this;
        };
        /** Removes all items associated with the app */
        AppStorageAsync.prototype.removeAll = function (callback) {
            var _this = this;
            this.getKeys(function (keys) {
                for (var i in keys) {
                    _this.remove(keys[i]);
                }
                if (callback)
                    callback();
            });
            return this;
        };
        /**
            * Determines if the specified key has a value in localStorage
            * @callback Fuction to call with the result.
            */
        AppStorageAsync.prototype.contains = function (key, callback) {
            var item;
            if (AppStorageAsync.isAvailable) {
                item = this.getRawItem(key);
            }
            callback(item !== null);
            return this;
        };
        /**
            * Gets the keys from localStorage for the application that optionally match a filter
            * @param filter: (Optional) A function that returns true if the key should be included in the result
            * @callback Fuction to call with the list of keys. If none are found the list will be empty (not null).
            */
        AppStorageAsync.prototype.getKeys = function (callback, filter) {
            var keys = [];
            if (AppStorageAsync.isAvailable) {
                for (var key in localStorage) {
                    if (this.isAppKey(key)) {
                        // Remove the prefix from the key
                        if (this._prefix)
                            key = key.slice(this._prefix.length);
                        // Check the filter
                        if (!filter || filter(key)) {
                            keys.push(key);
                        }
                    }
                }
            }
            callback(keys);
            return this;
        };
        AppStorageAsync.prototype.getRawItem = function (key) {
            return localStorage.getItem(this._prefix + key);
        };
        AppStorageAsync.prototype.isAppKey = function (key) {
            if (this._prefix) {
                return key.indexOf(this._prefix) === 0;
            }
            return true;
        };
        /** Adds a storage event handler */
        AppStorageAsync.prototype.addStorageListener = function (callback) {
            addEventListener("storage", function (ev) {
                callback({
                    key: ev.key,
                    oldValue: ev.oldValue,
                    newValue: ev.newValue,
                    storageArea: "localstorage",
                });
            });
            return this;
        };
        return AppStorageAsync;
    }());
    Taffy.AppStorageAsync = AppStorageAsync;
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    "use strict";
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    "use strict";
    // Used to test for undefined
    var undef = void (0);
    /**
     * Wrapper and high level drawing methods for HTMLCanvasElement 2D context
     */
    var CanvasContext2D = /** @class */ (function () {
        function CanvasContext2D(_canvas) {
            this._canvas = _canvas;
            this._context = _canvas.getContext("2d");
        }
        Object.defineProperty(CanvasContext2D.prototype, "context", {
            get: function () {
                return this._context;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CanvasContext2D.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        ///////////////////////////////////////////////////////////////////////////////
        // Canvas methods
        ///////////////////////////////////////////////////////////////////////////////
        CanvasContext2D.prototype.toDataUrl = function () {
            return this._canvas.toDataURL();
        };
        CanvasContext2D.prototype.fillStyle = function (style) {
            if (style === undef) {
                return this.context.fillStyle;
            }
            this.context.fillStyle = style;
            return this;
        };
        CanvasContext2D.prototype.strokeStyle = function (style) {
            if (style === undef) {
                return this.context.strokeStyle;
            }
            this.context.strokeStyle = style;
            return this;
        };
        CanvasContext2D.prototype.lineWidth = function (width) {
            if (width === undef) {
                return this.context.lineWidth;
            }
            this.context.lineWidth = width;
            return this;
        };
        CanvasContext2D.prototype.lineCap = function (lineCap) {
            if (lineCap === undef) {
                return this.context.lineCap;
            }
            this.context.lineCap = lineCap;
            return this;
        };
        CanvasContext2D.prototype.lineJoin = function (join) {
            if (join === undef) {
                return this.context.lineJoin;
            }
            this.context.lineJoin = join;
            return this;
        };
        CanvasContext2D.prototype.miterLimit = function (limit) {
            if (limit === undef) {
                return this.context.miterLimit;
            }
            this.context.miterLimit = limit;
            return this;
        };
        CanvasContext2D.prototype.lineDash = function (sequence) {
            if ("setLineDash" in this.context) {
                if (sequence === undef) {
                    return this.context.getLineDash();
                }
                this.context["setLineDash"](sequence);
                return this;
            }
            else
                console.log(function () { return "setLineDash not supported by the browser"; });
            return null;
        };
        CanvasContext2D.prototype.shadowColor = function (color) {
            if (color === undef) {
                return this.context.shadowColor;
            }
            this.context.shadowColor = color;
            return this;
        };
        CanvasContext2D.prototype.shadowBlur = function (size) {
            if (size === undef) {
                return this.context.shadowBlur;
            }
            this.context.shadowBlur = size;
            return this;
        };
        CanvasContext2D.prototype.shadowOffsetX = function (offset) {
            if (offset === undef) {
                return this.context.shadowOffsetX;
            }
            this.context.shadowOffsetX = offset;
            return this;
        };
        CanvasContext2D.prototype.shadowOffsetY = function (offset) {
            if (offset === undef) {
                return this.context.shadowOffsetY;
            }
            this.context.shadowOffsetY = offset;
            return this;
        };
        CanvasContext2D.prototype.shadowOffset = function (offsetX, offsetY) {
            if (offsetX === undef) {
                return { offsetX: this.shadowOffsetX(), offsetY: this.shadowOffsetY() };
            }
            this.shadowOffsetX(offsetX);
            this.shadowOffsetY(offsetY === undef ? offsetX : offsetY);
            return this;
        };
        /** Sets all of the shadow styles in one call */
        CanvasContext2D.prototype.shadowStyle = function (color, offsetX, offsetY, blur) {
            this.context.shadowColor = color;
            this.context.shadowOffsetX = offsetX;
            this.context.shadowOffsetY = offsetY;
            this.context.shadowBlur = blur;
            return this;
        };
        CanvasContext2D.prototype.font = function (font) {
            if (font === undef) {
                return this.context.font;
            }
            this.context.font = font;
            return this;
        };
        CanvasContext2D.prototype.textAlign = function (alignment) {
            if (alignment === undef) {
                return this.context.textAlign;
            }
            this.context.textAlign = alignment;
            return this;
        };
        CanvasContext2D.prototype.textBaseline = function (baseline) {
            if (baseline === undef) {
                return this.context.textBaseline;
            }
            this.context.textBaseline = baseline;
            return this;
        };
        CanvasContext2D.prototype.globalAlpha = function (alpha) {
            if (alpha === undef) {
                return this.context.globalAlpha;
            }
            this.context.globalAlpha = alpha;
            return this;
        };
        CanvasContext2D.prototype.globalCompositeOperation = function (operation) {
            if (operation === undef) {
                return this.context.globalCompositeOperation;
            }
            this.context.globalCompositeOperation = operation;
            return this;
        };
        ///////////////////////////////////////////////////////////////////////////
        // Clearing methods
        ///////////////////////////////////////////////////////////////////////////
        /** Clears the entire canvas */
        CanvasContext2D.prototype.clear = function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return this;
        };
        /** Clears a portion of the canvas */
        CanvasContext2D.prototype.clearRect = function (x, y, w, h) {
            this.context.clearRect(x, y, w, h);
            return this;
        };
        ///////////////////////////////////////////////////////////////////////////
        // Context state methods
        ///////////////////////////////////////////////////////////////////////////
        /** Pushes the current state of the context */
        CanvasContext2D.prototype.save = function () {
            this.context.save();
            return this;
        };
        /** Restores the state of the context from the last save */
        CanvasContext2D.prototype.restore = function () {
            this.context.restore();
            return this;
        };
        CanvasContext2D.prototype.scale = function (xs, ys) {
            this.context.scale(xs, ys || xs);
            return this;
        };
        /** moves the origin to the specified location */
        CanvasContext2D.prototype.translate = function (x, y) {
            this.context.translate(x, y);
            return this;
        };
        /** Rotates the canvas */
        CanvasContext2D.prototype.rotate = function (radians) {
            this.context.rotate(radians);
            return this;
        };
        /**
            * Sets the current transformation matrix
            * m11 Scales the drawing horizontally
            * m12 Skews the drawing horizontally
            * m21 Scales the drawing vertically
            * m22 Skews the drawing vertically
            * dx Moves the the drawing horizontally
            * dy Moves the the drawing vertically
        */
        CanvasContext2D.prototype.transform = function (m11, m12, m21, m22, dx, dy) {
            this.context.transform(m11, m12, m21, m22, dx, dy);
            return this;
        };
        /** Resets to the identity matrix then applies the new transformation matrix */
        CanvasContext2D.prototype.setTransform = function (m11, m12, m21, m22, dx, dy) {
            this.context.setTransform(m11, m12, m21, m22, dx, dy);
            return this;
        };
        ///////////////////////////////////////////////////////////////////////////
        // Image methods
        ///////////////////////////////////////////////////////////////////////////
        /**
            * Draws an image to the canvas and optionally scales it
            * @param image
            * @param x Destination x
            * @param y Destination y
            * @param w Width to scale image to (optional)
            * @param h Height to scale image to (optional)
            */
        CanvasContext2D.prototype.drawImage = function (image, x, y, w, h) {
            if (w === void 0) { w = image.width; }
            if (h === void 0) { h = image.height; }
            this.context.drawImage(image, x, y, w, h);
            return this;
        };
        /**
            * Draws a portion of an image to the canvas
            * @param image The source image
            * @param sx Clip area x
            * @param sy Clip area y
            * @param sw Clip area w
            * @param sh Clip area h
            * @param x  Destination x
            * @param y  Destination y
            * @param w  Destination w (optional, default is clip area w)
            * @param h  Destination h (optional, default is clip area h)
            */
        CanvasContext2D.prototype.drawClippedImage = function (image, sx, sy, sw, sh, x, y, w, h) {
            if (w === void 0) { w = sw; }
            if (h === void 0) { h = sh; }
            this.context.drawImage(image, sx, sy, sw, sh, x, y, w, h);
            return this;
        };
        /**
            * Draws an image rotating about its center and optionally scales it
            * @param image
            * @param x Destination x
            * @param y Destination y
            * @param angle Angle in radians (0 to 2PI)
            * @param w Width to scale image to (optional)
            * @param h Height to scale image to (optional)
            */
        CanvasContext2D.prototype.drawRotatedImage = function (image, x, y, angle, width, height) {
            if (width === void 0) { width = image.width; }
            if (height === void 0) { height = image.height; }
            this.context.save();
            // Move to where we want to draw the image
            this.context.translate(x, y);
            this.context.rotate(angle);
            // Draw image at its center
            var cx = ((width || image.width) / 2);
            var cy = ((height || image.height) / 2);
            this.context.drawImage(image, -cx, -cy, width, height);
            this.context.restore();
            return this;
        };
        ///////////////////////////////////////////////////////////////////////////
        // Line methods
        ///////////////////////////////////////////////////////////////////////////
        CanvasContext2D.prototype.drawLine = function (x1, y1, x2, y2) {
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.stroke();
            return this;
        };
        /** Draws the lines defined by the set of coordinates
            * @param coords An array containing sets of x and y coordinates (ex: [x1, y1, x2, y2, ...])
            */
        CanvasContext2D.prototype.drawLines = function () {
            var coords = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                coords[_i] = arguments[_i];
            }
            if (this.definePolyline(coords)) {
                this.context.stroke();
            }
            return this;
        };
        ///////////////////////////////////////////////////////////////////////////
        // Circle/Arc methods
        ///////////////////////////////////////////////////////////////////////////
        CanvasContext2D.prototype.drawCircle = function (x, y, radius) {
            this.beginPath()
                .arc(x, y, radius, 0, CanvasContext2D.TWO_PI, true)
                .closePath()
                .stroke();
            return this;
        };
        CanvasContext2D.prototype.fillCircle = function (x, y, radius) {
            this.beginPath()
                .arc(x, y, radius, 0, CanvasContext2D.TWO_PI, true)
                .closePath()
                .fill();
            return this;
        };
        CanvasContext2D.prototype.drawArc = function (x, y, radius, start, end, anticlockwise) {
            if (anticlockwise === void 0) { anticlockwise = false; }
            this.beginPath()
                .arc(x, y, radius, start, end, anticlockwise)
                .stroke();
            return this;
        };
        CanvasContext2D.prototype.fillArc = function (x, y, radius, start, end, anticlockwise) {
            if (anticlockwise === void 0) { anticlockwise = false; }
            this.beginPath()
                .arc(x, y, radius, start, end, anticlockwise)
                .fill();
            return this;
        };
        CanvasContext2D.prototype.drawEllipse = function (x, y, rx, ry) {
            if (rx === ry)
                return this.drawCircle(x, y, rx);
            this.defineEllipse(x, y, rx, ry)
                .stroke();
            return this;
        };
        CanvasContext2D.prototype.fillEllipse = function (x, y, rx, ry) {
            if (rx === ry)
                return this.fillCircle(x, y, rx);
            this.defineEllipse(x, y, rx, ry)
                .fill();
            return this;
        };
        ///////////////////////////////////////////////////////////////////////////
        // Rectangle methods
        ///////////////////////////////////////////////////////////////////////////
        CanvasContext2D.prototype.drawRect = function (x, y, w, h) {
            this.context.strokeRect(x, y, w, h);
            return this;
        };
        CanvasContext2D.prototype.fillRect = function (x, y, w, h) {
            this.context.fillRect(x, y, w, h);
            return this;
        };
        CanvasContext2D.prototype.drawRoundedRect = function (x, y, w, h, r) {
            if (typeof r === "number") {
                r = [r, r, r, r];
            }
            this.defineRoundedRect(x, y, w, h, r);
            this.context.stroke();
            return this;
        };
        CanvasContext2D.prototype.fillRoundedRect = function (x, y, w, h, r) {
            if (typeof r === "number") {
                r = [r, r, r, r];
            }
            this.defineRoundedRect(x, y, w, h, r);
            this.context.fill();
            return this;
        };
        ///////////////////////////////////////////////////////////////////////////
        // Shape methods
        ///////////////////////////////////////////////////////////////////////////
        /** Draws a shape defined by the set of coordinates
            * @param coords Array of x and y coordinates (ex: [x1, y1, x2, y2, ...])
            */
        CanvasContext2D.prototype.drawShape = function () {
            var coords = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                coords[_i] = arguments[_i];
            }
            if (this.definePolyline(coords)) {
                this.context.closePath();
                this.context.stroke();
            }
            return this;
        };
        /** Fills a shape defined by the set of coordinates
            * @param coords Array of x and y coordinates (ex: [x1, y1, x2, y2, ...])
            */
        CanvasContext2D.prototype.fillShape = function () {
            var coords = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                coords[_i] = arguments[_i];
            }
            if (this.definePolyline(coords)) {
                this.context.closePath();
                this.context.fill();
            }
            return this;
        };
        ///////////////////////////////////////////////////////////////////////////
        // Text methods
        ///////////////////////////////////////////////////////////////////////////
        CanvasContext2D.prototype.drawText = function (text, x, y, maxWidth) {
            if (maxWidth === undef)
                this.context.strokeText(text, x, y);
            else
                this.context.strokeText(text, x, y, maxWidth);
            return this;
        };
        CanvasContext2D.prototype.fillText = function (text, x, y, maxWidth) {
            if (maxWidth === undef)
                this.context.fillText(text, x, y);
            else
                this.context.fillText(text, x, y, maxWidth);
            return this;
        };
        CanvasContext2D.prototype.measureText = function (text) {
            return this.context.measureText(text).width;
        };
        CanvasContext2D.prototype.createLinearGradient = function (x0, y0, x1, y1) {
            var colorsOrStops = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                colorsOrStops[_i - 4] = arguments[_i];
            }
            var gradient = this.context.createLinearGradient(x0, y0, x1, y1);
            return this.addGradientColorStops.apply(this, [gradient].concat(colorsOrStops));
        };
        CanvasContext2D.prototype.createRadialGradient = function (x0, y0, r0, x1, y1, r1) {
            var colorsOrStops = [];
            for (var _i = 6; _i < arguments.length; _i++) {
                colorsOrStops[_i - 6] = arguments[_i];
            }
            var gradient = this.context.createRadialGradient(x0, y0, r0, x1, y1, r1);
            return this.addGradientColorStops.apply(this, [gradient].concat(colorsOrStops));
        };
        /**
            * Cerates a pattern from an image
            * @param image
            * @param repetition Type of repetition (Use CanvasContext2D.Repetition), default is repeat.
            */
        CanvasContext2D.prototype.createPattern = function (image, repetition) {
            if (repetition === void 0) { repetition = CanvasContext2D.Repetition.repeat; }
            return this.context.createPattern(image, repetition);
        };
        CanvasContext2D.prototype.drawLinearGradient = function (x, y, w, h, angle) {
            var colorsOrStops = [];
            for (var _i = 5; _i < arguments.length; _i++) {
                colorsOrStops[_i - 5] = arguments[_i];
            }
            if (angle < 0 || angle > CanvasContext2D.PI_OVER_2) {
                throw new Error("CanvasContext2D.drawLinearGradient angle must be between 0 and PI/2");
            }
            var dx = Math.cos(angle);
            var dy = Math.sin(angle);
            var gradient = this.createLinearGradient.apply(this, [x, y, x + dx * w, y + dy * h].concat(colorsOrStops));
            this.save()
                .fillStyle(gradient)
                .fillRect(x, y, w, h)
                .restore();
            return this;
        };
        CanvasContext2D.prototype.drawRadialGradient = function (x, y, r) {
            var colorsOrStops = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                colorsOrStops[_i - 3] = arguments[_i];
            }
            var gradient = this.createRadialGradient.apply(this, [x, y, r, x, y, 0].concat(colorsOrStops));
            this.save()
                .fillStyle(gradient)
                .fillCircle(x, y, r)
                .restore();
            return this;
        };
        CanvasContext2D.prototype.drawPattern = function (x, y, w, h, imageOrPattern, repetition) {
            if (repetition === void 0) { repetition = CanvasContext2D.Repetition.repeat; }
            var pat = (imageOrPattern instanceof CanvasPattern ? imageOrPattern : this.createPattern(imageOrPattern, repetition));
            this.save()
                .fillStyle(pat)
                .translate(x, y)
                .fillRect(0, 0, w, h)
                .restore();
            return this;
        };
        CanvasContext2D.prototype.createImageData = function (imageDataOrW, h) {
            if (h === undef) {
                return this.context.createImageData(imageDataOrW);
            }
            else {
                return this.context.createImageData(imageDataOrW, h);
            }
        };
        CanvasContext2D.prototype.getImageData = function (sx, sy, sw, sh) {
            return this.context.getImageData(sx || 0, sy || 0, sw || this.canvas.width, sh || this.canvas.height);
        };
        CanvasContext2D.prototype.putImageData = function (imageData, x, y, destX, destY, destW, destH) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            // Passing in undefined values doesn't work so check params
            if (destX === undef) {
                this.context.putImageData(imageData, x, y);
            }
            else if (destW === undef) {
                this.context.putImageData(imageData, x, y, destX, destY);
            }
            else {
                this.context.putImageData(imageData, x, y, destX, destY, destW, destH);
            }
            return this;
        };
        ///////////////////////////////////////////////////////////////////////////
        // Primitive Path methods
        ///////////////////////////////////////////////////////////////////////////
        CanvasContext2D.prototype.rect = function (x, y, w, h) {
            this.context.rect(x, y, w, h);
            return this;
        };
        CanvasContext2D.prototype.fill = function () {
            this.context.fill();
            return this;
        };
        CanvasContext2D.prototype.stroke = function () {
            this.context.stroke();
            return this;
        };
        CanvasContext2D.prototype.beginPath = function () {
            this.context.beginPath();
            return this;
        };
        CanvasContext2D.prototype.closePath = function () {
            this.context.closePath();
            return this;
        };
        CanvasContext2D.prototype.moveTo = function (x, y) {
            this.context.moveTo(x, y);
            return this;
        };
        CanvasContext2D.prototype.lineTo = function (x, y) {
            this.context.lineTo(x, y);
            return this;
        };
        CanvasContext2D.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
            this.context.quadraticCurveTo(cpx, cpy, x, y);
            return this;
        };
        CanvasContext2D.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            return this;
        };
        CanvasContext2D.prototype.arc = function (x, y, r, startRads, endRads, anticlockwise) {
            this.context.arc(x, y, r, startRads, endRads, anticlockwise);
            return this;
        };
        CanvasContext2D.prototype.arcTo = function (x1, y1, x2, y2, r) {
            this.context.arcTo(x1, y1, x2, y2, r);
            return this;
        };
        CanvasContext2D.prototype.setClipRect = function (x, y, w, h) {
            this.beginPath()
                .rect(x, y, w, h)
                .clip();
            return this;
        };
        CanvasContext2D.prototype.clip = function () {
            this.context.clip();
            return this;
        };
        CanvasContext2D.prototype.isPointInPath = function (x, y) {
            return this.context.isPointInPath(x, y);
        };
        ///////////////////////////////////////////////////////////////////////////
        // Private methods
        ///////////////////////////////////////////////////////////////////////////
        /**
            * Defines the path for a rounded rectangle
            * @param x The top left x coordinate
            * @param y The top left y coordinate
            * @param width The width of the rectangle
            * @param height The height of the rectangle
            * @param radii The radii of each corner (clockwise from upper-left)
            */
        CanvasContext2D.prototype.defineRoundedRect = function (x, y, w, h, radii) {
            this.context.beginPath();
            this.context.moveTo(x + radii[0], y);
            this.context.lineTo(x + w - radii[1], y);
            this.context.quadraticCurveTo(x + w, y, x + w, y + radii[1]);
            this.context.lineTo(x + w, y + h - radii[2]);
            this.context.quadraticCurveTo(x + w, y + h, x + w - radii[2], y + h);
            this.context.lineTo(x + radii[3], y + h);
            this.context.quadraticCurveTo(x, y + h, x, y + h - radii[3]);
            this.context.lineTo(x, y + radii[0]);
            this.context.quadraticCurveTo(x, y, x + radii[0], y);
            this.context.closePath();
            return this;
        };
        /** Defines the path for an ellipse */
        CanvasContext2D.prototype.defineEllipse = function (x, y, rx, ry) {
            var radius = Math.max(rx, ry);
            var scaleX = rx / radius;
            var scaleY = ry / radius;
            this.context.save();
            this.context.translate(x, y);
            this.context.scale(scaleX, scaleY);
            this.context.beginPath();
            this.context.arc(0, 0, radius, 0, CanvasContext2D.TWO_PI, true);
            this.context.closePath();
            this.context.restore();
            return this;
        };
        /** Defines the path for a set of coordinates
            * @param {number[]} coords Set of x and y coordinates
            */
        CanvasContext2D.prototype.definePolyline = function (coords) {
            /// Draws an set of lines without stroking or filling
            if (coords.length > 2) {
                this.context.beginPath();
                this.context.moveTo(coords[0], coords[1]);
                for (var i = 2; i < coords.length; i += 2) {
                    this.context.lineTo(coords[i], coords[i + 1]);
                }
                return true;
            }
            return false;
        };
        //private addGradientColorStops(gradient: CanvasGradient, color1: string, color2: string): CanvasGradient;
        //private addGradientColorStops(gradient: CanvasGradient, ...colorsOrStops: CanvasContext2D.IColorStop[]): CanvasGradient;
        CanvasContext2D.prototype.addGradientColorStops = function (gradient) {
            var colorsOrStops = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                colorsOrStops[_i - 1] = arguments[_i];
            }
            if (colorsOrStops && colorsOrStops.length > 0) {
                if (colorsOrStops.length === 2 && typeof colorsOrStops[0] === "string") {
                    gradient.addColorStop(0, colorsOrStops[0]);
                    gradient.addColorStop(1, colorsOrStops[1]);
                }
                else {
                    for (var i = 0; i < colorsOrStops.length; i++) {
                        var stop = colorsOrStops[i];
                        gradient.addColorStop(stop.offset, stop.color);
                    }
                }
            }
            return gradient;
        };
        ///////////////////////////////////////////////////////////////////////////
        // Static methods
        ///////////////////////////////////////////////////////////////////////////
        /**
            * Converts degrees to radians
            * @param degrees
            */
        CanvasContext2D.toRadians = function (degrees) {
            return CanvasContext2D.PI_OVER_180 * degrees;
        };
        ///////////////////////////////////////////////////////////////////////////////
        // Constants
        ///////////////////////////////////////////////////////////////////////////////
        CanvasContext2D.PI_OVER_180 = Math.PI / 180;
        CanvasContext2D.PI_OVER_2 = Math.PI / 2;
        CanvasContext2D.TWO_PI = 2 * Math.PI;
        CanvasContext2D.TAU = 2 * Math.PI;
        ///////////////////////////////////////////////////////////////////////////
        // Enums
        ///////////////////////////////////////////////////////////////////////////
        CanvasContext2D.TextBaseline = {
            top: "top",
            middle: "middle",
            bottom: "bottom",
            alphabetic: "alphabetic",
            hanging: "hanging"
        };
        CanvasContext2D.TextAlign = {
            left: "left",
            right: "right",
            center: "center",
            start: "start",
            end: "end"
        };
        CanvasContext2D.Repetition = {
            repeat: "repeat",
            repeatX: "repeat-x",
            repeatY: "repeat-y",
            noRepeat: "no-repeat"
        };
        CanvasContext2D.CompositeOperation = {
            sourceOver: "source-over",
            sourceAtop: "source-atop",
            sourceIn: "source-in",
            sourceOut: "source-out",
            destinationOver: "destination-over",
            destinationAtop: "destination-atop",
            destinationIn: "destination-in",
            destinationOut: "destination-out",
            lighter: "lighter",
            copy: "copy",
            xor: "xor"
        };
        CanvasContext2D.LineCap = {
            butt: "butt",
            round: "round",
            square: "square"
        };
        CanvasContext2D.LineJoin = {
            bevel: "bevel",
            round: "round",
            miter: "miter"
        };
        return CanvasContext2D;
    }());
    Taffy.CanvasContext2D = CanvasContext2D;
})(Taffy || (Taffy = {}));
///<reference path='../core/keycodes.ts'/>
///<reference path='../core/interfaces.ts'/>
var Taffy;
(function (Taffy) {
    "use strict";
    var Events;
    (function (Events) {
        var ElementEvent = /** @class */ (function () {
            function ElementEvent(element, baseEvent) {
                this.element = element;
                this.baseEvent = baseEvent;
            }
            ElementEvent.prototype.stopPropagation = function () { this.baseEvent.stopPropagation(); return this; };
            ElementEvent.prototype.preventDefault = function () { this.baseEvent.preventDefault(); return this; };
            return ElementEvent;
        }());
        Events.ElementEvent = ElementEvent;
        /** Wraps a pointer event to provide element based positions */
        var ElementPointerEvent = /** @class */ (function (_super) {
            __extends(ElementPointerEvent, _super);
            /**
             * @param element The element the event ocurred on
             * @param event The mouse event
             */
            function ElementPointerEvent(element, event) {
                var _this = _super.call(this, element, event) || this;
                var pos = getElementPosition(element);
                _this.elementX = event.pageX - pos.left;
                _this.elementY = event.pageY - pos.top;
                return _this;
            }
            Object.defineProperty(ElementPointerEvent.prototype, "isPrimary", {
                get: function () {
                    return this.baseEvent.isPrimary;
                },
                enumerable: true,
                configurable: true
            });
            return ElementPointerEvent;
        }(ElementEvent));
        Events.ElementPointerEvent = ElementPointerEvent;
        /** Wraps a mouse event to provide element based positions */
        var ElementMouseEvent = /** @class */ (function (_super) {
            __extends(ElementMouseEvent, _super);
            /**
             * @param element The element the event ocurred on
             * @param event The mouse event
             */
            function ElementMouseEvent(element, event) {
                var _this = _super.call(this, element, event) || this;
                var pos = getElementPosition(element);
                _this.elementX = event.pageX - pos.left;
                _this.elementY = event.pageY - pos.top;
                return _this;
            }
            return ElementMouseEvent;
        }(ElementEvent));
        Events.ElementMouseEvent = ElementMouseEvent;
        /** Wraps a touch event to provide element based positions */
        var ElementTouchEvent = /** @class */ (function (_super) {
            __extends(ElementTouchEvent, _super);
            /**
             * @param element The element the event ocurred on
             * @param event The touch event
             */
            function ElementTouchEvent(element, event) {
                var _this = _super.call(this, element, event) || this;
                /** Set of all touches positioned to the element */
                _this.elementPoints = [];
                if (event.touches && event.touches.length > 0) {
                    var pos = getElementPosition(element);
                    var len = event.touches.length;
                    for (var i = 0; i < len; i++) {
                        var t = event.touches.item(i);
                        var pt = {
                            x: t.pageX - pos.left,
                            y: t.pageY - pos.top
                        };
                        _this.elementPoints.push(pt);
                        if (i === 0) {
                            _this.elementX = pt.x;
                            _this.elementY = pt.y;
                        }
                    }
                }
                return _this;
            }
            return ElementTouchEvent;
        }(ElementEvent));
        Events.ElementTouchEvent = ElementTouchEvent;
        /** Wraps a keyboard event to provide key code */
        var ElementKeyboardEvent = /** @class */ (function (_super) {
            __extends(ElementKeyboardEvent, _super);
            function ElementKeyboardEvent(element, event) {
                return _super.call(this, element, event) || this;
            }
            Object.defineProperty(ElementKeyboardEvent.prototype, "keyCode", {
                get: function () {
                    return this.baseEvent.which;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ElementKeyboardEvent.prototype, "keyNumber", {
                get: function () {
                    return this.baseEvent.which;
                },
                enumerable: true,
                configurable: true
            });
            return ElementKeyboardEvent;
        }(ElementEvent));
        Events.ElementKeyboardEvent = ElementKeyboardEvent;
        /////////////////////////////////////////////////////////////////////////
        // Click ///////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /** Adds a click event handler */
        function onClick(element, callback, useCapture) {
            return addMouseEventListener("click", element, callback, useCapture);
        }
        Events.onClick = onClick;
        /** Adds a dblclick event handler */
        function onDblClick(element, callback, useCapture) {
            return addMouseEventListener("dblclick", element, callback, useCapture);
        }
        Events.onDblClick = onDblClick;
        /////////////////////////////////////////////////////////////////////////
        // Pointer///////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /** Adds a mousedown event handler */
        function onPointerDown(element, callback, useCapture) {
            return addPointerEventListener("pointerdown", element, callback, useCapture);
        }
        Events.onPointerDown = onPointerDown;
        /** Adds a mouseup event handler */
        function onPointerUp(element, callback, useCapture) {
            return addPointerEventListener("pointerup", element, callback, useCapture);
        }
        Events.onPointerUp = onPointerUp;
        /** Adds a mousemove event handler */
        function onPointerMove(element, callback, useCapture) {
            return addPointerEventListener("pointermove", element, callback, useCapture);
        }
        Events.onPointerMove = onPointerMove;
        /** Adds a mouseout event handler */
        function onPointerOut(element, callback, useCapture) {
            return addPointerEventListener("pointerout", element, callback, useCapture);
        }
        Events.onPointerOut = onPointerOut;
        /** Adds a mouseover event handler */
        function onPointerOver(element, callback, useCapture) {
            return addPointerEventListener("pointerover", element, callback, useCapture);
        }
        Events.onPointerOver = onPointerOver;
        /////////////////////////////////////////////////////////////////////////
        // Mouse ///////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /** Adds a mousedown event handler */
        function onMouseDown(element, callback, useCapture) {
            return addMouseEventListener("mousedown", element, callback, useCapture);
        }
        Events.onMouseDown = onMouseDown;
        /** Adds a mouseup event handler */
        function onMouseUp(element, callback, useCapture) {
            return addMouseEventListener("mouseup", element, callback, useCapture);
        }
        Events.onMouseUp = onMouseUp;
        /** Adds a mousemove event handler */
        function onMouseMove(element, callback, useCapture) {
            return addMouseEventListener("mousemove", element, callback, useCapture);
        }
        Events.onMouseMove = onMouseMove;
        /** Adds a mouseout event handler */
        function onMouseOut(element, callback, useCapture) {
            return addMouseEventListener("mouseout", element, callback, useCapture);
        }
        Events.onMouseOut = onMouseOut;
        /** Adds a mouseover event handler */
        function onMouseOver(element, callback, useCapture) {
            return addMouseEventListener("mouseover", element, callback, useCapture);
        }
        Events.onMouseOver = onMouseOver;
        /////////////////////////////////////////////////////////////////////////
        // touch /////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /** Adds a touchstart event handler */
        function onTouchStart(element, callback, useCapture) {
            return addTouchEventListener("touchstart", element, callback, useCapture);
        }
        Events.onTouchStart = onTouchStart;
        /** Adds a touchend event handler */
        function onTouchEnd(element, callback, useCapture) {
            return addTouchEventListener("touchend", element, callback, useCapture);
        }
        Events.onTouchEnd = onTouchEnd;
        /** Adds a touchmove event handler */
        function onTouchMove(element, callback, useCapture) {
            return addTouchEventListener("touchmove", element, callback, useCapture);
        }
        Events.onTouchMove = onTouchMove;
        /** Adds a touchcancel event handler */
        function onTouchCancel(element, callback, useCapture) {
            return addTouchEventListener("touchcancel", element, callback, useCapture);
        }
        Events.onTouchCancel = onTouchCancel;
        /////////////////////////////////////////////////////////////////////////
        // keyboard /////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /** Adds a keypress event handler */
        function onKeyPress(element, callback, useCapture) {
            return addKeyboardEventListener("keypress", element, callback, useCapture);
        }
        Events.onKeyPress = onKeyPress;
        /** Adds a keydown event handler */
        function addKeyDownListener(element, callback, useCapture) {
            return addKeyboardEventListener("keydown", element, callback, useCapture);
        }
        Events.addKeyDownListener = addKeyDownListener;
        /** Adds a keyup event handler */
        function addKeyUpListener(element, callback, useCapture) {
            return addKeyboardEventListener("keyup", element, callback, useCapture);
        }
        Events.addKeyUpListener = addKeyUpListener;
        /////////////////////////////////////////////////////////////////////////
        // Transition ///////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /** Adds a transitionend event handler */
        function onTransitionEnd(element, callback, useCapture) {
            element.addEventListener("webkitTransitionEnd", function (evt) { return callback(new ElementEvent(element, evt)); }, useCapture);
            element.addEventListener("transitionend", function (evt) { return callback(new ElementEvent(element, evt)); }, useCapture);
            return this;
        }
        Events.onTransitionEnd = onTransitionEnd;
        /////////////////////////////////////////////////////////////////////////
        // Private //////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        function getElementPosition(element) {
            var rect = element.getBoundingClientRect();
            return {
                left: rect.left + window.pageXOffset,
                top: rect.top + window.pageYOffset
            };
        }
        /** Adds a pointer event handler */
        function addPointerEventListener(eventName, element, callback, useCapture) {
            element.addEventListener(eventName, function (evt) { return callback(new ElementPointerEvent(element, evt)); }, useCapture);
            return element;
        }
        /** Adds a mouse event handler */
        function addMouseEventListener(eventName, element, callback, useCapture) {
            element.addEventListener(eventName, function (evt) { return callback(new ElementMouseEvent(element, evt)); }, useCapture);
            return element;
        }
        /** Adds a touch event handler */
        function addTouchEventListener(eventName, element, callback, useCapture) {
            element.addEventListener(eventName, function (evt) { return callback(new ElementTouchEvent(element, evt)); }, useCapture);
            return element;
        }
        /** Adds a mouse event handler */
        function addKeyboardEventListener(eventName, element, callback, useCapture) {
            element.addEventListener(eventName, function (evt) { return callback(new ElementKeyboardEvent(element, evt)); }, useCapture);
            return element;
        }
    })(Events = Taffy.Events || (Taffy.Events = {}));
})(Taffy || (Taffy = {}));
var Taffy;
(function (Taffy) {
    "use strict";
    var System;
    (function (System) {
        /** Puts URL query parameters into a map (an object). The values are url decoded. */
        function getQueryParameters() {
            var args = {};
            var urlParams = window.location.search.slice(1);
            if (urlParams.length > 0) {
                urlParams.split("&").forEach(function (param) {
                    var tokens = param.split("=");
                    args[tokens[0]] = decodeURIComponent(tokens[1]);
                });
            }
            return args;
        }
        System.getQueryParameters = getQueryParameters;
        /** Opens a new browser window */
        function openWindow(url, target, features, replace) {
            return window.open(url, target, features, replace);
        }
        System.openWindow = openWindow;
        /** Returns true of the browser supports touch events */
        function isTouchSupported() {
            return ("ontouchstart" in document.documentElement);
        }
        System.isTouchSupported = isTouchSupported;
        /** Returns true of the browser supports pointer events */
        function isPointerSupported() {
            return ("onpointerdown" in document.documentElement);
        }
        System.isPointerSupported = isPointerSupported;
        /** Returns true of the browser supports mouse events */
        function isMouseSupported() {
            return ("onmousedown" in document.documentElement);
        }
        System.isMouseSupported = isMouseSupported;
        /////////////////////////////////////////////////////////////////////////
        // Timing ///////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        function setInterval(callback, timeout) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return window.setInterval(callback, timeout, args);
        }
        System.setInterval = setInterval;
        function clearInterval(handle) {
            window.clearInterval(handle);
        }
        System.clearInterval = clearInterval;
        function setTimeout(callback, timeout) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return window.setTimeout(callback, timeout, args);
        }
        System.setTimeout = setTimeout;
        function clearTimeout(handle) {
            window.clearTimeout(handle);
        }
        System.clearTimeout = clearTimeout;
        /////////////////////////////////////////////////////////////////////////
        // Dialogs //////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /** Shows a confirm dialog and returns the result */
        function confirm(message) {
            return window.confirm(message);
        }
        System.confirm = confirm;
        /** Shows an alert dialog */
        function alert(message) {
            window.alert(message);
        }
        System.alert = alert;
        /////////////////////////////////////////////////////////////////////////
        // Timing ///////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /** Requests an animation frame and returns the handle */
        function requestAnimationFrame(callback) {
            return window.requestAnimationFrame(callback);
        }
        System.requestAnimationFrame = requestAnimationFrame;
        function cancelAnimationFrame(handle) {
            window.cancelAnimationFrame(handle);
        }
        System.cancelAnimationFrame = cancelAnimationFrame;
        /** Adds a function to be called when the DOM is ready */
        function ready(callback) {
            // If the dom has been loaded it will not fire an event so need to check if loaded and fire the callback immediately
            if (document.readyState == "interactive" || document.readyState == "complete") {
                callback();
            }
            else {
                document.addEventListener("DOMContentLoaded", function (evt) { return callback(); });
            }
        }
        System.ready = ready;
        // Static initializer
        (function () {
            // Normalize requestAnimationFrame
            window.requestAnimationFrame = window.requestAnimationFrame || window["msRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] ||
                function (callback) {
                    return setTimeout(callback, 0);
                };
            window.cancelAnimationFrame = window.cancelAnimationFrame || window["msCancelRequestAnimationFrame"] || window["mozCancelAnimationFrame"] || function (handle) { };
        })();
    })(System = Taffy.System || (Taffy.System = {}));
})(Taffy || (Taffy = {}));
