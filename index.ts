export type JsxNode = Node | NodeList | Function | string | number | boolean | null | undefined;

export type JsxRef = { current?: HTMLElement | DocumentFragment | Comment };

export type OptionsAttributes = { [key: string]: any };

export type OptionsRef = {
    ref: JsxRef;
};

export type OptionsChildren = {
    children: JsxNode | JsxNode[];
};

export type Options = Partial<OptionsAttributes & OptionsChildren & OptionsRef>;

export namespace JSX {
    export interface IntrinsicElements {
        // HTML
        a: any;
        abbr: any;
        address: any;
        area: any;
        article: any;
        aside: any;
        audio: any;
        b: any;
        base: any;
        bdi: any;
        bdo: any;
        big: any;
        blockquote: any;
        body: any;
        br: any;
        button: any;
        canvas: any;
        caption: any;
        cite: any;
        code: any;
        col: any;
        colgroup: any;
        data: any;
        datalist: any;
        dd: any;
        del: any;
        details: any;
        dfn: any;
        dialog: any;
        div: any;
        dl: any;
        dt: any;
        em: any;
        embed: any;
        fieldset: any;
        figcaption: any;
        figure: any;
        footer: any;
        form: any;
        h1: any;
        h2: any;
        h3: any;
        h4: any;
        h5: any;
        h6: any;
        head: any;
        header: any;
        hgroup: any;
        hr: any;
        html: any;
        i: any;
        iframe: any;
        img: any;
        input: any;
        ins: any;
        kbd: any;
        keygen: any;
        label: any;
        legend: any;
        li: any;
        link: any;
        main: any;
        map: any;
        mark: any;
        menu: any;
        menuitem: any;
        meta: any;
        meter: any;
        nav: any;
        noindex: any;
        noscript: any;
        object: any;
        ol: any;
        optgroup: any;
        option: any;
        output: any;
        p: any;
        param: any;
        picture: any;
        pre: any;
        progress: any;
        q: any;
        rp: any;
        rt: any;
        ruby: any;
        s: any;
        samp: any;
        slot: any;
        script: any;
        section: any;
        select: any;
        small: any;
        source: any;
        span: any;
        strong: any;
        style: any;
        sub: any;
        summary: any;
        sup: any;
        table: any;
        template: any;
        tbody: any;
        td: any;
        textarea: any;
        tfoot: any;
        th: any;
        thead: any;
        time: any;
        title: any;
        tr: any;
        track: any;
        u: any;
        ul: any;
        "var": any;
        video: any;
        wbr: any;
        webview: any;

        // SVG
        svg: any;

        animate: any;
        animateMotion: any;
        animateTransform: any;
        circle: any;
        clipPath: any;
        defs: any;
        desc: any;
        ellipse: any;
        feBlend: any;
        feColorMatrix: any;
        feComponentTransfer: any;
        feComposite: any;
        feConvolveMatrix: any;
        feDiffuseLighting: any;
        feDisplacementMap: any;
        feDistantLight: any;
        feDropShadow: any;
        feFlood: any;
        feFuncA: any;
        feFuncB: any;
        feFuncG: any;
        feFuncR: any;
        feGaussianBlur: any;
        feImage: any;
        feMerge: any;
        feMergeNode: any;
        feMorphology: any;
        feOffset: any;
        fePointLight: any;
        feSpecularLighting: any;
        feSpotLight: any;
        feTile: any;
        feTurbulence: any;
        filter: any;
        foreignObject: any;
        g: any;
        image: any;
        line: any;
        linearGradient: any;
        marker: any;
        mask: any;
        metadata: any;
        mpath: any;
        path: any;
        pattern: any;
        polygon: any;
        polyline: any;
        radialGradient: any;
        rect: any;
        stop: any;
        switch: any;
        symbol: any;
        text: any;
        textPath: any;
        tspan: any;
        use: any;
        view: any;
    }
}

function renderChildren(fragment: DocumentFragment, children: JsxNode | JsxNode[], ctx: any) {
    if (Array.isArray(children) || children instanceof NodeList) {
        children.forEach((c: JsxNode | JsxNode[]) => renderChildren(fragment, c, ctx));
    } else if (children instanceof Node) {
        fragment.appendChild(children);
    } else if (typeof children === 'function') {
        renderChildren(fragment, children(ctx), ctx);
    } else if (children != null) {
        fragment.appendChild(document.createTextNode('' + children));
    }
}

function render(element: HTMLElement | DocumentFragment, options: Options, ctx: any) {
    if (options instanceof Object) {
        for (const o in options) {
            switch (o) {
                case 'ref':
                    if (options.ref instanceof Object) {
                        options.ref.current = element;
                    } else {
                        throw new Error('ref property is not instance of Object');
                    }
                    break;
                case 'children':
                    {
                        const fragment = document.createDocumentFragment();
                        renderChildren(fragment, options.children, ctx);
                        element.replaceChildren(fragment);
                    }
                    break;
                default:
                    if (element instanceof HTMLElement) {
                        if (typeof options[o] === 'function') {
                            (element as any)[o] = options[o];
                        } else {
                            element.setAttribute(o, '' + options[o]);
                        }
                    }
                    break;
            }
        }
    }

    return element;
}

let context: any | null = null;

export type TagFunc = (o: Options, ctx: any) => HTMLElement | DocumentFragment | Comment | null;

function jsx(tag: keyof JSX.IntrinsicElements | TagFunc, options: Options) {
    const f = typeof tag === 'function' ? (ctx: any) => tag(options, ctx) : (ctx: any) => render(document.createElement(tag), options, ctx);

    if (!context) {
        return f(undefined);
    }

    if (context.tag === tag) {
        const result = f(context.ctx);
        context = null;
        return result;
    }

    return f;
}

function Fragment(options: Options) {
    const f = (ctx: any) => render(document.createDocumentFragment(), options, ctx);

    if (!context) {
        return f(undefined);
    }

    return f;
}

function Comment(options: Options) {
    if (options instanceof Object) {
        const c = document.createComment('' + options.children);

        if (options.ref instanceof Object) {
            options.ref.current = c;
        }

        return c;
    }

    return document.createComment('' + options);
}

function setContext(tag: keyof JSX.IntrinsicElements | TagFunc, ctx: any) {
    context = { tag, ctx };
}

function clearContext() {
    context = null;
}

function getContext() {
    return context;
}

export {
    jsx,
    jsx as jsxs,
    Fragment,
    Comment,
    setContext,
    clearContext,
    getContext,
}
