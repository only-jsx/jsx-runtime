# only-jsx
Another JSX runtime for Vanilla JS without react, vue, or something else

## install and config

```bash
npm i only-jsx
```

and edit `babel.config.js` or `.babelrc` or other babel config:

```
...
    plugins: [
        ...
        [
            '@babel/plugin-transform-react-jsx',
            {
                'runtime': 'automatic',
                'importSource': 'only-jsx'
            }
        ]
    ]
...
```

or `tsconfig.json`

```
...
    "compilerOptions": {
        ...
        "jsx": "react-jsx",
        "jsxImportSource": "only-jsx",
    }
...
```

then coding js or ts with jsx.

## examples

This are in repository https://github.com/only-jsx/examples

```js
//index.jsx
import APP from './app';

function render() {
    const appProps = {a:1, b:2};

    function onClick() {
        appProps.a++;
        appProps.b++;
        appProps.update();
    }

    const t = <>
        Hello
        <APP props={appProps}>In <span>APP</span></APP>
        <button onclick={onClick}>Update APP</button>
    </>;

    window.onload = () => {
        const e = document.getElementById('root');
        e.replaceChildren(t);
    }
}

render();

//app.jsx
export default ({props, children}) => {
    const result = {};
    const e = <div data-custom={props.b}>
        <span>{props.a + props.b}</span>
        <button onclick={onClick}>Button</button>
        <div ref={result}></div>
        <div id='counter' style="color: blue;"></div>
        {children}
    </div>;

    let counter = 0;
    function onClick() {
        fetch('https://api.github.com/repos/only-jsx/jsx-runtime/contributors').then(data => {
            data.json().then(contributors => {
                counter++;
                const c = contributors.map(user => <div>{user.login} {user.contributions}</div>)
                result.current.replaceChildren(...c);
                e.querySelector('#counter').replaceChildren(<span>{counter} requests</span>);
            });
        });
    }

    props.update = function () {
        e.dataset.custom = this.b;
        e.firstChild.innerText = this.a + this.b;
        result.current.replaceChildren();
    }

    return e;
}
```
```tsx
//index.tsx
import APP, {AppProps} from './app';
import {Fragment} from 'only-jsx/jsx-runtime';

function render() {
    const root = document.getElementById('root');
    function replace (e: HTMLElement ) {
        root.replaceChildren(e);
    }

    const appProps: AppProps = {
        a:1,
        b:2,
        replace,
    };

    function onClick() {
        appProps.a++;
        appProps.b++;
        appProps.update?.();
    }

    const t = <Fragment>
        Hello
        <APP props={appProps}>In <span>APP</span></APP>
        <button onclick={onClick}>Increase numbers</button>
    </Fragment>;

    window.onload = () => replace(t);
}

render();

//app.tsx
import styles from './app.module.css';
import {OptionsChildren} from 'only-jsx/jsx-runtime';

interface GhContrubutor {
    login: string;
    contributions: number;
}

export interface AppProps {
    a: number;
    b: number;
    replace: (e: HTMLElement ) => void;
    update?: () => void;
}

export default ({ props, children }: { props: AppProps, children?: OptionsChildren }) => {
    const result: { current?: HTMLElement } = {};
    const e = <div data-custom={props.b}>
        <span>{props.a + props.b}</span>
        <button onclick={onClickFetch}>Fetch</button>
        <div id='counter' style='color: blue;'></div>
        <div ref={result}></div>
        {children}
        <button onclick={onClickReplace}>Replace content</button>
    </div>;

    function onClickReplace() {
        props.replace(<p>Content was completely replaced</p>);
    }

    let counter = 0;
    function onClickFetch() {
        fetch('https://api.github.com/repos/only-jsx/jsx-runtime/contributors').then(data => {
            counter++;
            data.json().then((contributors: GhContrubutor[]) => {
                const c = contributors.map(user => <div>{user.login} {user.contributions}</div>)
                result.current.replaceChildren(...c);
                result.current.className = styles.result;
            }).catch(err=>{
                result.current.replaceChildren(err.message);
                result.current.className = styles.error;
            });
            e.querySelector('#counter').replaceChildren(<span>Request #{counter}</span>);
        });
    }

    props.update = function () {
        e.dataset.custom = this.b;
        e.firstChild.innerText = this.a + this.b;
    }

    return e;
}
```
