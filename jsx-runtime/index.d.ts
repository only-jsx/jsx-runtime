export declare type JsxNode = Node | NodeList | Function | string | number | DocumentFragment | boolean | null | undefined;
export declare type JsxRef = {
    current?: HTMLElement | DocumentFragment;
};
export declare type OptionsAttributes = {
    [key: string]: JsxNode | JsxNode[] | JsxRef;
};
export declare type OptionsRef = {
    ref: JsxRef;
};
export declare type OptionsChildren = {
    children: JsxNode | JsxNode[];
};
export declare type Options = Partial<OptionsAttributes & OptionsChildren & OptionsRef> | string | number | boolean | null | undefined;
export declare namespace JSX {
    interface IntrinsicElements {
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
declare function jsx(tag: keyof JSX.IntrinsicElements | ((o: Options) => HTMLElement | DocumentFragment), options: Options): HTMLElement | DocumentFragment;
declare function Fragment(options: Options): HTMLElement | DocumentFragment;
export { jsx, jsx as jsxs, Fragment, };