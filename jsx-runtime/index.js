function renderChildren(fragment, children) {
    if (Array.isArray(children) || children instanceof NodeList) {
        children.forEach(function (c) { return renderChildren(fragment, c); });
    }
    else if (children instanceof Node) {
        fragment.appendChild(children);
    }
    else if (children) {
        fragment.appendChild(document.createTextNode(children.toString()));
    }
}
function render(element, options) {
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
                        renderChildren(fragment, options.children);
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
function jsx(tag, options) {
    return typeof tag === 'function' ? tag(options) : render(document.createElement(tag), options);
}
function Fragment(options) {
    return render(document.createDocumentFragment(), options);
}
export { jsx, jsx as jsxs, Fragment, };
