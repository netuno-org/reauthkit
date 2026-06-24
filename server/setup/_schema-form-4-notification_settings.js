/**
  *
  *  CODE GENERATED AUTOMATICALLY
  *
  *  THIS FILE SHOULD NOT BE EDITED BY HAND
  *
  */

import {_val, _form} from "@netuno/server-types";

_form.createIfNotExists(
	_val.map()
		.set("big", false)
		.set("control_active", true)
		.set("control_group", false)
		.set("control_user", false)
		.set("description", "")
		.set("export_id", false)
		.set("export_json", true)
		.set("export_lastchange", false)
		.set("export_uid", true)
		.set("export_xls", true)
		.set("export_xml", true)
		.set("firebase", "")
		.set("name", "notification_settings")
		.set("parent_uid", "d395b86d-9985-472e-9b02-ae1c8dcd1c38")
		.set("reorder", 0)
		.set("report", false)
		.set("report_behaviour", 0)
		.set("show_id", true)
		.set("title", "Configura\u00E7\u00F5es")
		.set("uid", "b881807d-7f60-45b9-888d-81695755a1ea")
);
_form.createComponentIfNotExists(
	"b881807d-7f60-45b9-888d-81695755a1ea",
	_val.map()
		.set("colspan", 0)
		.set("firebase", "")
		.set("group_id", 0)
		.set("height", 0)
		.set("mandatory", true)
		.set("max", 0)
		.set("min", 0)
		.set("name", "profile_id")
		.set("properties", "{\"COLUMN_SEPARATOR\":{\"default\":\" - \",\"type\":\"LINK_SEPARATOR\",\"value\":\" - \"},\"LINK\":{\"default\":\"\",\"type\":\"LINK\",\"value\":\"profile:name,email\"},\"MAX_COLUMN_LENGTH\":{\"default\":\"0\",\"type\":\"INTEGER\",\"value\":\"0\"},\"ONLY_ACTIVES\":{\"default\":\"false\",\"type\":\"BOOLEAN\",\"value\":\"false\"},\"SERVICE\":{\"default\":\"com/Select.netuno\",\"type\":\"STRING\",\"value\":\"com/Select.netuno\"}}")
		.set("rowspan", 0)
		.set("tdheight", 0)
		.set("tdwidth", 0)
		.set("title", "Perfil")
		.set("type", "select")
		.set("uid", "fdf3d3f5-1587-45b8-a536-175d52a29e40")
		.set("unique", false)
		.set("user_id", 0)
		.set("whenedit", true)
		.set("whenexport", true)
		.set("whenfilter", true)
		.set("whennew", true)
		.set("whenresult", true)
		.set("whenview", true)
		.set("width", 0)
		.set("x", 1)
		.set("y", 1)
);
_form.createComponentIfNotExists(
	"b881807d-7f60-45b9-888d-81695755a1ea",
	_val.map()
		.set("colspan", 0)
		.set("firebase", "")
		.set("group_id", 0)
		.set("height", 0)
		.set("mandatory", true)
		.set("max", 0)
		.set("min", 0)
		.set("name", "type_id")
		.set("properties", "{\"COLUMN_SEPARATOR\":{\"default\":\" - \",\"type\":\"LINK_SEPARATOR\",\"value\":\" - \"},\"LINK\":{\"default\":\"\",\"type\":\"LINK\",\"value\":\"notification_type:code,name\"},\"MAX_COLUMN_LENGTH\":{\"default\":\"0\",\"type\":\"INTEGER\",\"value\":\"0\"},\"ONLY_ACTIVES\":{\"default\":\"false\",\"type\":\"BOOLEAN\",\"value\":\"false\"},\"SERVICE\":{\"default\":\"com/Select.netuno\",\"type\":\"STRING\",\"value\":\"com/Select.netuno\"}}")
		.set("rowspan", 0)
		.set("tdheight", 0)
		.set("tdwidth", 0)
		.set("title", "Tipo")
		.set("type", "select")
		.set("uid", "f3052e15-0e8a-4abb-9b55-155f68ce9d3f")
		.set("unique", false)
		.set("user_id", 0)
		.set("whenedit", true)
		.set("whenexport", true)
		.set("whenfilter", true)
		.set("whennew", true)
		.set("whenresult", true)
		.set("whenview", true)
		.set("width", 0)
		.set("x", 1)
		.set("y", 2)
);
