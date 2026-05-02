import {_val, _header, _exec, _out} from "@netuno/server-types";

import people from "#core/lib/people.js";

const data = people.getLoginData();

if (!data) {
  _header.status(404);
  _exec.stop();
}

_out.json(
  _val.map()
    .set("result", true)
    .set("data", data)
);
