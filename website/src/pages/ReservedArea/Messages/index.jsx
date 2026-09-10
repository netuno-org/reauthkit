import React, { useState } from "react";
import { Row, Col, Card } from "antd";

import Chat from "./Chat";
import FriendsList from "./FriendsList/index.jsx";
import "./index.less";

function Messages() {
  const [chatFriend, setChatFriend] = useState(null);

  const onFriendSelected = (friend) => {
    setChatFriend(friend);
  };

  return (
    <section className={`messages ${chatFriend ? "messages--chat-active" : ""}`}>
      <div className="messages__body">
        <Card className="messages__card" variant="borderless">
          <Row className="messages__row">
            <Col xs={24} md={8} className="messages__sidebar">
              <FriendsList selectedFriend={chatFriend} onFriendSelected={onFriendSelected} />
            </Col>
            <Col xs={24} md={16} className="messages__chat-area">
              <Chat friend={chatFriend} onClose={() => setChatFriend(null)} />
            </Col>
          </Row>
        </Card>
      </div>
    </section>
  );
}

export default Messages;