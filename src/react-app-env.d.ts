/// <reference types="react-scripts" />
declare module '*.css';
declare module '*.css' {
    const content: {[className: string]: string};
    export default content;
}
