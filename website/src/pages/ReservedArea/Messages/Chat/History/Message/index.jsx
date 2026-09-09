import React, { useState } from "react";
import { Avatar, Typography, Popover, Dropdown, Input, Button, Popconfirm } from "antd";
import { SmileOutlined, EditOutlined, DeleteOutlined, RollbackOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import _service from "@netuno/service-client";
import useProfile from "../../../../../../common/useProfile.js";

import "./index.less";

const { Text } = Typography;
const { TextArea } = Input;

const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "👏", "🙏", "💯"];

function Message({ friend, data, onReply, onEdit, onDelete, onReact, onQuoteClick }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.message || "");
  const [reactionPopoverOpen, setReactionPopoverOpen] = useState(false);
  const profile = useProfile();

  const isIncoming = friend.uid === data.from;
  const isDeleted = Boolean(data.deleted_at);

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== data.message) {
      onEdit && onEdit(data.uid, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(data.message || "");
    setIsEditing(false);
  };

  const handleReactionSelect = (emoji) => {
    setReactionPopoverOpen(false);
    const updated = data.reaction === emoji ? "" : emoji;
    onReact && onReact(data.uid, updated);
  };

  const handleQuoteClick = (e) => {
    e.stopPropagation();
    if (data.parent && data.parent.uid) {
      onQuoteClick && onQuoteClick(data.parent.uid);
    }
  };

  const emojiPickerContent = (
    <div className="messages__emoji-picker" onClick={(e) => e.stopPropagation()}>
      {EMOJI_LIST.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className={`messages__emoji-picker__btn ${data.reaction === emoji ? "messages__emoji-picker__btn--active" : ""}`}
          onClick={() => handleReactionSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );

  const sentMoment = data.sent_at ? dayjs(data.sent_at) : null;
  const canEdit = !isIncoming && !isDeleted && sentMoment && dayjs().diff(sentMoment, "hour") < 1;

  const menuItems = [
    ...(isIncoming && !isDeleted
      ? [
          {
            key: "react",
            label: "Reagir",
            icon: <SmileOutlined />,
            children: EMOJI_LIST.map((emoji) => ({
              key: `emoji_${emoji}`,
              label: (
                <span style={{ fontSize: "16px" }}>
                  {emoji} {data.reaction === emoji ? "(Remover)" : ""}
                </span>
              ),
              onClick: () => handleReactionSelect(emoji),
            })),
          },
          {
            key: "reply",
            label: "Responder",
            icon: <RollbackOutlined />,
            onClick: () => onReply && onReply(data),
          },
        ]
      : []),
    ...(!isIncoming && !isDeleted
      ? [
          ...(canEdit
            ? [
                {
                  key: "edit",
                  label: "Editar",
                  icon: <EditOutlined />,
                  onClick: () => {
                    setEditText(data.message || "");
                    setIsEditing(true);
                  },
                },
              ]
            : []),
          {
            key: "delete",
            label: "Eliminar",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => onDelete && onDelete(data.uid),
          },
        ]
      : []),
  ];

  const userAvatarURL = profile.data?.avatar
    ? _service.url(`/profile/avatar?uid=${profile.data.uid}&${new Date().getTime()}`)
    : "/images/profile-default.png";

  const friendAvatarURL = friend.avatar
    ? _service.url(`/profile/avatar?uid=${friend.uid}&${new Date().getTime()}`)
    : "/images/profile-default.png";

  return (
    <li
      id={`msg-${data.uid}`}
      className={`messages__message ${isIncoming ? "messages__message--incoming" : "messages__message--outgoing"}`}
    >
      <div className="messages__message-row">
        {isIncoming && (
          <Avatar
            size={36}
            className="messages__message-avatar"
            icon={<img src={friendAvatarURL} alt={friend.name} />}
          />
        )}

        <div className="messages__message-content">
          {isEditing ? (
            <div className="messages__message-edit-wrapper">
              <TextArea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                autoSize={{ minRows: 2, maxRows: 6 }}
                autoFocus
                className="messages__message-edit-input"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                  if (e.key === "Escape") {
                    handleCancelEdit();
                  }
                }}
              />
              <div className="messages__message-edit-buttons">
                <Button size="small" type="primary" icon={<CheckOutlined />} onClick={handleSaveEdit}>
                  Salvar
                </Button>
                <Button size="small" icon={<CloseOutlined />} onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="messages__message-bubble-wrapper" style={{ position: "relative" }}>
              <Dropdown menu={{ items: menuItems }} trigger={["click", "contextMenu"]} disabled={isDeleted}>
                <div
                  className={`messages__message-bubble ${
                    isDeleted ? "messages__message-bubble--deleted" : ""
                  }`}
                  style={{ cursor: isDeleted ? "default" : "pointer" }}
                >
                  {!isDeleted && data.parent && (
                    <div
                      className="messages__message-reply-quote"
                      onClick={handleQuoteClick}
                      title="Ir para a mensagem original"
                    >
                      <span className="messages__message-reply-quote-sender">
                        {data.parent.from || "Utilizador"}
                      </span>
                      <span className="messages__message-reply-quote-text">
                        {data.parent.message}
                      </span>
                    </div>
                  )}

                  {isDeleted ? (
                    <Text italic className="messages__message-text">
                      Mensagem apagada
                    </Text>
                  ) : (
                    <Text className="messages__message-text">
                      {data.message || data.text || data.content || ""}
                    </Text>
                  )}

                  {!isDeleted && (
                    <div className="messages__message-bubble-meta">
                      <span className="messages__message-bubble-meta-text">
                        {data.sent_at ? dayjs(data.sent_at).format("HH:mm") : ""}
                        {data.edited_at ? " (editada)" : ""}
                        {!isIncoming && data.read_at ? " (lida)" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </Dropdown>

              {!isDeleted && data.reaction && (
                <Popover
                  content={emojiPickerContent}
                  trigger="click"
                  open={reactionPopoverOpen}
                  onOpenChange={setReactionPopoverOpen}
                  placement="top"
                >
                  <div
                    className="messages__message-reaction-badge"
                    style={{
                      [isIncoming ? "left" : "right"]: "8px",
                    }}
                    title="Reação"
                  >
                    <span>{data.reaction}</span>
                  </div>
                </Popover>
              )}
            </div>
          )}
        </div>

        {!isIncoming && (
          <Avatar
            size={36}
            className="messages__message-avatar"
            style={{ marginLeft: 8, marginRight: 0 }}
            icon={<img src={userAvatarURL} alt="Você" />}
          />
        )}
      </div>
    </li>
  );
}

export default Message;