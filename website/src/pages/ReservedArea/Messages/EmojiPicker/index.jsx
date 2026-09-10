import React from "react";
import EmojiPickerReact from "emoji-picker-react";
import ptEmojis from "emoji-picker-react/dist/data/emojis-pt";

function EmojiPicker({ onEmojiSelect, onEmojiClick, width = "310px", height = "360px", ...props }) {
  const handleEmojiClick = (emojiData, event) => {
    if (onEmojiClick) {
      onEmojiClick(emojiData, event);
    }
    if (onEmojiSelect) {
      onEmojiSelect({
        native: emojiData.emoji,
        emoji: emojiData.emoji,
        ...emojiData,
      });
    }
  };

  return (
    <div className="messages__emoji-picker-react-wrapper" onClick={(e) => e.stopPropagation()}>
      <EmojiPickerReact
        onEmojiClick={handleEmojiClick}
        emojiData={ptEmojis}
        searchPlaceholder="Pesquisar..."
        previewConfig={{ showPreview: false }}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
}

export default EmojiPicker;
