import React, {useEffect, useState} from "react";
import _ws from '@netuno/ws-client';
import useWS from "../../../common/useWS.js";

import "./index.less";

function WSBadge() {
  const [state, setState] = useState(0);
  const ws = useWS();

  useEffect(() => {
    if (!ws.data) {
      setState(0);
    }
    if (ws.data?.connected) {
      setState(1);
    } else if (ws.data?.connected === false) {
      setState(-1);
    }
  }, [ws.data]);

  return (
    <div
      className="header__user-info__avatar__badge"
      style={{
        backgroundColor:
          (state === 0 && "#d87a16") ||
          (state === 1 && "#49aa19") ||
          (state === -1 && "#dc4446"),
        width: "12px",
        height: "12px",
        right: "2px",
        bottom: "2px",
        borderRadius: "50%",
      }}
    />
  );
}

export default WSBadge;
