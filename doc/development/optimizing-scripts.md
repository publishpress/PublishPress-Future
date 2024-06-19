# Optimizing JS Scripts

This document describes how to optimize JS scripts built on JSX for the web interface.

## Uzing React Lazy Loading

React Lazy Loading is a technique that allows you to load React components only when they are needed. This can help reduce the initial load time of your web interface.

To use React Lazy Loading, you need to use the `React.lazy` function to import the component you want to lazy load. For example:

```javascript
const MyComponent = React.lazy(() => import('./MyComponent'));
```

Then, you can use the `React.Suspense` component to wrap the lazy loaded component. This component will display a loading indicator while the component is being loaded. For example:

```javascript
function App() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <MyComponent />
        </React.Suspense>
    );
}
```

## Code Splitting

Code Splitting is a technique that allows you to split your code into smaller chunks that can be loaded on demand. This can help reduce the initial load time of your web interface.

To use Code Splitting, you need to use dynamic imports to load the code chunk when it is needed. For example:

```javascript
import('./MyComponent').then(MyComponent => {
    // Use MyComponent here
});
```

You can also use the `React.lazy` function to load React components using Code Splitting. For example:

```javascript
const MyComponent = React.lazy(() => import('./MyComponent'));
```

Then, you can use the `React.Suspense` component to wrap the lazy loaded component. This component will display a loading indicator while the component is being loaded. For example:

```javascript
function App() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <MyComponent />
        </React.Suspense>
    );
}
```

## Minification For Production

To minify your JS scripts for production, you can use the following command:

```bash
composer build:js
```
