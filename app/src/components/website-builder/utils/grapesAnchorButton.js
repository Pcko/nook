// src/components/website-builder/utils/grapesAnchorButton.js

/**
 * Buttons get:
 * - "Scroll to ID" (text)  -> value actually used
 * - "Pick section" (select)-> picks among existing ids and fills "Scroll to ID"
 *
 * On click, the button scrolls to the element with that id.
 *
 * @param {import('grapesjs').Editor} editor
 */
export function registerButtonTestTrait(editor) {
  /**
   * Update the select trait (scrollToSelect) with all IDs in the page.
   * @param {*} cmp
   */
  const updateSelectOptions = (cmp) => {
    if (!cmp || cmp.get("type") !== "button") return;

    const selectTrait = cmp.getTrait("scrollToSelect");
    if (!selectTrait) return;

    const wrapper = editor.getWrapper();
    if (!wrapper) return;

    // Find all components that have an id attribute
    const allComps = wrapper.find("*");
    const options = [{ id: "", label: "- Select section -" }];

    allComps.forEach((c) => {
      const attrs = c.getAttributes && c.getAttributes();
      const id = attrs && attrs.id;
      if (id) {
        options.push({
          id,
          label: `#${id}`,
        });
      }
    });

    selectTrait.set("options", options);
  };

  editor.on("component:selected", (cmp) => {
    if (!cmp) return;

    const type = cmp.get("type");
    if (type !== "button") return;

    const hasTextTrait = !!cmp.getTrait("scrollTo");
    const hasSelectTrait = !!cmp.getTrait("scrollToSelect");

    // 1) Add traits (only once)
    if (!hasTextTrait && !hasSelectTrait) {
      cmp.addTrait([
        {
          type: "text",
          name: "scrollTo",
          label: "Scroll to ID",
        },
        {
          type: "select",
          name: "scrollToSelect",
          label: "Pick section",
          changeProp: 1, // triggers change event on component
          options: [{ id: "", label: "- Select section -" }],
        },
      ]);
    } else {
      // In case one existed, make sure both do
      if (!hasTextTrait) {
        cmp.addTrait({
          type: "text",
          name: "scrollTo",
          label: "Scroll to ID",
        });
      }
      if (!hasSelectTrait) {
        cmp.addTrait({
          type: "select",
          name: "scrollToSelect",
          label: "Pick section",
          changeProp: 1,
          options: [{ id: "", label: "- Select section -" }],
        });
      }
    }

    // 2) Make the select populate the text trait when changed
    if (!cmp.__scrollSelectBound) {
      cmp.__scrollSelectBound = true;

      cmp.on("change:scrollToSelect", (model, value) => {
        if (!value) return;

        // Set the scrollTo attribute (used by the script)
        cmp.addAttributes({ scrollTo: value });

        // Keep the text trait in sync
        const textTrait = cmp.getTrait("scrollTo");
        if (textTrait) {
          textTrait.set("value", value);
        }
      });
    }

    // 3) Ensure the click script is attached once
    if (!cmp.get("script")) {
      cmp.set("script", function () {
        var el = this;

        function onClick(e) {
          var targetId = el.getAttribute("scrollTo");
          if (!targetId) return;

          var target = document.getElementById(targetId);
          if (!target) return;

          e.preventDefault();

          if (target.scrollIntoView) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            var rect = target.getBoundingClientRect();
            window.scrollTo(0, rect.top + window.pageYOffset);
          }
        }

        el.addEventListener("click", onClick);
      });
    }

    // 4) Populate the dropdown with current IDs
    updateSelectOptions(cmp);
  });

  // Keep the dropdown in sync when the document structure changes
  editor.on("component:add component:remove component:update", () => {
    const selected = editor.getSelected();
    if (selected && selected.get("type") === "button") {
      updateSelectOptions(selected);
    }
  });
}
