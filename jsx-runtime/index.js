function renderChildren(fragment, children, ctx) {
    if (Array.isArray(children) || children instanceof NodeList) {
        children.forEach(function (c) { return renderChildren(fragment, c, ctx); });
    }
    else if (children instanceof Node) {
        fragment.appendChild(children);
    }
    else if (typeof children === 'function') {
        renderChildren(fragment, children(ctx), ctx);
    }
    else if (children) {
        fragment.appendChild(document.createTextNode(children.toString()));
    }
}
function render(element, options, ctx) {
    if (options instanceof Object) {
        for (var o in options) {
            switch (o) {
                case 'ref':
                    if (options.ref instanceof Object) {
                        options.ref.current = element;
                    }
                    else {
                        throw new Error('ref property is not instance of Object');
                    }
                    break;
                case 'children':
                    {
                        var fragment = document.createDocumentFragment();
                        renderChildren(fragment, options.children, ctx);
                        element.replaceChildren(fragment);
                    }
                    break;
                default:
                    if (element instanceof HTMLElement) {
                        if (typeof options[o] === 'function') {
                            element[o] = options[o];
                        }
                        else {
                            element.setAttribute(o, options[o].toString());
                        }
                    }
                    break;
            }
        }
    }
    else {
        element.replaceChildren(document.createTextNode(options.toString()));
    }
    return element;
}
var context = null;
function jsx(tag, options) {
    var f = typeof tag === 'function' ? function (ctx) { return tag(options, ctx); } : function (ctx) { return render(document.createElement(tag), options, ctx); };
    if (!context) {
        return f(undefined);
    }
    if (context.tag === tag) {
        var result = f(context.ctx);
        context = null;
        return result;
    }
    return f;
}
function Fragment(options) {
    var f = function (ctx) { return render(document.createDocumentFragment(), options, ctx); };
    if (!context) {
        return f(undefined);
    }
    return f;
}
function setContext(tag, ctx) {
    context = { tag: tag, ctx: ctx };
}
function getContext() {
    return context;
}
export { jsx, jsx as jsxs, Fragment, setContext, getContext, };
