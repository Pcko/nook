// removeDefaultTitleTrait.js
export function removeGlobalTitleTrait(editor) {
  const stripTitle = (comp) => {
    if (!comp || !comp.removeTrait) return;
    // Only try if there are traits at all
    const traits = comp.getTraits && comp.getTraits();
    if (!traits || !traits.length) return;

    try {
      comp.removeTrait('title'); // Official API
    } catch (e) {
      // ignore if trait not present
    }
  };

  // Existing + initial components (after load)
  editor.on('load', () => {
    const wrapper = editor.getWrapper();
    if (!wrapper) return;

    stripTitle(wrapper);
    wrapper.find('*').forEach(stripTitle);
  });

  // New components added later
  editor.on('component:add', (comp) => {
    stripTitle(comp);
  });

  // Ensure selected component never shows title
  editor.on('component:selected', (comp) => {
    stripTitle(comp);
  });
}
