import React, { useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";

function EmojiPicker({ onEmojiSelect, onClickOutside, theme = "light", locale = "pt", ...props }) {
  const ref = useRef(null);
  const onSelectRef = useRef(onEmojiSelect);
  const onClickOutsideRef = useRef(onClickOutside);
  onSelectRef.current = onEmojiSelect;
  onClickOutsideRef.current = onClickOutside;

  useEffect(() => {
    const currentContainer = ref.current;
    if (!currentContainer) return;

    currentContainer.innerHTML = "";

    const picker = new Picker({
      data,
      locale,
      theme,
      onEmojiSelect: (emoji) => {
        if (onSelectRef.current) {
          onSelectRef.current(emoji);
        }
      },
      previewPosition: "none",
      skinTonePosition: "search",
      searchPosition: "top",
      navPosition: "bottom",
      perLine: 8,
      maxFrequentRows: 1,
      ...props,
    });

    currentContainer.appendChild(picker);

    const handleDocumentClick = (e) => {
      if (currentContainer && !currentContainer.contains(e.target)) {
        if (onClickOutsideRef.current) {
          onClickOutsideRef.current(e);
        }
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleDocumentClick);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleDocumentClick);
      currentContainer.innerHTML = "";
    };
  }, [theme, locale]);

  return <div ref={ref} className="messages__emoji-mart-wrapper" />;
}

export default EmojiPicker;
