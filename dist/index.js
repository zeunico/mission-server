var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/config.ts
var import_path = require("path");
var import_process = __toESM(require("process"));
var dotenv = __toESM(require("dotenv"));
dotenv.config();
var secretKeyMission = "eKYnXyM16OPHyHonAAPX7celYKBLXF1h";
var _a;
var DB_HOST = (_a = import_process.default.env.DB_HOST) != null ? _a : "127.0.0.1";
var _a2;
var DB_PORT = (_a2 = import_process.default.env.DB_PORT) != null ? _a2 : 27017;
var _a3;
var DB_NAME = (_a3 = import_process.default.env.DB_NAME) != null ? _a3 : "mission";
var _a4;
var DB_USER = (_a4 = import_process.default.env.DB_USER) != null ? _a4 : "missionUser";
var _a5;
var DB_PASSWORD = (_a5 = import_process.default.env.DB_PASSWORD) != null ? _a5 : "Mi$$ioN24";
var _a6;
var DB_AUTH_SOURCE = (_a6 = import_process.default.env.DB_AUTH_SOURCE) != null ? _a6 : "mission";
var _a7;
var DB_AUTH_MECHANISM = (_a7 = import_process.default.env.DB_AUTH_MECHANISM) != null ? _a7 : "SCRAM-SHA-256";
var dbUri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_AUTH_SOURCE}&authMechanism=${DB_AUTH_MECHANISM}`;
if (DB_USER && DB_PASSWORD)
  dbUri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_AUTH_SOURCE}&authMechanism=${DB_AUTH_MECHANISM}`;
var _a8, _b, _c, _d, _e;
var config2 = {
  DB_URI: dbUri,
  API_PORT: (_a8 = import_process.default.env.PORT) != null ? _a8 : 3e3,
  ATTACHEMENT_SRC: (_b = import_process.default.env.ATTACHEMENT_SRC) != null ? _b : (0, import_path.join)(__dirname, "..", "media"),
  MOBITEACH_URL: (_c = import_process.default.env.MOBITEACH_URL) != null ? _c : "https://demo.mobiteach.net/",
  MOBITEACH_MOBIAPP_API: ((_d = import_process.default.env.MOBITEACH_URL) != null ? _d : "https://demo.mobiteach.net/") + "html/mobiApp/",
  SSL_KEY: import_process.default.env.SSL_KEY !== "" ? import_process.default.env.SSL_KEY : void 0,
  SSL_CERT: import_process.default.env.SSL_CERT !== "" ? import_process.default.env.SSL_CERT : void 0,
  BASE_URL: (_e = import_process.default.env.BASE_URL) != null ? _e : "https://missions.mobiteach.fr/"
};

// src/index.ts
var import_cors = __toESM(require("cors"));
var import_express9 = __toESM(require("express"));
var import_mongoose15 = __toESM(require("mongoose"));

// src/resources/media/media.controller.ts
var import_multer = __toESM(require("multer"));

// types/media.enum.ts
var EMedia = /* @__PURE__ */ ((EMedia2) => {
  EMedia2["IMAGE"] = "image";
  EMedia2["VIDEO"] = "video";
  EMedia2["AUDIO"] = "audio";
  EMedia2["TEXT"] = "text";
  return EMedia2;
})(EMedia || {});
var media_enum_default = EMedia;

// src/utils/exceptions.ts
var Exception = class extends Error {
  constructor(error, status) {
    super(error);
    this.error = error;
    this.status = status;
    this.error = error;
    this.status = status;
  }
};
var NotFoundException = class extends Exception {
  constructor(error) {
    super(error, 404);
  }
};
var BadRequestException = class extends Exception {
  constructor(error) {
    super(error, 400);
  }
};

// src/utils/file.utils.ts
var import_path2 = require("path");
var import_axios = __toESM(require("axios"));
var import_fs = require("fs");
var import_os = require("os");
var import_promises = require("fs/promises");
var getFileTypeByExtension = (extension) => {
  switch (extension) {
    case ".jpg":
    case ".png":
    case ".jpeg":
      return media_enum_default.IMAGE;
    case ".mp4":
      return media_enum_default.VIDEO;
    case ".mp3":
    case ".flac":
      return media_enum_default.AUDIO;
    default:
      throw new BadRequestException("Le type de fichier n'est pas reconnu");
  }
};
var getFileNameFormatted = (filename, extension) => {
  return filename.substring(0, filename.length - extension.length) + "_" + Date.now() + extension;
};
var downloadFile = async (url) => {
  const filename = url.split("/").pop();
  const tmpUri = (0, import_path2.join)((0, import_os.tmpdir)(), filename);
  const writer = (0, import_fs.createWriteStream)(tmpUri);
  try {
    const res = await import_axios.default.get(url, { responseType: "stream" });
    await new Promise((resolve, reject) => {
      let error = null;
      res.data.pipe(writer);
      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on("close", () => {
        if (!error)
          resolve(true);
      });
    });
    const buffer = await (0, import_promises.readFile)(tmpUri);
    (0, import_promises.unlink)(tmpUri);
    return [buffer, filename];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// src/resources/media/media.controller.ts
var import_express = require("express");
var import_mongoose3 = require("mongoose");

// src/db/user.model.ts
var import_mongoose = __toESM(require("mongoose"));
var UserSchema = new import_mongoose.default.Schema({
  "email": {
    type: String,
    unique: false,
    required: true
  },
  "firstname": {
    type: String,
    unique: false,
    required: true
  },
  "lastname": {
    type: String,
    unique: false,
    required: true
  },
  "picture": {
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Media"
  },
  "instructions": [{
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Instruction"
  }],
  "instance": {
    type: String,
    required: true
  },
  "roomId": {
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  }
}, { timestamps: true });
var User = import_mongoose.default.model("User", UserSchema);
var user_model_default = User;

// src/resources/users/users.service.ts
var import_path3 = require("path");
var UsersService = class {
  // Trouve tous les utilisateurs
  async findAll() {
    const userList = await user_model_default.find();
    return userList;
  }
  // trouve un utilisateur en particulier
  async find(_id) {
    const researchedUser = await user_model_default.findById(_id);
    return researchedUser;
  }
  // trouve un utilisateur via l'email
  async findByEmail(email, instance, room) {
    const researchedUser = await user_model_default.findOne({ email, instance, room });
    return researchedUser;
  }
  async findByInstance(instance) {
    const userList = await user_model_default.find({ instance });
    return userList;
  }
  // Crée un utilisateur
  async create(userData) {
    const newUser = __spreadValues({}, userData);
    return await user_model_default.create(newUser);
  }
  // Met à jour un utilisateur en particulier
  async update(userData, _id) {
    const modifiedUser = await user_model_default.findByIdAndUpdate(_id, userData, { new: true });
    console.log("yep c ici");
    console.log(await user_model_default.findOne(_id));
    return modifiedUser;
  }
  // Suppression d'un utilisateur
  async delete(_id) {
    await user_model_default.findByIdAndDelete(_id);
  }
  async findUserImage(_id) {
    const user = await user_model_default.findById(_id, { picture: 1 }).populate("picture").exec();
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    if (!user.picture || user.picture === null) {
      return (0, import_path3.join)(config2.ATTACHEMENT_SRC, "default.jpg");
    }
    return user.picture.path();
  }
};

// src/db/media.model.ts
var import_mongoose2 = __toESM(require("mongoose"));
var import_path4 = require("path");
var MediaSchema = new import_mongoose2.default.Schema({
  "type": {
    type: String,
    enum: Object.values(media_enum_default),
    required: true
  },
  "name": {
    type: String,
    required: true,
    unique: true
  },
  "userId": {
    type: import_mongoose2.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });
MediaSchema.method("path", function() {
  return (0, import_path4.join)(config2.ATTACHEMENT_SRC, this.userId.toString(), this.type + "s", this.name);
});
var MMedia = import_mongoose2.default.model("Media", MediaSchema);
var media_model_default = MMedia;

// src/resources/media/media.service.ts
var MediaService = class {
  // Trouve tout les médias d'un utilisateur
  async findAll(userId) {
    const mediaList = (await media_model_default.find()).filter((media) => media.userId.equals(userId));
    return mediaList;
  }
  // trouve un media en particulier pour un utilisateur donné
  async find(mediaId) {
    const researchedMedia = await media_model_default.findById(mediaId);
    return researchedMedia;
  }
  // Trouve la liste des médias pour un utilisateur donné
  async findByUserId(userId) {
    const mediaList = await media_model_default.find({ userId }).exec();
    return mediaList;
  }
  // Créé un média
  async create(userId, mediaData) {
    const newMedia = __spreadProps(__spreadValues({}, mediaData), {
      userId
    });
    console.log("Nouveau document Media", newMedia);
    return await media_model_default.create(newMedia);
  }
  // Supprime un media
  async delete(_id) {
    const deletedMedia = await media_model_default.findByIdAndDelete(_id);
    console.log("Media supprim\xE9 !");
    return deletedMedia;
  }
};

// src/resources/media/media.controller.ts
var import_path5 = require("path");
var import_fs2 = __toESM(require("fs"));
var MediaController = (0, import_express.Router)();
var mediaService = new MediaService();
var userService = new UsersService();
var fileStorage = import_multer.default.diskStorage({
  // définit le dossier de destination à partir de l'ID de l'utilisateur
  destination: function(req, file, cb) {
    const extension = (0, import_path5.extname)(file.originalname);
    try {
      const folder = getFileTypeByExtension(extension);
      req.body.type = folder;
      const dest = (0, import_path5.join)(config2.ATTACHEMENT_SRC, req.body.userId, folder + "s");
      if (!import_fs2.default.existsSync(dest)) {
        import_fs2.default.mkdirSync(dest, { recursive: true });
      }
      cb(null, (0, import_path5.join)(dest));
    } catch (err) {
      cb(err, "");
    }
  },
  filename: function(req, file, cb) {
    const extension = (0, import_path5.extname)(file.originalname);
    try {
      const fileName = getFileNameFormatted(file.originalname, extension);
      req.body.name = fileName;
      cb(null, fileName);
    } catch (err) {
      cb(err, "");
    }
  }
});
var fileUpload = (0, import_multer.default)({
  storage: fileStorage
});
MediaController.route("/").post(fileUpload.single("file"), async (req, res, next) => {
  try {
    const userId = new import_mongoose3.Types.ObjectId(req.body.userId);
    const user = await userService.find(userId);
    if (!user) {
      console.log("mauvais id user -- media controller");
      throw new NotFoundException("Mauvais ID utilisateur");
    }
    const createdMedia = await mediaService.create(userId, req.body);
    console.log("media cr\xE9\xE9 via media / ", createdMedia);
    return res.status(201).json(createdMedia);
  } catch (err) {
    next(err);
  }
});
MediaController.route("/user/:userId([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const userId = new import_mongoose3.Types.ObjectId(req.params.userId);
    const user = await userService.find(userId);
    if (!user) {
      throw new NotFoundException("Mauvais ID utilisateur");
    }
    const mediaList = await mediaService.findAll(userId);
    return res.status(200).json(mediaList);
  } catch (err) {
    next(err);
  }
});
MediaController.route("/:mediaId([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const mediaId = new import_mongoose3.Types.ObjectId(req.params.mediaId);
    const media = await mediaService.find(mediaId);
    if (!media) {
      throw new NotFoundException("Media introuvable");
    }
    res.sendFile((0, import_path5.join)(config2.ATTACHEMENT_SRC, media.userId.toString(), media.type + "s", media.name));
  } catch (err) {
    next(err);
  }
}).delete(async (req, res, next) => {
  try {
    const mediaId = new import_mongoose3.Types.ObjectId(req.params.mediaId);
    const media = await mediaService.find(mediaId);
    if (!media) {
      throw new NotFoundException("Media introuvable");
    }
    import_fs2.default.unlinkSync((0, import_path5.join)(config2.ATTACHEMENT_SRC, media.userId.toString(), media.type + "s", media.name));
    await mediaService.delete(mediaId);
    return res.status(200).json();
  } catch (err) {
    next(err);
  }
});
var media_controller_default = MediaController;

// src/resources/thumb/thumb.controller.ts
var import_multer2 = __toESM(require("multer"));
var import_express2 = require("express");
var import_mongoose5 = require("mongoose");

// src/db/thumb.model.ts
var import_mongoose4 = __toESM(require("mongoose"));
var import_path6 = require("path");
var ThumbSchema = new import_mongoose4.default.Schema({
  "type": {
    type: String,
    enum: Object.values(media_enum_default),
    required: true
  },
  "userId": {
    type: import_mongoose4.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  "name": {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });
ThumbSchema.method("path", function() {
  return (0, import_path6.join)(config2.ATTACHEMENT_SRC, this.userId.toString(), "thumbs");
});
var MThumb = import_mongoose4.default.model("Thumb", ThumbSchema);
var thumb_model_default = MThumb;

// src/resources/thumb/thumb.service.ts
var ThumbService = class {
  async create(userId, thumbData) {
    const newThumb = __spreadProps(__spreadValues({}, thumbData), {
      userId
    });
    console.log("new thumb", newThumb);
    return await thumb_model_default.create(newThumb);
  }
  async update(thumbId, thumbData) {
    try {
      const updatedThumb = await thumb_model_default.findByIdAndUpdate(thumbId, thumbData, { new: true });
      return updatedThumb;
    } catch (error) {
      console.error("Error updating thumb:", error);
      return null;
    }
  }
  async findAll(userId) {
    const thumbList = (await thumb_model_default.find()).filter((thumb) => thumb.userId.equals(userId));
    return thumbList;
  }
  // trouve un thumb en particulier pour un utilisateur donné
  async find(thumbId) {
    const researchedThumb = await thumb_model_default.findById(thumbId);
    return researchedThumb;
  }
  // renvoyer le nom 
  async name(thumb) {
    return thumb.name;
  }
  // renvoyer l ID 
  async _id(thumb) {
    return thumb._id;
  }
  async updateById(_id, name) {
    try {
      const thumb = await thumb_model_default.findById(_id);
      if (thumb) {
        name = name + ".png";
        const updatedThumb = await thumb.save();
        return updatedThumb;
      } else {
        throw new Error("Thumb not found");
      }
    } catch (error) {
      console.error("Error updating thumb by ID:", error);
      return null;
    }
  }
};

// src/resources/thumb/thumb.controller.ts
var import_path7 = require("path");
var import_fs3 = __toESM(require("fs"));
var ThumbController = (0, import_express2.Router)();
var thumbService = new ThumbService();
var userService2 = new UsersService();
var fileStorage2 = import_multer2.default.diskStorage({
  // définit le dossier de destination à partir de l'ID de l'utilisateur
  destination: function(req, file, cb) {
    try {
      const dest = (0, import_path7.join)(config2.ATTACHEMENT_SRC, req.body.userId, "thumbs");
      if (!import_fs3.default.existsSync(dest)) {
        import_fs3.default.mkdirSync(dest, { recursive: true });
      }
      cb(null, (0, import_path7.join)(dest));
    } catch (err) {
      cb(err, "");
    }
  },
  filename: function(req, file, cb) {
    const extension = "zaza";
    try {
      const fileName = getFileNameFormatted(file.originalname, extension);
      req.body.name = fileName;
      cb(null, fileName);
    } catch (err) {
      cb(err, "");
    }
  }
});
var fileUpload2 = (0, import_multer2.default)({
  storage: fileStorage2
});
ThumbController.route("/").post(fileUpload2.single("file"), async (req, res, next) => {
  try {
    console.log("ADC");
    const userId = new import_mongoose5.Types.ObjectId(req.body.userId);
    const user = await userService2.find(userId);
    if (!user) {
      throw new NotFoundException("Mauvais ID utilisateur");
    }
    const createdThumb = await thumbService.create(userId, req.body);
    return res.status(201).json(createdThumb);
  } catch (err) {
    next(err);
  }
});
ThumbController.route("/user/:userId([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const userId = new import_mongoose5.Types.ObjectId(req.params.userId);
    const user = await userService2.find(userId);
    if (!user) {
      throw new NotFoundException("Mauvais ID utilisateur");
    }
    const thumbList = await thumbService.findAll(userId);
    return res.status(200).json(thumbList);
  } catch (err) {
    next(err);
  }
});
ThumbController.route("/:thumbId([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const thumbId = new import_mongoose5.Types.ObjectId(req.params.thumbId);
    const thumb = await thumbService.find(thumbId);
    if (!thumb) {
      throw new NotFoundException("Thumb introuvable");
    }
    res.sendFile((0, import_path7.join)(config2.ATTACHEMENT_SRC, thumb.userId.toString(), "thumbs", thumb.name));
  } catch (err) {
    next(err);
  }
});
var thumb_controller_default = ThumbController;

// src/resources/users/users.controller.ts
var import_express3 = require("express");
var import_mongoose7 = require("mongoose");

// src/db/room.model.ts
var import_mongoose6 = __toESM(require("mongoose"));
var RoomSchema = new import_mongoose6.default.Schema({
  "roomCode": {
    type: String,
    required: true
  },
  "moderatorId": {
    type: import_mongoose6.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  "participants": [{
    type: import_mongoose6.Schema.Types.ObjectId,
    ref: "User"
  }],
  "mission": [{
    type: import_mongoose6.Schema.Types.ObjectId,
    ref: "Mission"
  }]
}, { timestamps: true });
var Room = import_mongoose6.default.model("Room", RoomSchema);
var room_model_default = Room;

// src/resources/room/room.service.ts
var RoomService = class {
  // Creation d une nouvelle salle
  static async create(data) {
    const newRoom = __spreadValues({}, data);
    console.log("room.service : nouvelle salle \xE0 cr\xE9er", newRoom);
    return await room_model_default.create(newRoom);
  }
  // Met à jour une salle en particulier
  static async update(roomData, _id) {
    const modifiedRoom = await room_model_default.findByIdAndUpdate(_id, roomData, { new: true });
    console.log("room service update");
    console.log(await room_model_default.findOne(_id));
    return modifiedRoom;
  }
  static async findByCode(roomCode) {
    const researchedRoom = await room_model_default.findOne({ roomCode });
    return researchedRoom;
  }
  static async findById(_id) {
    const researchedRoom = await room_model_default.findOne({ _id });
    return researchedRoom;
  }
  // Trouve tous les salles
  static async findAll() {
    const allRoom = await room_model_default.find();
    return allRoom;
  }
};

// src/resources/users/users.controller.ts
var import_path8 = require("path");
var import_fs4 = __toESM(require("fs"));
var import_promises2 = require("fs/promises");

// src/middlewares/token.handler.ts
var import_crypto = __toESM(require("crypto"));
var TokenHandler = () => {
  const iv = import_crypto.default.randomBytes(16);
  const timestamp = Date.now() / 1e3 | 0;
  const cipher = import_crypto.default.createCipheriv("aes-256-ctr", secretKeyMission, iv);
  const encrypted = Buffer.concat([cipher.update(timestamp.toString()), cipher.final()]);
  const data = {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex")
  };
  const convertToBase64 = Buffer.from(JSON.stringify(data));
  return convertToBase64.toString("base64");
};

// src/resources/users/users.controller.ts
var import_axios2 = __toESM(require("axios"));
var UsersController = (0, import_express3.Router)();
var service = new UsersService();
var mediaService2 = new MediaService();
async function createDefaultRoom(roomCode) {
  try {
    const users = service.findAll();
    console.log("users", users);
    const roomData = {
      _id: new import_mongoose7.Types.ObjectId(),
      moderatorId: new import_mongoose7.Types.ObjectId("633aef06eb42397b214af9f3"),
      roomCode,
      participants: [],
      mission: []
    };
    const createdRoom = await RoomService.create(roomData);
    console.log("Created Room:", createdRoom);
  } catch (error) {
    console.error("Error creating room:", error);
  }
}
UsersController.route("/").get(async (req, res) => {
  const userList = await service.findAll();
  return res.status(200).json(userList);
}).post(async (req, res) => {
  const createdUser = await service.create(req.body);
  return res.status(201).json(createdUser);
});
UsersController.route("/:email([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-z]{2,3})").get(async (req, res, next) => {
  var _a9;
  try {
    const email = req.params.email;
    let user;
    if (req.query.instance) {
      user = await service.findByEmail(email, req.query.instance.toString());
      console.log("req.query.instance.toString()", req.query.instance.toString());
      console.log("user by findByEmail", user);
    } else {
      user = await service.findByEmail(email);
    }
    const roomCode = (_a9 = req.query.roomCode) == null ? void 0 : _a9.toString();
    let room;
    if (roomCode) {
      room = await RoomService.findByCode(roomCode);
      if (room === null) {
        createDefaultRoom(roomCode);
        room = await RoomService.findByCode(roomCode);
      }
    }
    if (req.query.roomCode) {
      await import_axios2.default.post("https://" + req.query.instance + "/html/mobiApp/connect", {
        "roomCode": req.query.roomCode,
        "userEmail": email
      }, { headers: { "mission-token": TokenHandler() } }).then(async (resAxios) => {
        if (!user) {
          if (room) {
            user = await service.create({
              _id: new import_mongoose7.Types.ObjectId(resAxios.data.user.id),
              email,
              firstname: resAxios.data.user.firstname,
              lastname: resAxios.data.user.lastname,
              picture: null,
              instructions: [],
              instance: req.query.instance !== void 0 ? req.query.instance.toString() : config2.MOBITEACH_URL,
              roomId: room._id
            });
            console.log("room", room);
            console.log("user._id", user._id);
            room.participants.push(user._id);
            RoomService.update(room, room._id);
          } else {
            console.error("Pas de Room, room is null");
          }
          const userPicture = resAxios.data.user.image;
          if (userPicture && userPicture !== "") {
            const [file, filename] = await downloadFile(resAxios.data.user.image);
            const media = await mediaService2.create(user._id, {
              name: user._id + "_profile" + (0, import_path8.extname)(filename),
              type: media_enum_default.IMAGE
            });
            const dest = media.path().split(import_path8.sep).slice(0, -1).join(import_path8.sep);
            if (!(0, import_fs4.existsSync)(dest)) {
              await (0, import_promises2.mkdir)(dest, { recursive: true });
            }
            await (0, import_promises2.writeFile)(media.path(), file);
            user = await service.update({ picture: media._id }, user._id);
          }
        }
      }).catch((err) => {
        console.log("ERROR", err);
      });
    } else if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});
UsersController.route("/:id([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const id = new import_mongoose7.Types.ObjectId(req.params.id);
    const user = await service.find(id);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    } else if (req.query.roomCode) {
      await import_axios2.default.post("https://" + user.instance + "/html/mobiApp/disconnect", {
        "roomCode": req.query.roomCode,
        "userId": id
      }, { headers: { "mission-token": TokenHandler() } }).catch((err) => {
        console.log(err);
      });
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}).put(async (req, res) => {
  const id = new import_mongoose7.Types.ObjectId(req.params.id);
  const userData = req.body;
  const updatedUser = await service.update(userData, id);
  return res.status(200).json(updatedUser);
}).delete(async (req, res, next) => {
  try {
    const id = new import_mongoose7.Types.ObjectId(req.params.id);
    const user = await service.find(id);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    if (user.picture && user.picture !== null) {
      await mediaService2.delete(user.picture);
    }
    if (import_fs4.default.existsSync((0, import_path8.join)(config2.ATTACHEMENT_SRC, id.toString()))) {
      import_fs4.default.rm((0, import_path8.join)(config2.ATTACHEMENT_SRC, id.toString()), { recursive: true }, (err) => {
        if (err) {
          throw err;
        }
      });
    }
    const deletedUser = await service.delete(id);
    return res.status(200).json(deletedUser);
  } catch (err) {
    next(err);
  }
});
UsersController.route("/:id([a-z0-9]{24})/image").get(async (req, res, next) => {
  try {
    const id = new import_mongoose7.Types.ObjectId(req.params.id);
    const path = await service.findUserImage(id);
    return res.sendFile(path);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
UsersController.route("/:id([a-z0-9]{24})/ismoderator").get(async (req, res, next) => {
  try {
    const id = new import_mongoose7.Types.ObjectId(req.params.id);
    const user = await service.find(id);
    console.log("user id", user);
    const room = new import_mongoose7.Types.ObjectId(req.params.roomId);
    await RoomService.findById(room);
    console.log("room", room);
    const isModeratorStatus = await isModerator(user, room);
    return res.status(200).json({ isModerator: isModeratorStatus });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
async function isModerator(user, room) {
  const researchedRoom = await room_model_default.findById(room);
  if (researchedRoom && researchedRoom.moderatorId.toString() === user._id.toString()) {
    return true;
  } else {
    return false;
  }
}
var users_controller_default = UsersController;

// src/resources/userData/userData.controller.ts
var import_multer3 = __toESM(require("multer"));
var import_express4 = require("express");
var import_mongoose9 = require("mongoose");

// src/db/userData.model.ts
var import_mongoose8 = __toESM(require("mongoose"));
var UserDataSchema = new import_mongoose8.default.Schema({
  "mediaId": {
    type: import_mongoose8.Schema.Types.ObjectId,
    ref: "Media",
    required: false
  },
  "thumbId": {
    type: import_mongoose8.Schema.Types.ObjectId,
    ref: "Thumb",
    required: false
  },
  "description": {
    type: String,
    required: true
  },
  "room": {
    type: String,
    required: true
  },
  "userId": {
    type: import_mongoose8.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  "instance": {
    type: String,
    required: true
  }
}, { timestamps: true });
var MUserData = import_mongoose8.default.model("UserData", UserDataSchema);
var userData_model_default = MUserData;

// src/resources/userData/userData.service.ts
var UserDataService = class {
  /**
   * Crée une réponse à partir des informations données par l'utilisateur
   * @param userId 
   * @param datas 
   * @returns 
   */
  async createUserData(user, mediaId, thumbId, datas) {
    const newUserData = __spreadProps(__spreadValues({}, datas), {
      mediaId: mediaId ? mediaId : void 0,
      thumbId: thumbId ? thumbId : void 0,
      userId: user._id,
      instance: user.instance
    });
    console.log("new userdata", newUserData);
    return await userData_model_default.create(newUserData);
  }
  // Trouve l'entièreté des réponses uploadées
  async findAll(room, instance) {
    const userDataList = await userData_model_default.find({ room, instance }).populate("mediaId", "type _id").exec();
    return userDataList;
  }
  // Trouve la liste des réponses pour un utilisateur donné
  async findByUserId(user, room) {
    if (!room) {
      return await userData_model_default.find({ userId: user._id }).populate("mediaId", "type").exec();
    }
    const userDataList = await userData_model_default.find({ userId: user._id, instance: user.instance, room }).populate("mediaId", "type").exec();
    return userDataList;
  }
  // Trouve une réponse en particulier pour un utilisateur donné
  async find(userDataId) {
    const researchedData = await userData_model_default.findById(userDataId);
    return researchedData;
  }
  // supprime une réponse
  async delete(userDataId) {
    const deletedData = await userData_model_default.findByIdAndDelete(userDataId);
    return deletedData;
  }
  // vide la table de réponses
  async clear() {
    await userData_model_default.deleteMany({});
  }
};

// src/resources/userData/userData.controller.ts
var import_path9 = require("path");
var import_fs5 = __toESM(require("fs"));
var import_axios3 = __toESM(require("axios"));
var UserDataController = (0, import_express4.Router)();
var userDataService = new UserDataService();
var mediaService3 = new MediaService();
var userService3 = new UsersService();
var thumbService2 = new ThumbService();
var fileStorage3 = import_multer3.default.diskStorage({
  // définit le dossier de destination à partir de l'ID de l'utilisateur
  destination: function(req, file, cb) {
    const extension = (0, import_path9.extname)(file.originalname);
    try {
      const folder = getFileTypeByExtension(extension);
      req.body.type = folder;
      const dest = (0, import_path9.join)(config2.ATTACHEMENT_SRC, req.body.userId, folder + "s");
      console.log("dest dans userData controller", dest);
      if (!import_fs5.default.existsSync(dest)) {
        import_fs5.default.mkdirSync(dest, { recursive: true });
      }
      cb(null, (0, import_path9.join)(dest));
    } catch (err) {
      cb(err, "");
    }
  },
  filename: function(req, file, cb) {
    const extension = (0, import_path9.extname)(file.originalname);
    try {
      const fileName = getFileNameFormatted(file.originalname, extension);
      req.body.name = fileName;
      cb(null, fileName);
    } catch (err) {
      cb(err, "");
    }
  }
});
var fileupload = (0, import_multer3.default)({
  storage: fileStorage3
});
UserDataController.route("/").post(fileupload.single("file"), async (req, res, next) => {
  var _a9, _b2, _c2;
  try {
    const userId = new import_mongoose9.Types.ObjectId(req.body.userId);
    const user = await userService3.find(userId);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    let media = void 0;
    console.log("ok");
    let thumb = void 0;
    if (req.file) {
      media = await mediaService3.create(userId, req.body);
      thumb = await thumbService2.create(userId, req.body);
      if (!import_fs5.default.existsSync(thumb.path())) {
        import_fs5.default.mkdirSync(thumb.path(), { recursive: true });
        console.log("mkdir thumbs created !!");
      }
      const originalFilePath = media.path();
      const outputFilePath = thumb.path() + "/" + thumb.name;
      if (media.type == "image") {
        (async () => {
          const imageThumbnail = require("image-thumbnail");
          try {
            const thumbnail = await imageThumbnail(originalFilePath);
            import_fs5.default.writeFileSync(outputFilePath, thumbnail);
          } catch (err) {
            console.error(err);
          }
        })();
      } else if (media.type == "video") {
        const outputThumbDir = `${thumb.path()}/`;
        const ffmpegStatic = require("ffmpeg-static");
        const ffmpeg = require("fluent-ffmpeg");
        ffmpeg.setFfmpegPath(ffmpegStatic);
        const thumbId = thumb == null ? void 0 : thumb._id;
        const newName = thumb ? thumb.name + ".png" : "";
        ffmpeg(originalFilePath).on("filenames", function(filenames) {
          console.log("Pr\xEAt pour  " + filenames.join(", "));
        }).on("end", function() {
          console.log("Screenshots vid ok");
          async function updateThumbName(thumbId2, newName2) {
            try {
              const result = await thumb_model_default.updateOne(
                { _id: thumbId2 },
                { $set: { name: newName2 } }
              );
              console.log(`Mise \xE0 jour du document MongoDB : ok`);
            } catch (error) {
              console.error("Mise \xE0 jour du document MongoDB : une erreur est survenue.", error);
            }
          }
          updateThumbName(thumbId, newName);
        }).screenshots({
          count: 1,
          filename: thumb.name + ".png",
          folder: outputThumbDir
        });
      }
    }
    const newUserData = await userDataService.createUserData(user, media == null ? void 0 : media._id, thumb == null ? void 0 : thumb._id, req.body);
    import_axios3.default.post("https://" + user.instance + "/html/mobiApp/data", {
      "roomCode": newUserData.room,
      "userId": newUserData.userId,
      "data": {
        "id": newUserData._id.toString(),
        "type": (_a9 = media == null ? void 0 : media.type) != null ? _a9 : media_enum_default.TEXT,
        "media": (_c2 = (_b2 = newUserData.mediaId) == null ? void 0 : _b2.toString()) != null ? _c2 : void 0,
        "description": newUserData.description
      }
    }, { headers: { "mission-token": TokenHandler() } }).catch((err) => {
      console.log(err);
    });
    return res.status(201).json(newUserData);
  } catch (err) {
    next(err);
  }
}).delete(async (req, res, next) => {
  try {
    await userDataService.clear();
    return res.status(200).json();
  } catch (err) {
    next(err);
  }
});
UserDataController.route("/:id([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const userDataId = new import_mongoose9.Types.ObjectId(req.params.id);
    const userData = await userDataService.find(userDataId);
    if (!userData) {
      throw new NotFoundException("R\xE9ponse introuvable");
    }
    return res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
}).delete(async (req, res, next) => {
  try {
    const userDataId = new import_mongoose9.Types.ObjectId(req.params.id);
    const userData = await userDataService.find(userDataId);
    if (!userData) {
      throw new NotFoundException("R\xE9ponse introuvable");
    }
    await import_axios3.default.delete("https://" + userData.instance + "/html/mobiApp/data/?roomCode=" + userData.room + "&userId=" + userData.userId + "&dataId=" + userDataId, { headers: { "mission-token": TokenHandler() } }).then(async () => {
      try {
        await userDataService.delete(userDataId);
        if (userData.mediaId) {
          await mediaService3.delete(userData.mediaId);
          console.log("Media supprim\xE9 !");
        }
      } catch (mediaErr) {
        console.log("Erreur \xE0 la suppression du media:", mediaErr);
      }
    }).catch(async (err) => {
      await userDataService.delete(userDataId);
      console.log(err);
    });
    console.log("R\xE9ponse supprim\xE9e !");
    return res.status(200).json();
  } catch (err) {
    next(err);
  }
});
UserDataController.route("/:room([a-z0-9]{6})").get(async (req, res, next) => {
  try {
    if (req.params.room !== req.params.room.toUpperCase()) {
      throw new NotFoundException("Room code invalide");
    }
    let dataList;
    if (req.query.instance) {
      dataList = await userDataService.findAll(req.params.room, req.query.instance.toString());
    } else {
      dataList = await userDataService.findAll(req.params.room);
    }
    const parsedDataList = dataList.map((data) => {
      var _a9, _b2, _c2;
      return {
        "userId": data.userId,
        "data": {
          "id": data._id,
          "type": (_b2 = (_a9 = data.mediaId) == null ? void 0 : _a9.type) != null ? _b2 : media_enum_default.TEXT,
          "media": (_c2 = data.mediaId) == null ? void 0 : _c2._id,
          "description": data.description
        }
      };
    });
    console.log(parsedDataList);
    if (parsedDataList.length !== 0) {
      await import_axios3.default.post("https://" + req.query.instance + "/html/mobiApp/alldata", {
        "roomCode": req.params.room,
        "alldata": parsedDataList
      }, { headers: { "mission-token": TokenHandler() } }).catch((err) => {
        console.log(err);
        next(err);
      });
    }
    return res.status(200).json(dataList);
  } catch (err) {
    next(err);
  }
});
UserDataController.route("/:room([a-z0-9]{6})/:userId([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    if (req.params.room !== req.params.room.toUpperCase()) {
      throw new NotFoundException("Room code invalide");
    }
    const userId = new import_mongoose9.Types.ObjectId(req.params.userId);
    const user = await userService3.find(userId);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    const dataList = await userDataService.findByUserId(user, req.params.room);
    return res.status(200).json(dataList);
  } catch (err) {
    next(err);
  }
});
var userData_controller_default = UserDataController;

// src/resources/instruction/instruction.controller.ts
var import_express5 = require("express");

// src/db/instruction.model.ts
var import_mongoose10 = __toESM(require("mongoose"));
var InstructionSchema = new import_mongoose10.default.Schema({
  "consigne": {
    type: String,
    required: true
  },
  "room": {
    type: String,
    required: true
  },
  "userTarget": {
    type: import_mongoose10.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });
var MInstruction = import_mongoose10.default.model("Instruction", InstructionSchema);
var instruction_model_default = MInstruction;

// src/resources/instruction/instruction.service.ts
var InstructionService = class {
  /**
   * Crée une consigne à partir des informations données par l'utilisateur
   */
  async createInstruction(userTarget, datas) {
    const newInstruction = __spreadProps(__spreadValues({}, datas), {
      userTarget
    });
    return await instruction_model_default.create(newInstruction);
  }
  // Trouve l'entièreté des consignes uploadées
  async findAll(room) {
    const instructionList = await instruction_model_default.find({ room }).exec();
    return instructionList;
  }
  // Trouve la liste des consignes pour un utilisateur donné
  async findByUserId(userTarget, room) {
    const instructionList = await instruction_model_default.find({ userTarget, room }).exec();
    return instructionList;
  }
  // Trouve une consigne en particulier pour un utilisateur donné
  async find(instructionId) {
    const researchedInstruction = await instruction_model_default.findById(instructionId);
    return researchedInstruction;
  }
  // supprime une consigne
  async delete(instructionId) {
    const deletedInstruction = await instruction_model_default.findByIdAndDelete(instructionId);
    return deletedInstruction;
  }
  // vide la table de consignes
  async clear() {
    await instruction_model_default.deleteMany({});
  }
};

// src/resources/instruction/instruction.controller.ts
var import_mongoose11 = require("mongoose");
var InstructionController = (0, import_express5.Router)();
var instructionService = new InstructionService();
var usersService = new UsersService();
InstructionController.route("/").post(async (req, res, next) => {
  try {
    console.log("rq.body", req.body);
    const user = await usersService.find(req.body.userTarget);
    console.log("user instruction controller", user);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    const instruction = await instructionService.createInstruction(req.body.userTarget, req.body);
    user.instructions.push(instruction._id);
    usersService.update(user, user._id);
    console.log("instruction", instruction);
    console.log("user", user);
    return res.status(201).json(instruction);
  } catch (err) {
    next(err);
  }
}).delete(async (req, res, next) => {
  try {
    await instructionService.clear();
    return res.status(200).json();
  } catch (err) {
    next(err);
  }
});
InstructionController.route("/:InstructionId([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const instructionId = new import_mongoose11.Types.ObjectId(req.params.InstructionId);
    const instruction = await instructionService.find(instructionId);
    if (!instruction) {
      throw new NotFoundException("Instruction introuvable");
    }
    return res.status(200).json(instruction);
  } catch (err) {
    next(err);
  }
});
InstructionController.route("/:room([a-z0-9]{6})").get(async (req, res, next) => {
  try {
    const room = req.params.room;
    if (req.params.room !== req.params.room.toUpperCase()) {
      throw new NotFoundException("Room code invalide");
    }
    const instructions = await instructionService.findAll(room);
    return res.status(200).json(instructions);
  } catch (err) {
    next(err);
  }
});
InstructionController.route("/:room([a-z0-9]{6})/:userTarget([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const room = req.params.room;
    const userTarget = new import_mongoose11.Types.ObjectId(req.params.userTarget);
    if (room !== room.toUpperCase()) {
      throw new NotFoundException("Room code invalide");
    }
    const instructions = await instructionService.findByUserId(userTarget, room);
    return res.status(200).json(instructions);
  } catch (err) {
    next(err);
  }
});
var instruction_controller_default = InstructionController;

// src/resources/moodle/moodle.controller.ts
var import_express6 = require("express");
var MoodleController = (0, import_express6.Router)();
var userService4 = new UsersService();
var mediaService4 = new MediaService();
var userDataService2 = new UserDataService();
MoodleController.route("/users").get(async (req, res) => {
  const userList = await userService4.findAll();
  const parsedList = [];
  if (userList.length === 0)
    return res.status(404).json({ message: "moodle/users Pas de donn\xE9es participants dans cette instance" });
  userList.forEach((user) => {
    parsedList.push({
      _id: user._id,
      email: user.email,
      name: user.firstname + " " + user.lastname,
      picture: "https://missions.mobiteach.fr/medias/" + user.picture,
      instance: user.instance
    });
  });
  return res.status(200).json(parsedList);
});
MoodleController.route("/medias").get(async (req, res) => {
  const userList = await userService4.findAll();
  const mediaList = [];
  for (let i = 0; i < userList.length; i++) {
    mediaList.push(await mediaService4.findByUserId(userList[i]._id));
  }
  if (mediaList.length === 0)
    return res.status(404).json({ message: "Pas de media dans cette instance" });
  return res.status(200).json(mediaList);
});
MoodleController.route("/userDatas").get(async (req, res) => {
  const userList = await userService4.findAll();
  const userDataList = [];
  for (let i = 0; i < userList.length; i++) {
    userDataList.push(await userDataService2.findByUserId(userList[i]));
  }
  if (userDataList.length === 0)
    return res.status(404).json({ message: "Aucun participant ne s'est connect\xE9 \xE0  cette instance" });
  return res.status(200).json(userDataList);
});
MoodleController.route("/userDatas/:instance([a-zA-Z0-9]+.mobiteach.net)").get(async (req, res) => {
  const userList = await userService4.findByInstance(req.params.instance);
  const userDataList = [];
  for (let i = 0; i < userList.length; i++) {
    const userData = await userDataService2.findByUserId(userList[i]);
    userData.forEach((data) => {
      console.log("DATA: ", data.mediaId);
      userDataList.push({
        name: userList[i].firstname + " " + userList[i].lastname,
        room: data.room,
        picture: "https://missions.mobiteach.fr/users/" + userList[i]._id + "/image",
        answer: data.mediaId,
        description: data.description
      });
    });
  }
  res.status(200).json(userDataList);
});
var moodle_controller_default = MoodleController;

// src/resources/mission/mission.controller.ts
var import_express7 = require("express");
var import_mongoose13 = require("mongoose");

// src/db/mission.model.ts
var import_mongoose12 = __toESM(require("mongoose"));

// types/etat.enum.ts
var EEtat = /* @__PURE__ */ ((EEtat2) => {
  EEtat2[EEtat2["NON_DEMARREE"] = 0] = "NON_DEMARREE";
  EEtat2[EEtat2["EN_COURS"] = 1] = "EN_COURS";
  EEtat2[EEtat2["TERMINEE"] = 2] = "TERMINEE";
  return EEtat2;
})(EEtat || {});
var etat_enum_default = EEtat;

// src/db/mission.model.ts
var MissionSchema = new import_mongoose12.default.Schema({
  "titre": {
    type: String,
    unique: false,
    required: true
  },
  "roomId": {
    type: import_mongoose12.Schema.Types.ObjectId,
    unique: false,
    required: true,
    ref: "room"
  },
  "nb_activites": {
    type: Number,
    unique: false,
    required: true
  },
  "etat": {
    type: String,
    enum: Object.values(etat_enum_default),
    required: true
  },
  "visible": {
    type: Boolean
  },
  "active": {
    type: Boolean
  },
  "guidee": {
    type: Boolean
  },
  "visuel": {
    type: String
  }
}, { timestamps: true });
var Mission = import_mongoose12.default.model("Mission", MissionSchema);
var mission_model_default = Mission;

// src/resources/mission/mission.service.ts
var MissionService = class {
  // Creation d une nouvelle mission
  static async createMission(roomId, datas) {
    const newMission = __spreadProps(__spreadValues({}, datas), {
      roomId
    });
    return await mission_model_default.create(newMission);
  }
  // Trouve une mission en particulier
  async find(_id) {
    const researchedMission = await mission_model_default.findById(_id);
    return researchedMission;
  }
  // Trouve toutes les missions
  async findAll() {
    try {
      const missionList = await mission_model_default.find();
      return missionList;
    } catch (error) {
      console.error("Error finding missions:", error);
      throw error;
    }
  }
  async findVisibilityStatus(missionId) {
    try {
      const mission = await mission_model_default.findById(missionId);
      if (!mission) {
        throw new Error("Mission introuvable");
      } else {
        return mission.visible;
      }
    } catch (error) {
      console.error("Error finding missions:", error);
      throw error;
    }
  }
  async findTitreByid(missionId) {
    try {
      const mission = await mission_model_default.findById(missionId);
      if (!mission) {
        throw new Error("Mission introuvable");
      }
      const titre = mission.titre;
      return titre;
    } catch (error) {
      console.error("Error finding missions:", error);
      throw error;
    }
  }
};

// src/resources/mission/mission.controller.ts
var MissionController = (0, import_express7.Router)();
var service2 = new MissionService();
MissionController.route("/").get(async (req, res) => {
  if ((await service2.findAll()).length === 0) {
    const missionData = {
      _id: new import_mongoose13.Types.ObjectId(),
      titre: "Mission Test avec misionsArray",
      nb_activites: 4,
      etat: "0",
      visible: false,
      active: false,
      guidee: false,
      visuel: "/blabla/uimg.jpg"
    };
    const roomId = new import_mongoose13.Types.ObjectId("665b33caeff613234dc9535e");
    const createdMission = await MissionService.createMission(new import_mongoose13.Types.ObjectId(roomId), missionData);
    const room = await RoomService.findById(roomId);
    room == null ? void 0 : room.mission.push(missionData._id);
    await RoomService.update(room, roomId);
    console.log("Created Mission:", createdMission);
  }
  try {
    const missionList = await service2.findAll();
    console.log("missionList;", missionList);
    if (missionList.length === 0) {
      return res.status(404).json({ message: "Aucune mission trouv\xE9e" });
    }
    return res.status(200).json(missionList);
  } catch (error) {
    console.error("Error in GET /missions:", error);
    return res.status(500).json({ message: "Erreur du serveur" });
  }
}).post(async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Votre requ\xEAte est vide." });
    } else {
      const mission = await MissionService.createMission(req.body.roomId, req.body);
      const room = await RoomService.findById(req.body.roomId);
      const roomId = new import_mongoose13.Types.ObjectId(req.body.roomId);
      room.mission.push(mission._id);
      await RoomService.update(room, roomId);
      return res.status(201).json(mission);
    }
  } catch (error) {
    console.error("Error in POST /missions:", error);
    return res.status(500).json({ message: "Erreur du serveur" });
  }
});
MissionController.route("/:id([a-z0-9]{24})/").get(async (req, res, next) => {
  try {
    const id = new import_mongoose13.Types.ObjectId(req.params.id);
    const mission = await service2.find(id);
    return res.status(200).json(mission);
  } catch (err) {
    console.error("Error in POST /missions/id:");
    next(err);
  }
});
MissionController.route("/:id([a-z0-9]{24})/isVisible/").get(async (req, res) => {
  try {
    const id = new import_mongoose13.Types.ObjectId(req.params.id);
    const isVisibleStatus = await isVisible(id);
    return res.status(200).json(isVisibleStatus);
  } catch (error) {
    console.error("Error in GET /missions/{id}/isVisible:", error);
    return res.status(500).json({ message: "Erreur du serveur" });
  }
});
MissionController.route("/:id([a-z0-9]{24})/change-to-visible/").post(async (req, res) => {
  const id = req.params.id;
  const mission = await service2.find(new import_mongoose13.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const statusVisible = await service2.findVisibilityStatus(new import_mongoose13.Types.ObjectId(id));
    const titre = await service2.findTitreByid(new import_mongoose13.Types.ObjectId(id));
    if (statusVisible) {
      res.status(200).json("Mission :  " + titre + " est d\xE9j\xE0 active");
    } else {
      if (mission) {
        mission.visible = true;
        await mission.save();
        res.status(201).json("Mission :  " + titre + " est d\xE9sormais active");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
MissionController.route("/:id([a-z0-9]{24})/isActive/").get(async (req, res) => {
  try {
    const id = new import_mongoose13.Types.ObjectId(req.params.id);
    const isActiveStatus = await isActive(id);
    return res.status(200).json(isActiveStatus);
  } catch (error) {
    console.error("Error in GET /missions/{id}/isActive:", error);
    return res.status(500).json({ message: "Erreur du serveur" });
  }
});
MissionController.route("/:id([a-z0-9]{24})/isGuidee/").get(async (req, res) => {
  try {
    const id = new import_mongoose13.Types.ObjectId(req.params.id);
    const isGuideeStatus = await isGuidee(id);
    return res.status(200).json(isGuideeStatus);
  } catch (error) {
    console.error("Error in GET /missions/{id}/isGuidee:", error);
    return res.status(500).json({ message: "Erreur du serveur" });
  }
});
function isVisible(mission) {
  const researchedMission = service2.find(mission);
  if (researchedMission && researchedMission.visible === true) {
    return true;
  } else {
    return false;
  }
}
function isActive(mission) {
  const researchedMission = service2.find(mission);
  if (researchedMission && researchedMission.active === true) {
    return true;
  } else {
    return false;
  }
}
function isGuidee(mission) {
  const researchedMission = service2.find(mission);
  if (researchedMission && researchedMission.guidee === true) {
    return true;
  } else {
    return false;
  }
}
var mission_controller_default = MissionController;

// src/resources/room/room.controller.ts
var import_express8 = require("express");
var import_mongoose14 = require("mongoose");
var RoomController = (0, import_express8.Router)();
var service3 = new RoomService();
RoomController.route("/").get(async (req, res) => {
  try {
    const roomList = await RoomService.findAll();
    if (roomList.length === 0) {
      return res.status(404).json({ message: "Aucune salle trouv\xE9e" });
    }
    return res.status(200).json(roomList);
  } catch (error) {
    console.error("Error in GET /room:", error);
    return res.status(500).json({ message: "Erreur du serveur" });
  }
});
RoomController.route("/:id([a-z0-9]{24})/").get(async (req, res, next) => {
  try {
    const id = new import_mongoose14.Types.ObjectId(req.params.id);
    const room = await RoomService.findById(id);
    return res.status(200).json(room);
  } catch (err) {
    next(err);
  }
});
RoomController.route("/:id([a-z0-9]{24})/moderator").get(async (req, res, next) => {
  try {
    const id = new import_mongoose14.Types.ObjectId(req.params.id);
    const room = await RoomService.findById(id);
    const moderator = room == null ? void 0 : room.moderatorId;
    return res.status(200).json(moderator);
  } catch (err) {
    next(err);
  }
});
RoomController.route("/:roomCode([A-Z0-9]{6})/moderator").get(async (req, res, next) => {
  try {
    const roomCode = req.params.roomCode;
    const room = await RoomService.findByCode(roomCode);
    const moderator = room == null ? void 0 : room.moderatorId;
    return res.status(200).json(moderator);
  } catch (err) {
    next(err);
  }
});
RoomController.route("/:id([a-z0-9]{24})/participants").get(async (req, res, next) => {
  try {
    const id = new import_mongoose14.Types.ObjectId(req.params.id);
    const room = await RoomService.findById(id);
    const participantsList = room == null ? void 0 : room.participants;
    return res.status(200).json(participantsList);
  } catch (err) {
    next(err);
  }
});
RoomController.route("/:roomCode([A-Z0-9]{6})/participants").get(async (req, res, next) => {
  try {
    const roomCode = req.params.roomCode;
    const room = await RoomService.findByCode(roomCode);
    const participantsList = room == null ? void 0 : room.participants;
    return res.status(200).json(participantsList);
  } catch (err) {
    next(err);
  }
});
RoomController.route("/:id([a-z0-9]{24})/missions").get(async (req, res, next) => {
  try {
    const id = new import_mongoose14.Types.ObjectId(req.params.id);
    const room = await RoomService.findById(id);
    const missionsList = room == null ? void 0 : room.mission;
    return res.status(200).json(missionsList);
  } catch (err) {
    next(err);
  }
});
RoomController.route("/:roomCode([A-Z0-9]{6})/missions").get(async (req, res, next) => {
  try {
    const roomCode = req.params.roomCode;
    const room = await RoomService.findByCode(roomCode);
    const missionsList = room == null ? void 0 : room.mission;
    return res.status(200).json(missionsList);
  } catch (err) {
    next(err);
  }
});
var room_controller_default = RoomController;

// src/middlewares/exceptions.handler.ts
var ExceptionsHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err.status && err.error) {
    return res.status(err.status).json({ error: err.error });
  }
  return res.status(500).json({ error: err });
};

// src/middlewares/unknownRoutes.handler.ts
var UnknownRoutesHandler = () => {
  throw new NotFoundException("La ressource demand\xE9e n'existe pas");
};

// src/index.ts
var import_body_parser = __toESM(require("body-parser"));
var import_http = __toESM(require("http"));
var import_https = __toESM(require("https"));
var import_fs6 = require("fs");
var import_swagger_jsdoc = __toESM(require("swagger-jsdoc"));
var import_swagger_ui_express = __toESM(require("swagger-ui-express"));
var app = (0, import_express9.default)();
var httpServer = import_http.default.createServer(app);
var swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "MOBITEACH - Knowledge Hubs - MISSIONS",
      version: "0.1.0",
      description: "Un projet DIGITAL LEARNING innovant pour assurer un continuum d'apprentissage avec les sessions formelles de formation !"
    },
    servers: [
      {
        url: config2.BASE_URL,
        description: "Server"
      }
    ]
  },
  tryItOutEnabled: false,
  apis: ["**/*.controller.ts"]
};
var specs = (0, import_swagger_jsdoc.default)(swaggerOptions);
app.use(import_body_parser.default.json());
app.use(import_body_parser.default.urlencoded({ extended: true }));
app.use((0, import_cors.default)({
  // allow all subdomains of mobiteach.net
  origin: new RegExp("^(https?://)?([a-z0-9]+[.])*mobiteach[.]net$")
}));
app.use("/users", users_controller_default);
app.use("/medias", media_controller_default);
app.use("/thumb", thumb_controller_default);
app.use("/datas", userData_controller_default);
app.use("/instructions", instruction_controller_default);
app.use("/mission", mission_controller_default);
app.use("/room", room_controller_default);
app.use("/moodle", moodle_controller_default);
app.use("/docs", import_swagger_ui_express.default.serve);
app.get("/docs", import_swagger_ui_express.default.setup(specs, { customCss: ".swagger-ui .topbar { display: none } .try-out { display: none }", customSiteTitle: "MISSIONS HUB DOCS", customfavIcon: "https://missions.mobiteach.fr/mobi.ico" }));
app.use("/", import_express9.default.static(__dirname + "/../public", { dotfiles: "allow" }));
app.all("*", UnknownRoutesHandler);
app.use(ExceptionsHandler);
app.use((req, res, next) => {
  req.acceptsCharsets("utf-8");
  res.charset = "utf-8";
  next();
});
var start = async () => {
  try {
    httpServer.listen(config2.API_PORT);
    console.log("HTTP server is listening on port : " + config2.API_PORT);
    import_mongoose15.default.connect(config2.DB_URI);
    httpServer.on("error", (err) => {
      throw err;
    });
    process.on("SIGINT", () => {
      httpServer.close();
    });
    httpServer.on("close", async () => {
      await import_mongoose15.default.disconnect();
      console.log("Server closed");
    });
    if (config2.SSL_KEY && config2.SSL_CERT) {
      const options = {
        key: (0, import_fs6.readFileSync)(config2.SSL_KEY),
        cert: (0, import_fs6.readFileSync)(config2.SSL_CERT)
      };
      const httpsServer = import_https.default.createServer(options, app);
      httpsServer.listen(443);
      console.log("HTTPS server is listening on port : 443");
      httpsServer.on("error", (err) => {
        throw err;
      });
      process.on("SIGINT", () => {
        httpsServer.close();
      });
      httpsServer.on("close", async () => {
        httpServer.close();
      });
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
start();
