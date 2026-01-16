function escapeCssId(id: string): string {
    return String(id).replace(/([ #;?%&,.+*~\\':"!^$\[\]()=>|/@])/g, "\\$1");
}

function generateUniqueHtmlId(editor: any, base: string): string {
    const wrapper = editor?.getWrapper?.();
    if (!wrapper) return base;

    let candidate = base;
    let i = 1;

    while (wrapper.find?.(`#${escapeCssId(candidate)}`)?.length) {
        candidate = `${base}-${i++}`;
    }
    return candidate;
}


export {escapeCssId, generateUniqueHtmlId};