///<reference path='../core/keycodes.ts'/>
///<reference path='../core/interfaces.ts'/>
namespace Taffy
{
    "use strict";
    export namespace Events
    {
        export interface IElementEvent
        {
            /** X-Position of the mouse inside the element */
            elementX: number;
            /** Y-Position of the mouse inside the element */
            elementY: number;
            stopPropagation(): IElementEvent;
            preventDefault(): IElementEvent;
        }

        export class ElementEvent<T extends Event> implements IElementEvent
        {
            /** X-Position of the mouse inside the element */
            public elementX: number;
            /** Y-Position of the mouse inside the element */
            public elementY: number;

            constructor(public element: HTMLElement, public baseEvent: T) { }
            public stopPropagation(): ElementEvent<T> { this.baseEvent.stopPropagation(); return this; }
            public preventDefault(): ElementEvent<T> { this.baseEvent.preventDefault(); return this; }
        }

        /** Wraps a pointer event to provide element based positions */
        export class ElementPointerEvent extends ElementEvent<PointerEvent>
        {
            /**
             * @param element The element the event ocurred on
             * @param event The mouse event
             */
            constructor(element: HTMLElement, event: PointerEvent)
            {
                super(element, event);

                let pos = getElementPosition(element);
                this.elementX = event.pageX - pos.left;
                this.elementY = event.pageY - pos.top;
            }

            public get isPrimary(): boolean
            {
                return this.baseEvent.isPrimary;
            }
        }

        /** Wraps a mouse event to provide element based positions */
        export class ElementMouseEvent extends ElementEvent<MouseEvent>
        {
            /**
             * @param element The element the event ocurred on
             * @param event The mouse event
             */
            constructor(element: HTMLElement, event: MouseEvent)
            {
                super(element, event);

                let pos = getElementPosition(element);
                this.elementX = event.pageX - pos.left;
                this.elementY = event.pageY - pos.top;
            }
        }

        /** Wraps a touch event to provide element based positions */
        export class ElementTouchEvent extends ElementEvent<TouchEvent>
        {
            /** X-Position of the first touch inside the element */
            public elementX: number;
            /** Y-Position of the first touch inside the element */
            public elementY: number;
            /** Set of all touches positioned to the element */
            public elementPoints: IPoint[] = [];

            /**
             * @param element The element the event ocurred on
             * @param event The touch event
             */
            constructor(element: HTMLElement, event: TouchEvent)
            {
                super(element, event);

                if (event.touches && event.touches.length > 0)
                {
                    let pos = getElementPosition(element);
                    let len = event.touches.length
                    for (var i = 0; i < len; i++)
                    {
                        let t = event.touches.item(i);
                        let pt = {
                            x: t.pageX - pos.left,
                            y: t.pageY - pos.top
                        };
                        this.elementPoints.push(pt);

                        if (i === 0)
                        {
                            this.elementX = pt.x;
                            this.elementY = pt.y;
                        }
                    }
                }
            }
        }

        /** Wraps a keyboard event to provide key code */
        export class ElementKeyboardEvent extends ElementEvent<KeyboardEvent>
        {
            public get keyCode(): KeyCode
            {
                return this.baseEvent.which;
            }

            public get keyNumber(): number
            {
                return this.baseEvent.which;
            }

            constructor(element: HTMLElement, event: KeyboardEvent)
            {
                super(element, event);
            }
        }

        /////////////////////////////////////////////////////////////////////////
        // Click ///////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////

        /** Adds a click event handler */
        export function onClick(element: HTMLElement, callback: (evt: ElementMouseEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addMouseEventListener("click", element, callback, useCapture);
        }

        /** Adds a dblclick event handler */
        export function onDblClick(element: HTMLElement, callback: (evt: ElementMouseEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addMouseEventListener("dblclick", element, callback, useCapture);
        }

        /////////////////////////////////////////////////////////////////////////
        // Pointer///////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////

        /** Adds a mousedown event handler */
        export function onPointerDown(element: HTMLElement, callback: (evt: ElementPointerEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addPointerEventListener("pointerdown", element, callback, useCapture);
        }

        /** Adds a mouseup event handler */
        export function onPointerUp(element: HTMLElement, callback: (e: ElementPointerEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addPointerEventListener("pointerup", element, callback, useCapture);
        }

        /** Adds a mousemove event handler */
        export function onPointerMove(element: HTMLElement, callback: (evt: ElementPointerEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addPointerEventListener("pointermove", element, callback, useCapture);
        }

        /** Adds a mouseout event handler */
        export function onPointerOut(element: HTMLElement, callback: (evt: ElementPointerEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addPointerEventListener("pointerout", element, callback, useCapture);
        }

        /** Adds a mouseover event handler */
        export function onPointerOver(element: HTMLElement, callback: (evt: ElementPointerEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addPointerEventListener("pointerover", element, callback, useCapture);
        }

        /////////////////////////////////////////////////////////////////////////
        // Mouse ///////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////

        /** Adds a mousedown event handler */
        export function onMouseDown(element: HTMLElement, callback: (evt: ElementMouseEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addMouseEventListener("mousedown", element, callback, useCapture);
        }

        /** Adds a mouseup event handler */
        export function onMouseUp(element: HTMLElement, callback: (e: ElementMouseEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addMouseEventListener("mouseup", element, callback, useCapture);
        }

        /** Adds a mousemove event handler */
        export function onMouseMove(element: HTMLElement, callback: (evt: ElementMouseEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addMouseEventListener("mousemove", element, callback, useCapture);
        }

        /** Adds a mouseout event handler */
        export function onMouseOut(element: HTMLElement, callback: (evt: ElementMouseEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addMouseEventListener("mouseout", element, callback, useCapture);
        }

        /** Adds a mouseover event handler */
        export function onMouseOver(element: HTMLElement, callback: (evt: ElementMouseEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addMouseEventListener("mouseover", element, callback, useCapture);
        }
        
        /////////////////////////////////////////////////////////////////////////
        // touch /////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////

        /** Adds a touchstart event handler */
        export function onTouchStart(element: HTMLElement, callback: (evt: ElementTouchEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addTouchEventListener("touchstart", element, callback, useCapture);
        }
        /** Adds a touchend event handler */
        export function onTouchEnd(element: HTMLElement, callback: (evt: ElementTouchEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addTouchEventListener("touchend", element, callback, useCapture);
        }
        /** Adds a touchmove event handler */
        export function onTouchMove(element: HTMLElement, callback: (evt: ElementTouchEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addTouchEventListener("touchmove", element, callback, useCapture);
        }
        /** Adds a touchcancel event handler */
        export function onTouchCancel(element: HTMLElement, callback: (evt: ElementTouchEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addTouchEventListener("touchcancel", element, callback, useCapture);
        }

        /////////////////////////////////////////////////////////////////////////
        // keyboard /////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////

        /** Adds a keypress event handler */
        export function onKeyPress(element: HTMLElement, callback: (evt: ElementKeyboardEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addKeyboardEventListener("keypress", element, callback, useCapture);
        }

        /** Adds a keydown event handler */
        export function addKeyDownListener(element: HTMLElement, callback: (evt: ElementKeyboardEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addKeyboardEventListener("keydown", element, callback, useCapture);
        }

        /** Adds a keyup event handler */
        export function addKeyUpListener(element: HTMLElement, callback: (evt: ElementKeyboardEvent) => any, useCapture?: boolean): HTMLElement
        {
            return addKeyboardEventListener("keyup", element, callback, useCapture);
        }

        /////////////////////////////////////////////////////////////////////////
        // Transition ///////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////

        /** Adds a transitionend event handler */
        export function onTransitionEnd(element: HTMLElement, callback: (evt: ElementEvent<Event>) => any, useCapture?: boolean): HTMLElement
        {
            element.addEventListener("webkitTransitionEnd", (evt) => callback(new ElementEvent(element, evt)), useCapture);
            element.addEventListener("transitionend", (evt) => callback(new ElementEvent(element, evt)), useCapture);
            return this;
        }

        /////////////////////////////////////////////////////////////////////////
        // Private //////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////

        function getElementPosition(element: HTMLElement): IPosition
        {
            let rect = element.getBoundingClientRect();
            return {
                left: rect.left + window.pageXOffset,
                top: rect.top + window.pageYOffset
            };
        }

        /** Adds a pointer event handler */
        function addPointerEventListener(eventName: string, element: HTMLElement, callback: (evt: ElementPointerEvent) => any, useCapture?: boolean): HTMLElement
        {
            element.addEventListener(eventName, (evt: PointerEvent) => callback(new ElementPointerEvent(element, evt)), useCapture);
            return element;
        }

        /** Adds a mouse event handler */
        function addMouseEventListener(eventName: string, element: HTMLElement, callback: (evt: ElementMouseEvent) => any, useCapture?: boolean): HTMLElement
        {
            element.addEventListener(eventName, (evt: MouseEvent) => callback(new ElementMouseEvent(element, evt)), useCapture);
            return element;
        }

        /** Adds a touch event handler */
        function addTouchEventListener(eventName: string, element: HTMLElement, callback: (evt: ElementTouchEvent) => any, useCapture?: boolean): HTMLElement
        {
            element.addEventListener(eventName, (evt: TouchEvent) => callback(new ElementTouchEvent(element, evt)), useCapture);
            return element;
        }

        /** Adds a mouse event handler */
        function addKeyboardEventListener(eventName: string, element: HTMLElement, callback: (evt: ElementKeyboardEvent) => any, useCapture?: boolean): HTMLElement
        {
            element.addEventListener(eventName, (evt: KeyboardEvent) => callback(new ElementKeyboardEvent(element, evt)), useCapture);
            return element;
        }
    }
}