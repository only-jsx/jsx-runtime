import { describe, expect, test } from '@jest/globals';
import {
    jsx,
    Fragment,
    Comment as JsxComment,
    setContext,
    clearContext,
    getContext,
    TagFunc,
    JsxRef,
    Options,
} from './index';

describe('Test Runtime', () => {
    test('context', () => {
        const ctx = 1;
        setContext('div', ctx);
        expect(getContext()).toStrictEqual({ tag: 'div', ctx: 1 });
        clearContext();
        expect(getContext()).toBeNull();
    });

    test('jsx children', () => {
        const testDivOptions = (options: Options, html: string) => {
            let r1 = jsx('div', options);
            expect(r1 instanceof HTMLDivElement).toBeTruthy();
            let e1 = r1 as HTMLElement;
            expect(e1.outerHTML).toBe(html);
        }

        testDivOptions({ ['id']: 1, children: null }, '<div id="1"></div>');
        testDivOptions({ ['id']: 1 }, '<div id="1"></div>');
        testDivOptions({ id: 1, children: 0 }, '<div id="1">0</div>');
        testDivOptions({ id: 1, children: 1 }, '<div id="1">1</div>');
        testDivOptions({ id: 1, children: [0, 1, 2, 3] }, '<div id="1">0123</div>');
        testDivOptions({ id: 1, children: 'null' }, '<div id="1">null</div>');

        const c1 = document.createComment('comment')

        testDivOptions({ id: 1, children: c1 }, '<div id="1"><!--comment--></div>');

        const span = document.createElement('span');
        testDivOptions({ id: 1, children: span }, '<div id="1"><span></span></div>');

        let f = document.createDocumentFragment();
        f.append(span);

        testDivOptions({ id: 2, children: f }, '<div id="2"><span></span></div>');

        f.append(jsx('div', { id: 4 }) as HTMLElement);

        testDivOptions({ id: 2, children: f }, '<div id="2"><div id="4"></div></div>');

        let e = jsx('div', { id: 2, children: span }) as HTMLElement;
        const fc = () => e;
        let r = jsx(fc, {});
        expect(r instanceof HTMLDivElement).toBeTruthy();
        e = r as HTMLElement;
        expect(e.outerHTML).toBe('<div id="2"><span></span></div>');

        f.append(jsx('div', { id: 4 }) as HTMLElement);

        const span2 = document.createElement('span');
        span2.textContent = 'span';
        testDivOptions({ id: 3, children: [null, undefined, false, 1, '1', e, c1, f, JsxComment('comment' as unknown as object), Fragment({ children: span2 })] }, '<div id="3">false11<div id="2"><span></span></div><!--comment--><div id="4"></div><!--comment--><span>span</span></div>');
    });

    test('jsx with Nodelist', () => {
        const parent = document.createElement('ul');
        for (let i = 0; i < 3; i++) {
            const li = document.createElement('li');
            li.id = '' + i;
            parent.appendChild(li);
        }

        const r1 = jsx('ul', { id: 4, children: parent.childNodes });
        expect(r1 instanceof HTMLUListElement).toBeTruthy();
        const e1 = r1 as HTMLUListElement;
        expect(e1.outerHTML).toBe('<ul id="4"><li id="0"></li><li id="1"></li><li id="2"></li></ul>');
        expect(parent.childNodes.length).toBe(0);
    });

    test('jsx with ref', () => {
        let r: JsxRef = {};
        const r1 = jsx('div', { id: 1, children: null, ref: r });
        expect(r1 instanceof HTMLDivElement).toBeTruthy();
        const e1 = r1 as HTMLElement;
        expect(e1.outerHTML).toBe('<div id="1"></div>');

        expect(r.current).toBe(e1);

        const fc: TagFunc = () => e1;

        r = {};
        const r2 = jsx(fc, { id: 2, ref: r });
        expect(r2 instanceof HTMLDivElement).toBeTruthy();
        const e2 = r2 as HTMLElement;
        expect(e2.outerHTML).toBe('<div id="1"></div>');
        expect(r).toStrictEqual({});

        r = {};
        const fc2: TagFunc = () => jsx('div', { id: 3, ref: r }) as HTMLDivElement;
        const r3 = jsx('div', { id: 2, children: fc2 });
        expect(r2 instanceof HTMLDivElement).toBeTruthy();
        const e3 = r3 as HTMLElement;
        expect(e3.outerHTML).toBe('<div id="2"><div id="3"></div></div>');
        expect((r.current as HTMLElement).outerHTML).toBe('<div id="3"></div>');

        const wrongRef = 1 as unknown as JsxRef;
        expect(() => jsx('div', { id: 1, children: null, ref: wrongRef })).toThrowError('ref property is not instance of Object');
    });

    test('jsx with event', () => {
        const onclick = jest.fn();

        let r: JsxRef = {};
        const r1 = jsx('div', { id: 1, children: true, onclick });
        expect(r1 instanceof HTMLDivElement).toBeTruthy();
        const e1 = r1 as HTMLElement;
        expect(e1.outerHTML).toBe('<div id="1">true</div>');
        expect(e1.onclick).toBe(onclick);

        expect(onclick).not.toHaveBeenCalled();
        (e1.onclick as Function)();
        expect(onclick).toHaveBeenCalledTimes(1);
    });

    test('jsx with attribute', () => {
        let r: JsxRef = {};
        const r1 = jsx('div', { id: 1, children: true, style: 'display: block' });
        expect(r1 instanceof HTMLDivElement).toBeTruthy();
        const e1 = r1 as HTMLElement;
        expect(e1.outerHTML).toBe('<div id="1" style="display: block">true</div>');
        expect(e1.style.display).toBe('block');
    });

    test('jsx with null attribute', () => {
        let r: JsxRef = {};
        const r1 = jsx('div', { id: 1, children: true, style: null });
        expect(r1 instanceof HTMLDivElement).toBeTruthy();
        const e1 = r1 as HTMLElement;
        expect(e1.outerHTML).toBe('<div id="1">true</div>');
        expect(e1.style.display).toBe('')
    });

    test('jsx with undefined attribute', () => {
        let r: JsxRef = {};
        const r1 = jsx('div', { id: 1, children: true, style: undefined });
        expect(r1 instanceof HTMLDivElement).toBeTruthy();
        const e1 = r1 as HTMLElement;
        expect(e1.outerHTML).toBe('<div id="1">true</div>');
        expect(e1.style.display).toBe('')
    });

    test('jsx with context', () => {
        const r1 = jsx('div', { id: 1, children: null });
        expect(r1 instanceof HTMLDivElement).toBeTruthy();
        const e1 = r1 as HTMLElement;
        expect(e1.outerHTML).toBe('<div id="1"></div>');

        const fc: TagFunc = () => e1;

        const r2 = jsx(fc, { id: 2 });
        expect(r2 instanceof HTMLDivElement).toBeTruthy();
        const e2 = r2 as HTMLElement;
        expect(e2.outerHTML).toBe('<div id="1"></div>');

        setContext('div', undefined);
        const r3 = jsx(fc, { id: 3 });
        expect(r3 instanceof Function).toBeTruthy();
        const rr3 = (r3 as TagFunc)({}, undefined);
        expect(rr3 instanceof HTMLDivElement).toBeTruthy();
        const e3 = rr3 as HTMLElement;
        expect(e3.outerHTML).toBe('<div id="1"></div>');
        clearContext();

        setContext(fc, {});
        const r4 = jsx(fc, { id: 4 });
        expect(r4 instanceof HTMLDivElement).toBeTruthy();
        const e4 = r4 as HTMLElement;
        expect(e4.outerHTML).toBe('<div id="1"></div>');
        expect(getContext()).toBe(null);
    });

    test('Comment', () => {
        const r = JsxComment({ children: 'comment' });
        expect(r instanceof Comment).toBeTruthy();
        expect(r.textContent).toBe('comment');

        let ref: JsxRef = {};
        const c = JsxComment({ children: 'reffered comment', ref });
        expect(c instanceof Comment).toBeTruthy();
        expect(c.textContent).toBe('reffered comment');

        expect(ref.current).toBe(c);
    });

    test('Fragment', () => {
        const f = Fragment({ children: 'fragment' });
        expect(f instanceof DocumentFragment).toBeTruthy();
        expect((f as DocumentFragment).firstChild?.textContent).toBe('fragment');

        const ctxFunc = () => null;
        setContext(ctxFunc, undefined);
        const f2 = Fragment({ children: 'fragment2' });
        expect(f2 instanceof Function).toBeTruthy();
        const rf = (f2 as TagFunc)({}, undefined);

        expect(rf instanceof DocumentFragment).toBeTruthy();
        expect((rf as DocumentFragment).firstChild?.textContent).toBe('fragment2');
        clearContext();
    });
});