import {_group, _val} from '@netuno/server-types'

_group.createIfNotExists(
    _val.map()
        .set("name", "Pessoa")
        .set("code", "people")
)
