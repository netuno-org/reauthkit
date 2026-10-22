import { _req, _db, _header, _exec, _storage, _out } from "@netuno/server-types";

let dbProfile = null;

const uid = _req.getString("uid");

if (uid) {
  dbProfile = _db.get("profile", uid);
}

if (!dbProfile) {
  _header.status(404);
  _exec.stop();
}

const dbAvatarName = dbProfile.getString("avatar");

if (!dbAvatarName) {
  _header.status(404);
  _exec.stop();
}

const storageAvatarFile = _storage.database(
  "profile",
  "avatar",
  dbAvatarName
);

if (storageAvatarFile.extension() === "jpg" || storageAvatarFile.extension() === "jpeg") {
  _header.contentTypeJPG();
} else {
  _header.contentTypePNG();
}
_header.noCache();

_out.copy(storageAvatarFile.inputStream());
