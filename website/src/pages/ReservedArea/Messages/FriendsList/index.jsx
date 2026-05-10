import {useEffect, useState} from "react";
import {Spin} from "antd";
import _ws from "@netuno/ws-client";

import FriendItem from "./FriendItem";

import "./index.less";
import useWS from "../../../../common/useWS.js";

function FriendsList({onFriendSelected}) {
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState(null);
    const ws = useWS();
    useEffect(() => {
        const listenerRef = _ws.addListener({
            service: "friend/list",
            success: (data) => {
                setList(data.content);
                setLoading(false);
            },
            fail: (error)=> {
                setLoading(false);
            }
        });
        _ws.sendService({
            service: "friend/list"
        });
        return () => {
            _ws.removeListener(listenerRef);
        }
    }, [ws.data]);
    return (
        <div className="messages__friends-list">
            {loading && <Spin />}
            {list && <ul>
                {list.map(({uid, name, avatar}) => (
                    <FriendItem
                        key={uid}
                        uid={uid}
                        name={name}
                        avatar={avatar}
                        onClick={() => onFriendSelected && onFriendSelected({uid, name, avatar})}
                    />
                ))}
            </ul>}
        </div>
    );
}

export default FriendsList;
