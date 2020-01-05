class HTMLRender {
    static render(options) {
        let {tags, className = [], text, title,value} = options;
        let elem = document.createElement(tags);
        elem.classList.add(...className);
        elem.textContent = text;
        elem.setAttribute(title,value);
        return elem;
    }
}
