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
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

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
var import_express11 = __toESM(require("express"));
var import_mongoose23 = __toESM(require("mongoose"));

// src/resources/media/media.controller.ts
var import_multer = __toESM(require("multer"));

// types/media.enum.ts
var EMedia;
(function(EMedia2) {
  EMedia2["IMAGE"] = "image";
  EMedia2["VIDEO"] = "video";
  EMedia2["AUDIO"] = "audio";
  EMedia2["TEXT"] = "text";
  EMedia2["SLIDE"] = "slide";
})(EMedia || (EMedia = {}));
var media_enum_default = EMedia;

// src/utils/exceptions.ts
var Exception = class extends Error {
  constructor(error, status) {
    super(error);
    __publicField(this, "error");
    __publicField(this, "status");
    __publicField(this, "_error");
    __publicField(this, "_status");
    this.error = error;
    this.status = status;
    this.error = error;
    this.status = status;
  }
};
__name(Exception, "Exception");
var NotFoundException = class extends Exception {
  constructor(error) {
    super(error, 404);
  }
};
__name(NotFoundException, "NotFoundException");
var BadRequestException = class extends Exception {
  constructor(error) {
    super(error, 400);
  }
};
__name(BadRequestException, "BadRequestException");

// src/utils/file.utils.ts
var import_path2 = require("path");
var import_axios = __toESM(require("axios"));
var import_fs = require("fs");
var import_os = require("os");
var import_promises = require("fs/promises");
var getFileTypeByExtension = /* @__PURE__ */ __name((extension) => {
  switch (extension) {
    case ".jpg":
    case ".JPG":
    case ".png":
    case ".PNG":
    case ".jpeg":
    case ".JPEG":
    case ".svg":
    case ".SVG":
      return media_enum_default.IMAGE;
    case ".mp4":
    case ".MP4":
      return media_enum_default.VIDEO;
    case ".mp3":
    case ".MP3":
    case ".flac":
    case ".FLAC":
      return media_enum_default.AUDIO;
    case ".pdf":
    case ".PDF":
      return media_enum_default.SLIDE;
    case ".doc":
    case ".DOC":
    case ".docx":
    case ".DOCX":
    case ".txt":
    case ".TXT":
      return media_enum_default.TEXT;
    default:
      throw new BadRequestException("Le type de fichier n'est pas reconnu");
  }
}, "getFileTypeByExtension");
var getFileNameFormatted = /* @__PURE__ */ __name((filename, extension) => {
  return filename.substring(0, filename.length - extension.length) + "_" + Date.now() + extension;
}, "getFileNameFormatted");
var downloadFile = /* @__PURE__ */ __name(async (url) => {
  const filename = url.split("/").pop();
  const tmpUri = (0, import_path2.join)((0, import_os.tmpdir)(), filename);
  const writer = (0, import_fs.createWriteStream)(tmpUri);
  try {
    const res = await import_axios.default.get(url, {
      responseType: "stream"
    });
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
    return [
      buffer,
      filename
    ];
  } catch (err) {
    console.error(err);
    throw err;
  }
}, "downloadFile");

// src/resources/media/media.controller.ts
var import_express = require("express");
var import_mongoose4 = require("mongoose");

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
  "instructions": [
    {
      type: import_mongoose.Schema.Types.ObjectId,
      ref: "Instruction"
    }
  ],
  "connexion": {
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Room",
    default: null
  },
  "roomId": [
    {
      type: import_mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    }
  ],
  "instance": {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
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
  // Nouvelle méthode pour trouver les prénoms et noms des utilisateurs connectés à une salle, en excluant le modérateur
  async findUserNamesConnectedToRoomExcludingModerator(roomId, moderatorId) {
    try {
      const connectedUsers = await user_model_default.find({
        connexion: roomId,
        _id: {
          $ne: moderatorId
        }
      }).select("firstname lastname");
      return connectedUsers.map((user) => user.firstname + " " + user.lastname);
    } catch (err) {
      throw new Error("Error retrieving connected users excluding moderator: " + err.message);
    }
  }
  // Liste des utilisteurs connecté moderotor exclu 
  async findUsersConnectedToRoomExcludingModerator(roomId, moderatorId) {
    try {
      const connectedUsers = await user_model_default.find({
        connexion: roomId,
        _id: {
          $ne: moderatorId
        }
      });
      return connectedUsers;
    } catch (err) {
      throw new Error("Error retrieving connected users excluding moderator: " + err.message);
    }
  }
  // NBRE DE USERS CONNECTES A UN SALLE
  async countConnectedUsersExcludingModerator(roomId, moderatorId) {
    try {
      const connectedUserNames = await this.findUserNamesConnectedToRoomExcludingModerator(roomId, moderatorId);
      return connectedUserNames.length;
    } catch (err) {
      throw new Error("Error counting connected users excluding moderator: " + err.message);
    }
  }
  // trouve un utilisateur via l'email
  async findByEmail(email, instance, room) {
    if (!instance && !room) {
      const researchedUser = await user_model_default.findOne({
        email
      });
      return researchedUser;
    } else if (!instance) {
      const researchedUser = await user_model_default.findOne({
        email,
        room
      });
      return researchedUser;
    } else {
      const researchedUser = await user_model_default.findOne({
        email,
        room,
        instance
      });
      return researchedUser;
    }
  }
  async findByInstance(instance) {
    const userList = await user_model_default.find({
      instance
    });
    return userList;
  }
  // Crée un utilisateur
  async create(data) {
    const newUser = __spreadValues({}, data);
    return await user_model_default.create(newUser);
  }
  // Met à jour un utilisateur en particulier
  async update(userData, _id) {
    const modifiedUser = await user_model_default.findByIdAndUpdate(_id, userData, {
      new: true
    });
    return modifiedUser;
  }
  // Suppression d'un utilisateur
  async delete(_id) {
    await user_model_default.findByIdAndDelete(_id);
  }
  async findUserImage(_id) {
    const user = await user_model_default.findById(_id, {
      picture: 1
    }).populate("picture").exec();
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    if (!user.picture || user.picture === null) {
      return (0, import_path3.join)(config2.ATTACHEMENT_SRC, "default.jpg");
    }
    return user.picture.path();
  }
};
__name(UsersService, "UsersService");

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
}, {
  timestamps: true
});
MediaSchema.method("path", function() {
  return (0, import_path4.join)(config2.ATTACHEMENT_SRC, this.userId.toString(), this.type + "s", this.name);
});
var MMedia = import_mongoose2.default.model("Media", MediaSchema);
var media_model_default = MMedia;

// src/resources/media/media.service.ts
var MediaService = class {
  // Trouve tout les média d'un utilisateur
  async findAll(userId) {
    const mediaList = (await media_model_default.find()).filter((media) => media.userId.equals(userId));
    return mediaList;
  }
  // trouve un media en particulier 
  async find(mediaId) {
    const researchedMedia = await media_model_default.findById(mediaId);
    return researchedMedia;
  }
  // Trouve la liste des médias pour un utilisateur donné
  async findByUserId(userId) {
    const mediaList = await media_model_default.find({
      userId
    }).exec();
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
__name(MediaService, "MediaService");

// src/resources/media/media.controller.ts
var import_path5 = require("path");
var import_fs2 = __toESM(require("fs"));

// src/db/userData.model.ts
var import_mongoose3 = __toESM(require("mongoose"));
var UserDataSchema = new import_mongoose3.default.Schema({
  "activityId": {
    type: import_mongoose3.Schema.Types.ObjectId,
    ref: "Activity",
    required: true
  },
  "mediaId": {
    type: import_mongoose3.Schema.Types.ObjectId,
    ref: "Media",
    required: false
  },
  "thumbId": {
    type: import_mongoose3.Schema.Types.ObjectId,
    ref: "Thumb",
    required: false
  },
  "description": {
    type: String,
    required: true
  },
  "room": {
    type: String,
    required: false
  },
  "userId": {
    type: import_mongoose3.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  "instance": {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
var MUserData = import_mongoose3.default.model("UserData", UserDataSchema);
var userData_model_default = MUserData;

// src/resources/userData/userData.service.ts
var UserDataService = class {
  /**
  * Crée une réponse à partir des informations données par l'utilisateur
  * @param userId 
  * @param datas 
  * @param activity
  * @returns 
  */
  async createUserData(user, activityId, mediaId, thumbId, datas) {
    const newUserData = __spreadProps(__spreadValues({}, datas), {
      activityId,
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
    const userDataList = await userData_model_default.find({
      room,
      instance
    }).populate("mediaId", "type _id").exec();
    return userDataList;
  }
  // Trouve la liste des réponses pour un utilisateur donné
  async findByUserId(user, room) {
    if (!room) {
      return await userData_model_default.find({
        userId: user._id
      }).populate("mediaId", "type").exec();
    }
    const userDataList = await userData_model_default.find({
      userId: user._id,
      instance: user.instance,
      room
    }).populate("mediaId", "type").exec();
    return userDataList;
  }
  // Trouve la liste des réponses pour un utilisateur et une activité donnés
  async findByUserIdAndActivityId(user, room, activity2) {
    const userDataList = await userData_model_default.find({
      userId: user._id,
      instance: user.instance,
      room
    }).populate("mediaId", "type").exec();
    const userActivityDataList = userDataList.filter((userData) => userData.activityId.equals(activity2));
    return userActivityDataList;
  }
  // Trouve une réponse en particulier par son ID
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
__name(UserDataService, "UserDataService");

// src/resources/media/media.controller.ts
var MediaController = (0, import_express.Router)();
var mediaService = new MediaService();
var userService = new UsersService();
var userDataService = new UserDataService();
var fileStorage = import_multer.default.diskStorage({
  // définit le dossier de destination à partir de l'ID de l'utilisateur
  destination: function(req, file, cb) {
    const extension = (0, import_path5.extname)(file.originalname);
    try {
      const folder = getFileTypeByExtension(extension);
      req.body.type = folder;
      const dest = (0, import_path5.join)(config2.ATTACHEMENT_SRC, req.body.userId, folder + "s");
      if (!import_fs2.default.existsSync(dest)) {
        import_fs2.default.mkdirSync(dest, {
          recursive: true
        });
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
    const userId = new import_mongoose4.Types.ObjectId(req.body.userId);
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
    const userId = new import_mongoose4.Types.ObjectId(req.params.userId);
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
    const mediaId = new import_mongoose4.Types.ObjectId(req.params.mediaId);
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
    const mediaId = new import_mongoose4.Types.ObjectId(req.params.mediaId);
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
MediaController.route("/byResponseId/:responseId([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const userDataId = new import_mongoose4.Types.ObjectId(req.params.responseId);
    const userData = await userDataService.find(userDataId);
    if (!userData) {
      throw new NotFoundException("R\xE9ponse introuvable");
    }
    const mediaId = userData == null ? void 0 : userData.mediaId;
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
    const mediaId = new import_mongoose4.Types.ObjectId(req.params.mediaId);
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
var import_mongoose6 = require("mongoose");

// src/db/thumb.model.ts
var import_mongoose5 = __toESM(require("mongoose"));
var import_path6 = require("path");
var ThumbSchema = new import_mongoose5.default.Schema({
  "type": {
    type: String,
    enum: Object.values(media_enum_default),
    required: true
  },
  "userId": {
    type: import_mongoose5.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  "name": {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});
ThumbSchema.method("path", function() {
  return (0, import_path6.join)(config2.ATTACHEMENT_SRC, this.userId.toString(), "thumbs");
});
var MThumb = import_mongoose5.default.model("Thumb", ThumbSchema);
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
      const updatedThumb = await thumb_model_default.findByIdAndUpdate(thumbId, thumbData, {
        new: true
      });
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
__name(ThumbService, "ThumbService");

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
        import_fs3.default.mkdirSync(dest, {
          recursive: true
        });
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
    const userId = new import_mongoose6.Types.ObjectId(req.body.userId);
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
    const userId = new import_mongoose6.Types.ObjectId(req.params.userId);
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
    const thumbId = new import_mongoose6.Types.ObjectId(req.params.thumbId);
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
var import_mongoose11 = require("mongoose");
var import_path8 = require("path");
var import_fs4 = __toESM(require("fs"));
var import_promises2 = require("fs/promises");

// src/db/room.model.ts
var import_mongoose7 = __toESM(require("mongoose"));
var RoomSchema = new import_mongoose7.default.Schema({
  "roomCode": {
    type: String,
    required: true
  },
  "moderatorId": {
    type: import_mongoose7.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  "participants": [
    {
      type: import_mongoose7.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  "mission": [
    {
      type: import_mongoose7.Schema.Types.ObjectId,
      ref: "Mission"
    }
  ]
}, {
  timestamps: true
});
var Room = import_mongoose7.default.model("Room", RoomSchema);
var room_model_default = Room;

// src/resources/room/room.service.ts
var import_mongoose10 = require("mongoose");

// src/db/instance.model.ts
var import_mongoose8 = __toESM(require("mongoose"));
var Instancechema = new import_mongoose8.default.Schema({
  "name": {
    type: String,
    required: true
  },
  "rooms": [
    {
      type: import_mongoose8.Types.ObjectId
    }
  ]
}, {
  timestamps: true
});
var MInstance = import_mongoose8.default.model("Instance", Instancechema);
var instance_model_default = MInstance;

// src/resources/instance/instance.service.ts
var import_mongoose9 = require("mongoose");
var InstanceService = class {
  // Creation d une nouvelle instance par NOM
  async createInstanceByName(instanceName) {
    try {
      const instanceData = {
        _id: new import_mongoose9.Types.ObjectId(),
        name: instanceName,
        rooms: []
      };
      const createdInstance = await this.create(instanceData);
      console.log("Nouvelle Instance Cr\xE9\xE9e :", createdInstance);
    } catch (error) {
      console.error("Erreur \xE0 la cr\xE9ation de l instance", error);
    }
  }
  // Création d une nouvelle instance
  async create(data) {
    const newInstance = __spreadValues({}, data);
    console.log("instance .service : nouvelle instance \xE0 cr\xE9er", newInstance);
    return await instance_model_default.create(newInstance);
  }
  // Met à jour une instance en particulier
  async update(instanceData, _id) {
    const modifiedInstance = await instance_model_default.findByIdAndUpdate(_id, instanceData, {
      new: true
    });
    console.log("insttanec service update");
    console.log(await instance_model_default.findOne(_id));
    return modifiedInstance;
  }
  async findByName(instanceName) {
    const researchedInstance = await instance_model_default.findOne({
      name: instanceName
    }).exec();
    return researchedInstance;
  }
  async findById(_id) {
    const researchedInstance = await instance_model_default.findOne({
      _id
    });
    return researchedInstance;
  }
  // Trouve tous les salles
  async findAll() {
    const allInstance = await instance_model_default.find();
    return allInstance;
  }
  // AJOUT D'UNE SALLE A UNE INSTANCE
  async addRoomToInstance(instanceName, roomId) {
    try {
      const instance = await this.findByName(instanceName);
      console.log("Instance found by name:", instance);
      if (instance) {
        if (!instance.rooms.includes(roomId)) {
          instance.rooms.push(roomId);
          console.log("Room ID ", roomId, " ajout\xE9 \xE0 l array rooms de l instance", instanceName);
          const updatedInstance = await this.update({
            rooms: instance.rooms
          }, instance._id);
          console.log("Updated instance:", updatedInstance);
          return updatedInstance;
        } else {
          console.log("Room ID existe d\xE9j\xE0 dans l array rooms des instnecs:", roomId);
        }
      } else {
        console.log("Pas d instance trouvee avec ce NOMEM.", instanceName);
      }
    } catch (error) {
      console.error("Error updating instance:", error);
    }
  }
};
__name(InstanceService, "InstanceService");

// src/resources/room/room.service.ts
var instanceService = new InstanceService();
var RoomService = class {
  // Creation d une nouvelle salle
  async create(data) {
    const newRoom = __spreadValues({}, data);
    console.log("room.service : nouvelle salle \xE0 cr\xE9er", newRoom);
    return await room_model_default.create(newRoom);
  }
  // Creation d une nouvelle salle avec un roomcode donné  
  async createNewRoom(roomCode) {
    try {
      const roomData = {
        _id: new import_mongoose10.Types.ObjectId(),
        moderatorId: new import_mongoose10.Types.ObjectId(),
        roomCode,
        participants: [],
        mission: []
      };
      const createdRoom = await this.create(roomData);
      console.log("Created Room:", createdRoom);
      return createdRoom;
    } catch (error) {
      console.error("Error creating room:", error);
    }
  }
  // Met à jour une salle en particulier
  async update(roomData, _id) {
    const modifiedRoom = await room_model_default.findByIdAndUpdate(_id, roomData, {
      new: true
    });
    return modifiedRoom;
  }
  /// ATTENTION findByCode  NE FCTINNE QUE POUR UNE INSTANCE UNIQUE
  async findByCode(roomCode) {
    console.log("roomCode in service", roomCode);
    const researchedRoom = await room_model_default.findOne({
      roomCode
    });
    return researchedRoom;
  }
  // Trouve la ROOM selon le code de la salle et le nom de l'instance
  async findByCodeAndInstance(roomCode, instanceName) {
    console.log("roomCode in service", roomCode);
    const arrayRoomSameCode = await room_model_default.find({
      roomCode
    });
    if (!arrayRoomSameCode.length) {
      return null;
    }
    const roomIds = arrayRoomSameCode.map((room) => room._id.toString());
    const instance = await instanceService.findByName(instanceName);
    if (!instance) {
      return null;
    }
    const instanceRoomIds = instance.rooms.map((room) => room.toString());
    const researchedRoom = arrayRoomSameCode.find((room) => instanceRoomIds.includes(room._id.toString()));
    return researchedRoom || null;
  }
  // Trouve le ROOMCODE selon l ID de la room
  async findCodeById(_id) {
    console.log("roomCode by Id", _id);
    const researchedRoom = await room_model_default.findOne({
      _id
    });
    const reserchedCode = researchedRoom == null ? void 0 : researchedRoom.roomCode;
    return reserchedCode;
  }
  // Une salle par son ID
  async findById(_id) {
    const researchedRoom = await room_model_default.findOne({
      _id
    });
    return researchedRoom;
  }
  // Trouve tous les salles
  async findAll() {
    const allRoom = await room_model_default.find();
    return allRoom;
  }
};
__name(RoomService, "RoomService");

// src/middlewares/token.handler.ts
var import_crypto = __toESM(require("crypto"));
var TokenHandler = /* @__PURE__ */ __name(() => {
  const iv = import_crypto.default.randomBytes(16);
  const timestamp = Date.now() / 1e3 | 0;
  const cipher = import_crypto.default.createCipheriv("aes-256-ctr", secretKeyMission, iv);
  const encrypted = Buffer.concat([
    cipher.update(timestamp.toString()),
    cipher.final()
  ]);
  const data = {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex")
  };
  const convertToBase64 = Buffer.from(JSON.stringify(data));
  return convertToBase64.toString("base64");
}, "TokenHandler");

// src/resources/users/users.controller.ts
var import_axios2 = __toESM(require("axios"));
var import_path9 = require("path");
var UsersController = (0, import_express3.Router)();
var service = new UsersService();
var mediaService2 = new MediaService();
var roomService2 = new RoomService();
var instanceService2 = new InstanceService();
UsersController.route("/").get(async (req, res) => {
  const userList = await service.findAll();
  return res.status(200).json(userList);
}).post(async (req, res) => {
  const createdUser = await service.create(req.body);
  return res.status(201).json(createdUser);
});
UsersController.route("/:email([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-z]{2,3})/").get(async (req, res, next) => {
  try {
    const email = req.params.email;
    let user;
    if (req.query.instance) {
      user = await service.findByEmail(email, req.query.instance.toString());
    } else {
      user = await service.findByEmail(email);
    }
    const roomCode = req.query.roomCode;
    const instanceName = req.query.instance;
    const instance = await instanceService2.findByName(instanceName);
    if (!instance) {
      await instanceService2.createInstanceByName(instanceName);
      const newInstance = await instanceService2.findByName(instanceName);
      if (newInstance) {
        const room2 = await roomService2.createNewRoom(roomCode);
        const roomId = room2._id;
        await instanceService2.addRoomToInstance(instanceName.toString(), new import_mongoose11.Types.ObjectId(roomId));
      } else {
        throw new Error("\xC9chec de la cr\xE9ation ou de la recherche de l'instance");
      }
    } else {
      const room2 = await roomService2.findByCodeAndInstance(roomCode, instanceName);
      if (!room2 && roomCode) {
        const room3 = await roomService2.createNewRoom(roomCode);
        const roomId = room3._id;
        await instanceService2.addRoomToInstance(instanceName.toString(), new import_mongoose11.Types.ObjectId(roomId));
      }
    }
    const room = await roomService2.findByCodeAndInstance(roomCode, instanceName);
    if (req.query.roomCode) {
      await import_axios2.default.post("https://" + req.query.instance + "/html/mobiApp/connect", {
        "roomCode": req.query.roomCode,
        "userEmail": email
      }, {
        headers: {
          "mission-token": TokenHandler()
        }
      }).then(async (resAxios) => {
        if (!user) {
          user = await service.create({
            _id: new import_mongoose11.Types.ObjectId(resAxios.data.user.id),
            email,
            firstname: resAxios.data.user.firstname,
            lastname: resAxios.data.user.lastname,
            connexion: new import_mongoose11.Types.ObjectId(room._id),
            picture: null,
            instructions: [],
            instance: req.query.instance !== void 0 ? req.query.instance.toString() : config2.MOBITEACH_URL,
            roomId: [
              room._id
            ]
          });
          const isModerator = resAxios.data.user.isModerator;
          if (isModerator) {
            room.moderatorId = user._id;
            await roomService2.update({
              moderatorId: user._id
            }, room._id);
          } else {
            if (!room.participants.includes(user._id)) {
              room.participants.push(user._id);
              await roomService2.update({
                participants: room.participants
              }, room._id);
            }
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
              await (0, import_promises2.mkdir)(dest, {
                recursive: true
              });
            }
            await (0, import_promises2.writeFile)(media.path(), file);
            user = await service.update({
              picture: media._id
            }, user._id);
          }
        } else {
          if (room && room._id) {
            await service.update({
              connexion: room._id
            }, user._id);
            if (!user.roomId.includes(room._id)) {
              user.roomId.push(room._id);
              await service.update({
                roomId: user.roomId
              }, new import_mongoose11.Types.ObjectId(user._id));
            }
          }
        }
        const updatedUser = await service.find(user._id);
        return res.status(200).json(updatedUser);
      }).catch((err) => {
        console.log("ERREUR", err);
        next(err);
      });
    } else {
      if (!user) {
        throw new NotFoundException("Utilisateur introuvable");
      }
      const updatedUser = await service.find(user._id);
      return res.status(200).json(updatedUser);
    }
  } catch (err) {
    next(err);
  }
});
UsersController.route("/:id([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const id = new import_mongoose11.Types.ObjectId(req.params.id);
    const user = await service.find(id);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    } else if (req.query.roomCode) {
      await import_axios2.default.post("https://" + user.instance + "/html/mobiApp/disconnect", {
        "roomCode": req.query.roomCode,
        "userId": id
      }, {
        headers: {
          "mission-token": TokenHandler()
        }
      }).catch((err) => {
        console.log(err);
      });
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}).put(async (req, res) => {
  const id = new import_mongoose11.Types.ObjectId(req.params.id);
  const userData = req.body;
  const updatedUser = await service.update(userData, id);
  return res.status(200).json(updatedUser);
}).delete(async (req, res, next) => {
  try {
    const id = new import_mongoose11.Types.ObjectId(req.params.id);
    const user = await service.find(id);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    if (user.picture && user.picture !== null) {
      await mediaService2.delete(user.picture);
    }
    if (import_fs4.default.existsSync((0, import_path9.join)(config2.ATTACHEMENT_SRC, id.toString()))) {
      import_fs4.default.rm((0, import_path9.join)(config2.ATTACHEMENT_SRC, id.toString()), {
        recursive: true
      }, (err) => {
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
    const id = new import_mongoose11.Types.ObjectId(req.params.id);
    const path = await service.findUserImage(id);
    return res.sendFile(path);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
UsersController.route("/:idUser([a-z0-9]{24})/ismoderator/:idRoom([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const userId = new import_mongoose11.Types.ObjectId(req.params.idUser);
    const roomId = new import_mongoose11.Types.ObjectId(req.params.idRoom);
    const user = await service.find(userId);
    const room = await roomService2.findById(roomId);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    if (!room) {
      throw new NotFoundException("Salle introuvable");
    }
    const roomModerator = room.moderatorId;
    if (roomModerator.equals(userId)) {
      return res.status(200).json(true);
    } else {
      return res.status(200).json(false);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});
UsersController.route("/:idUser([a-z0-9]{24})/ismoderatorConnect").get(async (req, res, next) => {
  try {
    const userId = new import_mongoose11.Types.ObjectId(req.params.idUser);
    const user = await service.find(userId);
    console.log("ududeu", user);
    const roomId = new import_mongoose11.Types.ObjectId(user == null ? void 0 : user.connexion);
    const room = await roomService2.findById(roomId);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    if (!room) {
      throw new NotFoundException("Salle introuvable");
    }
    const roomModerator = room.moderatorId;
    console.log("remoodera", roomModerator);
    if (roomModerator.equals(userId)) {
      return res.status(200).json(true);
    } else {
      return res.status(200).json(false);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});
UsersController.route("/:idUser([a-z0-9]{24})/connect/:idRoom([a-z0-9]{24})").put(async (req, res, next) => {
  try {
    const userId = new import_mongoose11.Types.ObjectId(req.params.idUser);
    const roomId = new import_mongoose11.Types.ObjectId(req.params.idRoom);
    const user = await service.find(userId);
    const room = await roomService2.findById(roomId);
    const roomCode = room == null ? void 0 : room.roomCode;
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    if (!room) {
      throw new NotFoundException("Salle introuvable");
    }
    if (room._id.equals(user.connexion)) {
      res.status(200).json("Participant :  " + user.firstname + "  " + user.lastname + " est d\xE9j\xE0 connect\xE9 \xE0 " + roomCode + ".");
    } else {
      if (user) {
        user.connexion = new import_mongoose11.Types.ObjectId(room._id);
        await user.save();
        res.status(201).json("Participant :  " + user.firstname + "  " + user.lastname + " est d\xE9sormais connect\xE9 \xE0 " + roomCode + ".");
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});
UsersController.route("/:idUser([a-z0-9]{24})/disconnect/:idRoom([a-z0-9]{24})").put(async (req, res, next) => {
  try {
    const userId = new import_mongoose11.Types.ObjectId(req.params.idUser);
    const roomId = new import_mongoose11.Types.ObjectId(req.params.idRoom);
    const user = await service.find(userId);
    const room = await roomService2.findById(roomId);
    const roomCode = room == null ? void 0 : room.roomCode;
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    if (!room) {
      throw new NotFoundException("Salle introuvable");
    }
    if (!room._id.equals(user.connexion)) {
      res.status(200).json("Participant :  " + user.firstname + "  " + user.lastname + " est d\xE9j\xE0 d\xE9connect\xE9 de " + roomCode + ".");
    } else {
      if (user) {
        user.connexion = null;
        await user.save();
        res.status(200).json("Participant :  " + user.firstname + "  " + user.lastname + " est d\xE9sormais d\xE9connect\xE9 \xE0 " + roomCode + ".");
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});
UsersController.route("/listconnect/:idRoom([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const roomId = new import_mongoose11.Types.ObjectId(req.params.idRoom);
    const room = await roomService2.findById(roomId);
    if (room) {
      const moderatorId = room == null ? void 0 : room.moderatorId;
      const connectedUsers = await service.findUserNamesConnectedToRoomExcludingModerator(roomId, moderatorId);
      res.status(200).json(connectedUsers);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});
UsersController.route("/nbrconnect/:idRoom([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const roomId = new import_mongoose11.Types.ObjectId(req.params.idRoom);
    const room = await roomService2.findById(roomId);
    if (room) {
      const moderatorId = room == null ? void 0 : room.moderatorId;
      const nbrConnectedUsers = await service.countConnectedUsersExcludingModerator(roomId, moderatorId);
      res.status(200).json(nbrConnectedUsers);
    } else {
      res.status(404).json({
        error: "Salle introuvable."
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal server error."
    });
    next(err);
  }
});
var users_controller_default = UsersController;

// src/resources/userData/userData.controller.ts
var import_multer3 = __toESM(require("multer"));
var import_express4 = require("express");
var import_mongoose16 = require("mongoose");

// src/db/mission.model.ts
var import_mongoose12 = __toESM(require("mongoose"));
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
  "activites": [
    {
      type: import_mongoose12.Schema.Types.ObjectId,
      ref: "activity",
      required: true,
      default: []
    }
  ],
  "nb_activites": {
    type: Number,
    unique: false,
    required: true,
    default: 0
  },
  "etat": {
    type: Map,
    of: [
      import_mongoose12.Schema.Types.ObjectId
    ],
    required: true,
    default: {
      "EN_COURS": [],
      "NON_DEMARREE": [],
      "TERMINEE": []
    }
  },
  "visible": {
    type: Boolean,
    required: true,
    default: false
  },
  "active": {
    type: Boolean,
    required: true,
    default: false
  },
  "guidee": {
    type: Boolean,
    required: true,
    default: false
  },
  "visuel": {
    type: import_mongoose12.Schema.Types.ObjectId,
    ref: "Media",
    required: false,
    default: null
  }
}, {
  timestamps: true
});
var Mission = import_mongoose12.default.model("Mission", MissionSchema);
var mission_model_default = Mission;

// src/resources/mission/mission.service.ts
var import_mongoose13 = require("mongoose");

// types/etat.enum.ts
var EEtat;
(function(EEtat2) {
  EEtat2["NON_DEMARREE"] = "NON_DEMARREE";
  EEtat2["EN_COURS"] = "EN_COURS";
  EEtat2["TERMINEE"] = "TERMINEE";
})(EEtat || (EEtat = {}));
var etat_enum_default = EEtat;

// src/resources/mission/mission.service.ts
var mediaService3 = new MediaService();
var roomService3 = new RoomService();
var MissionService = class {
  // Creation d une nouvelle mission
  async createMission(datas) {
    const newMission = __spreadValues({}, datas);
    return await mission_model_default.create(newMission);
  }
  // Creation d une nouvelle mission par le roomCode
  async createMissionByCode(datas, roomId) {
    const newMission = __spreadProps(__spreadValues({}, datas), {
      roomId
    });
    return await mission_model_default.create(newMission);
  }
  // Trouve une mission par son ID
  async find(_id) {
    const researchedMission = await mission_model_default.findById(_id);
    return researchedMission;
  }
  // Trouve toutes les missions
  async findAll() {
    const missionList = await mission_model_default.find();
    return missionList;
  }
  // Trouve par l ID de la mission
  async findById(_id) {
    const researchedMission = await mission_model_default.findOne({
      _id
    });
    return researchedMission;
  }
  // Supprimme une mission par son ID
  async delete(missionId) {
    console.log("missionId", missionId);
    const deletedMission = await mission_model_default.findByIdAndDelete(missionId);
    return deletedMission;
  }
  // Retrouver dans quelle mission est l'activité (par activity ID)
  async findMissionByActivity(activityId) {
    try {
      const mission = await mission_model_default.findOne({
        activites: activityId
      });
      return mission;
    } catch (error) {
      console.error("Erreur mission par activity ID:", error);
      return null;
    }
  }
  // Statut Visible de la mission
  async findVisibilityStatus(missionId) {
    try {
      const mission = await mission_model_default.findById(missionId);
      if (!mission) {
        throw new Error("Mission introuvable");
      } else {
        return mission.visible;
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de la mission:", error);
      throw error;
    }
  }
  // Statut Activité de la mission
  async findActiveStatus(missionId) {
    try {
      const mission = await mission_model_default.findById(missionId);
      if (!mission) {
        throw new Error("Mission introuvable");
      } else {
        return mission.active;
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de la mission:", error);
      throw error;
    }
  }
  // Statut Guidée de la mission
  async findGuideeStatus(missionId) {
    try {
      const mission = await mission_model_default.findById(missionId);
      if (!mission) {
        throw new Error("Mission introuvable");
      } else {
        return mission.guidee;
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de la mission:", error);
      throw error;
    }
  }
  // Titre de la mission par Id de la mission
  async findTitreByid(missionId) {
    try {
      const mission = await mission_model_default.findById(missionId);
      if (!mission) {
        throw new Error("Mission introuvable");
      }
      const titre = mission.titre;
      return titre;
    } catch (error) {
      console.error("Erreur lors de la recherche de la mission:", error);
      throw error;
    }
  }
  // ETAT D'AVANCEMENT D'UNE MISSION
  // Statut Etat de la Mission
  async findEtat(missionId) {
    try {
      const mission = await mission_model_default.findById(missionId);
      if (!mission) {
        throw new Error("Mission introuvable");
      } else {
        return mission.etat;
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de la mission:", error);
      throw error;
    }
  }
  // ETAT d un USER dans une mission
  async etatByUser(missionId, userId) {
    let foundKey = null;
    const mission = await mission_model_default.findById(missionId);
    if (mission) {
      for (const [key, value] of mission.etat.entries()) {
        if (value.includes(userId)) {
          foundKey = key;
        }
      }
      if (foundKey !== null) {
        return foundKey;
      } else
        return "";
    }
  }
  // AJOUT DE l'USERID A L ARRAY NON_DEMARREE DANS LES ETATS DE L ACTIVITE
  async inscriptionMission(missionId, userId) {
    const mission = await mission_model_default.findById(missionId);
    if (mission) {
      mission.etat.set("NON_DEMARREE", mission.etat.get("NON_DEMARREE").concat(userId));
      mission.save();
      return mission;
    } else
      return null;
  }
  // PASSAGE DE l'USERID DE NON_DEMARREE A EN_COURS DANS LES ETATS DE LA MISSION
  async startMission(missionId, userId) {
    const mission = await mission_model_default.findById(missionId);
    if (mission) {
      mission.etat.set("EN_COURS", mission.etat.get("EN_COURS").concat(userId));
      mission.etat.set("NON_DEMARREE", mission.etat.get("NON_DEMARREE").filter((id) => !id.equals(userId)));
      mission.save();
      return mission;
    } else
      return null;
  }
  // PASSAGE DE l'USERID DE EN_COURS A TERMINEE DANS LES ETATS DE L ACTIVITE
  async endMission(missionId, userId) {
    const mission = await mission_model_default.findById(missionId);
    if (mission) {
      mission.etat.set("TERMINEE", mission.etat.get("TERMINEE").concat(userId));
      mission.etat.set("EN_COURS", mission.etat.get("EN_COURS").filter((id) => !id.equals(userId)));
      mission.save();
      return mission;
    } else
      return null;
  }
  // Toutes les missions dans une room
  async findByRoomId(roomId) {
    try {
      const missions = await mission_model_default.find({
        roomId
      }).exec();
      return missions;
    } catch (error) {
      console.error("Error in findByRoomId:", error);
      throw error;
    }
  }
  async inscrireParticipantsToMission(missionId, roomId) {
    const room = await roomService3.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }
    const participants = room.participants || [];
    const results = [];
    for (const userId of participants) {
      const userObjectId = new import_mongoose13.Types.ObjectId(userId);
      const isInEtat = await this.etatByUser(missionId, userObjectId);
      if (Object.values(etat_enum_default).includes(isInEtat)) {
        results.push({
          userId,
          message: `Ce participant est d\xE9j\xE0 inscrit \xE0 cette mission. \xC9tat d'avancement: ${isInEtat}`
        });
      } else {
        const inscription = await this.inscriptionMission(missionId, userObjectId);
        results.push({
          userId,
          message: inscription ? "Inscription r\xE9ussie" : "Erreur lors de l'inscription"
        });
      }
    }
    return results;
  }
  async insrireParticipantsRoomToMissions(roomId) {
    const missions = await this.findByRoomId(roomId);
    for (const mission of missions) {
      await this.inscrireParticipantsToMission(mission._id, roomId);
    }
  }
  //  LE VISUEL DE LA MISSION 	
  async visuel(missionId) {
    try {
      const mission = await mission_model_default.findById(missionId);
      if (!mission) {
        throw new Error("Mission introuvable");
      } else if (mission) {
        console.log("mission", mission);
        const mediaId = mission.visuel;
        if (mediaId) {
          console.log("mediaId", mediaId);
          const media = await mediaService3.find(mediaId);
          if (media) {
            return media;
          }
        } else {
          return null;
        }
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de la mission:", error);
      throw error;
    }
  }
};
__name(MissionService, "MissionService");

// src/resources/userData/userData.controller.ts
var import_path10 = require("path");
var import_fs5 = __toESM(require("fs"));
var import_axios3 = __toESM(require("axios"));

// src/resources/activity/activity.service.ts
var import_mongoose15 = require("mongoose");

// src/db/activity.model.ts
var import_mongoose14 = __toESM(require("mongoose"));
var extendSchema = require("mongoose-extend-schema");
var ActivitySchema = new import_mongoose14.default.Schema({
  "titre": {
    type: String,
    required: true
  },
  "description": {
    type: String,
    required: true
  },
  "etat": {
    type: Map,
    of: [
      import_mongoose14.Schema.Types.ObjectId
    ],
    required: true,
    default: {
      "EN_COURS": [],
      "NON_DEMARREE": [],
      "TERMINEE": []
    }
  },
  "visible": {
    type: Boolean,
    default: false,
    required: true
  },
  "active": {
    type: Boolean,
    default: false,
    required: true
  },
  "guidee": {
    type: Boolean,
    default: false,
    required: true
  }
}, {
  timestamps: true
});
var ActivityConsulterSchema = extendSchema(ActivitySchema, {
  "description_detaillee_consulter": {
    type: String,
    required: true
  },
  "type": {
    type: String,
    enum: Object.values(media_enum_default),
    required: false
  }
}, {
  timestamps: true
});
var ActivityProduireSchema = extendSchema(ActivitySchema, {
  "description_detaillee_produire": {
    type: String,
    required: true
  },
  "types": [
    {
      type: String,
      enum: Object.values(media_enum_default),
      required: false
    }
  ]
}, {
  timestamps: true
});
ActivitySchema.pre("save", function(next) {
  const etatKeys = Object.values(etat_enum_default);
  const enumKeys = Array.from(this.etat.keys());
  for (const key of etatKeys) {
    if (!enumKeys.includes(key)) {
      const error = new Error(`Invalid key in etat`);
      return next(error);
    }
  }
  next();
});
var Activity = import_mongoose14.default.model("Activity", ActivitySchema);
var ActivityConsulter = Activity.discriminator("ActivityConsulter", ActivityConsulterSchema);
var ActivityProduire = Activity.discriminator("ActivityProduire", ActivityProduireSchema);
var activity_model_default = {
  ActivityConsulter,
  ActivityProduire,
  Activity
};

// src/resources/activity/activity.service.ts
var missionService = new MissionService();
var roomService4 = new RoomService();
var ActivityService = class {
  // Création d une activité !!! HORS CLASS PRODUIRE OU CONSULTER // PAS DE CHAMP TYPE OU decription_detailleee_.....
  async create(data) {
    const newActivity = __spreadValues({}, data);
    console.log("new act in create", newActivity);
    return activity_model_default.Activity.create(newActivity);
  }
  // Trouve tous les activités (produire et consulter confondues)
  async findAll() {
    const consulterActivities = await activity_model_default.Activity.find();
    const produireActivities = await activity_model_default.Activity.find();
    const allActivities = consulterActivities.concat(produireActivities);
    return allActivities;
  }
  // Trouve une activite par son ID
  async find(_id) {
    const researchedActivity = await activity_model_default.Activity.findById(_id);
    return researchedActivity;
  }
  async findById(_id) {
    const researchedActivity = await activity_model_default.Activity.findOne({
      _id
    });
    return researchedActivity;
  }
  // Supprimme une mission par son ID
  async delete(activityId) {
    console.log("activityId", activityId);
    const deletedActivity = await activity_model_default.Activity.findByIdAndDelete(activityId);
    return deletedActivity;
  }
  // Statut Visible de l'activité
  async findVisibilityStatus(activityId) {
    try {
      const activity2 = await activity_model_default.Activity.findById(activityId);
      if (!activity2) {
        throw new Error("Activit\xE9 introuvable");
      } else {
        return activity2.visible;
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de l'activit\xE9:", error);
      throw error;
    }
  }
  // GESTION DES ETATS
  // ETAT d un USER dans une activité
  async etatByUser(activityId, userId) {
    let foundKey = null;
    const activity2 = await activity_model_default.Activity.findById(activityId);
    for (const [key, value] of activity2.etat.entries()) {
      if (value.includes(userId)) {
        foundKey = key;
      }
    }
    if (foundKey !== null) {
      return foundKey;
    } else
      return "Cet utilisateur n a pas \xE9t\xE9 inscrit \xE0 l activit\xE9";
  }
  // AJOUT DE l'USERID A L ARRAY NON_DEMARREE DANS LES ETATS DE L ACTIVITE
  async inscriptionActivity(activityId, userId) {
    const activity2 = await activity_model_default.Activity.findById(activityId);
    if (activity2) {
      activity2.etat.set("NON_DEMARREE", activity2.etat.get("NON_DEMARREE").concat(userId));
      activity2.save();
      console.log("Inscription r\xE9ussie \xE0 l activit\xE9", activityId, "pour", userId);
      return activity2;
    } else
      return null;
  }
  // PASSAGE DE l'USERID DE NON_DEMARREE A EN_COURS DANS LES ETATS DE L ACTIVITE
  async startActivity(activityId, userId) {
    const activity2 = await activity_model_default.Activity.findById(activityId);
    if (activity2) {
      activity2.etat.set("EN_COURS", activity2.etat.get("EN_COURS").concat(userId));
      activity2.etat.set("NON_DEMARREE", activity2.etat.get("NON_DEMARREE").filter((id) => !id.equals(userId)));
      activity2.save();
      console.log("D\xE9marrage r\xE9ussie de l activit\xE9", activityId, "pour", userId);
      return activity2;
    } else
      return null;
  }
  // PASSAGE DE l'USERID DE EN_COURS A TERMINEE DANS LES ETATS DE L ACTIVITE
  async endActivity(activityId, userId) {
    const activity2 = await activity_model_default.Activity.findById(activityId);
    if (activity2) {
      activity2.etat.set("TERMINEE", activity2.etat.get("TERMINEE").concat(userId));
      activity2.etat.set("EN_COURS", activity2.etat.get("EN_COURS").filter((id) => !id.equals(userId)));
      activity2.save();
      console.log("Activit\xE9", activityId, " termin\xE9e avec succ\xE8s pour", userId);
      return activity2;
    } else
      return null;
  }
  // INSCRIPTION PAR ROUTINE POUR INSCRIPTION ROOM ENTIERE
  async inscrireParticipantsToActivity(activityId, roomId) {
    try {
      const mission = await missionService.findMissionByActivity(activityId);
      if (!mission) {
        console.log(`Mission not found for activity ${activityId}`);
        return;
      }
      const room = await roomService4.findById(roomId);
      if (!room) {
        console.log(`Room not found for activity ${activityId}`);
        return;
      }
      const participants = room.participants || [];
      const results = [];
      for (const userId of participants) {
        const userObjectId = new import_mongoose15.Types.ObjectId(userId);
        const isInEtat = await this.etatByUser(activityId, userObjectId);
        if (Object.values(etat_enum_default).includes(isInEtat)) {
          results.push({
            userId,
            message: `Ce participant est d\xE9j\xE0 inscrit \xE0 cette activit\xE9. \xC9tat d'avancement: ${isInEtat}`
          });
        } else {
          const inscription = await this.inscriptionActivity(activityId, userObjectId);
          if (inscription) {
            results.push({
              userId,
              message: "Inscription r\xE9ussie"
            });
          } else {
            results.push({
              userId,
              message: "Erreur lors de l'inscription"
            });
          }
        }
      }
    } catch (error) {
      console.error(`Erreur \xE0 l inscription des participants \xE0 l activit\xE9 ${activityId} pour la salle ${roomId}:`, error);
      throw error;
    }
  }
  // GESTION DES STATUTS
  // Statut Activité de l'activité
  async findActiveStatus(activityId) {
    try {
      const activity2 = await activity_model_default.Activity.findById(activityId);
      if (!activity2) {
        throw new Error("Activit\xE9 introuvable");
      } else {
        return activity2.active;
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de l'activit\xE9:", error);
      throw error;
    }
  }
  // Statut Guidée de l'activité
  async findGuideeStatus(activityId) {
    try {
      const activity2 = await activity_model_default.Activity.findById(activityId);
      if (!activity2) {
        throw new Error("Activit\xE9 introuvable");
      } else {
        return activity2.guidee;
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de l'activit\xE9:", error);
      throw error;
    }
  }
  // Titre de l'activité par ID de l'activité
  async findTitreById(activityId) {
    try {
      const activity2 = await activity_model_default.Activity.findById(activityId);
      if (!activity2) {
        throw new Error("Activit\xE9 introuvable");
      }
      const titre = activity2.titre;
      return titre;
    } catch (error) {
      console.error("Erreur lors de la recherche de l'activit\xE9:", error);
      throw error;
    }
  }
};
__name(ActivityService, "ActivityService");
var ActivityConsulterService = class extends ActivityService {
  // Création d une activité CONSULTER
  static async createConsulter(data) {
    console.log("data", data);
    if (!data.type && !data.description_detaillee_consulter) {
      super.create(data);
    } else {
      console.log("data.type", data.type);
      const newActivityConsulter = __spreadProps(__spreadValues({}, data), {
        type: data.type,
        description_detaillee_consulter: data.description_detaillee_consulter
      });
      console.log("new act in createCONSULTER via  ...", newActivityConsulter);
      return activity_model_default.ActivityConsulter.create(newActivityConsulter);
    }
  }
  // Trouve tous les activités CONSULTER
  static async findAll() {
    const allActivitiesConsulter = await activity_model_default.ActivityConsulter.find();
    console.log("allAct", allActivitiesConsulter);
    return allActivitiesConsulter;
  }
  // Trouve une activité CONSULTER par son ID
  static async findById(_id) {
    const researchedActivity = await activity_model_default.ActivityConsulter.findOne({
      _id
    });
    return researchedActivity;
  }
};
__name(ActivityConsulterService, "ActivityConsulterService");
var ActivityProduireService = class extends ActivityService {
  // Création d une activité PRODUIRE
  static async createProduire(data) {
    console.log("data", data);
    if (!data.types && !data.description_detaillee_produire) {
      console.log("ici");
      super.create(data);
    } else {
      console.log("data.types", data.types);
      const newActivityProduire = __spreadProps(__spreadValues({}, data), {
        types: data.types,
        description_detaillee_produire: data.description_detaillee_produire
      });
      console.log("new act in createProduire ds clas produire", newActivityProduire);
      return activity_model_default.ActivityProduire.create(newActivityProduire);
    }
  }
  // Trouve tous les activités PRODUIRE
  static async findAll() {
    const allActivities = await activity_model_default.ActivityProduire.find();
    console.log("allAct", allActivities);
    return allActivities;
  }
  // Trouve une activité PRODUIRE par son ID
  static async findById(_id) {
    const researchedActivity = await activity_model_default.ActivityProduire.findOne({
      _id
    });
    return researchedActivity;
  }
};
__name(ActivityProduireService, "ActivityProduireService");

// src/resources/userData/userData.controller.ts
var UserDataController = (0, import_express4.Router)();
var service2 = new UserDataService();
var mediaService4 = new MediaService();
var userService3 = new UsersService();
var thumbService2 = new ThumbService();
var activityService = new ActivityService();
var roomService5 = new RoomService();
var missionService2 = new MissionService();
var fileStorage3 = import_multer3.default.diskStorage({
  // définit le dossier de destination à partir de l'ID de l'utilisateur
  destination: function(req, file, cb) {
    const extension = (0, import_path10.extname)(file.originalname);
    try {
      const folder = getFileTypeByExtension(extension);
      req.body.type = folder;
      const dest = (0, import_path10.join)(config2.ATTACHEMENT_SRC, req.body.userId, folder + "s");
      console.log("dest dans userData controller", dest);
      if (!import_fs5.default.existsSync(dest)) {
        import_fs5.default.mkdirSync(dest, {
          recursive: true
        });
      }
      cb(null, (0, import_path10.join)(dest));
    } catch (err) {
      cb(err, "");
    }
  },
  filename: function(req, file, cb) {
    const extension = (0, import_path10.extname)(file.originalname);
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
    console.log("rea.body", req.body);
    const userId = new import_mongoose16.Types.ObjectId(req.body.userId);
    if (!req.body.userId) {
      throw new NotFoundException("ID Utilisateur manquant");
    }
    const user = await userService3.find(userId);
    console.log("user", user);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    const activityId = new import_mongoose16.Types.ObjectId(req.body.activityId);
    if (!req.body.activityId) {
      throw new NotFoundException("ID activit\xE9 manquante");
    }
    const activity1 = await activityService.findById(activityId);
    console.log("activityId", activityId);
    if (!activity1) {
      throw new NotFoundException("Activit\xE9 introuvable");
    }
    let room;
    if (!req.body.room) {
      console.log("yep pas de romCode dans la requ\xEAte");
      const mission = await missionService2.findMissionByActivity(req.body.activityId);
      const roomId = mission.roomId;
      room = await roomService5.findCodeById(roomId);
    } else {
      room = req.body.room;
    }
    let media = void 0;
    console.log("ok");
    let thumb = void 0;
    if (req.file) {
      media = await mediaService4.create(userId, req.body);
      thumb = await thumbService2.create(userId, req.body);
      if (!import_fs5.default.existsSync(thumb.path())) {
        import_fs5.default.mkdirSync(thumb.path(), {
          recursive: true
        });
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
              const result = await thumb_model_default.updateOne({
                _id: thumbId2
              }, {
                $set: {
                  name: newName2
                }
              });
              console.log(`Mise \xE0 jour du document MongoDB : ok`);
            } catch (error) {
              console.error("Mise \xE0 jour du document MongoDB : une erreur est survenue.", error);
            }
          }
          __name(updateThumbName, "updateThumbName");
          updateThumbName(thumbId, newName);
        }).screenshots({
          count: 1,
          filename: thumb.name + ".png",
          folder: outputThumbDir
        });
      }
    }
    const newUserData = await service2.createUserData(user, activity1._id, media == null ? void 0 : media._id, thumb == null ? void 0 : thumb._id, __spreadProps(__spreadValues({}, req.body), {
      room
    }));
    console.log("newuserdata", newUserData);
    import_axios3.default.post("https://" + user.instance + "/html/mobiApp/data", {
      "roomCode": newUserData.room,
      "userId": newUserData.userId,
      "data": {
        "id": newUserData._id.toString(),
        "type": (_a9 = media == null ? void 0 : media.type) != null ? _a9 : media_enum_default.TEXT,
        "media": (_c2 = (_b2 = newUserData.mediaId) == null ? void 0 : _b2.toString()) != null ? _c2 : void 0,
        "description": newUserData.description
      }
    }, {
      headers: {
        "mission-token": TokenHandler()
      }
    }).catch((err) => {
      console.log(err);
    });
    return res.status(201).json(newUserData);
  } catch (err) {
    next(err);
  }
}).delete(async (req, res, next) => {
  try {
    await service2.clear();
    return res.status(200).json();
  } catch (err) {
    next(err);
  }
});
UserDataController.route("/:id([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const userDataId = new import_mongoose16.Types.ObjectId(req.params.id);
    const userData = await service2.find(userDataId);
    if (!userData) {
      throw new NotFoundException("R\xE9ponse introuvable");
    }
    return res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
}).delete(async (req, res, next) => {
  try {
    const userDataId = new import_mongoose16.Types.ObjectId(req.params.id);
    const userData = await service2.find(userDataId);
    if (!userData) {
      throw new NotFoundException("R\xE9ponse introuvable");
    }
    await import_axios3.default.delete("https://" + userData.instance + "/html/mobiApp/data/?roomCode=" + userData.room + "&userId=" + userData.userId + "&dataId=" + userDataId, {
      headers: {
        "mission-token": TokenHandler()
      }
    }).then(async () => {
      try {
        await service2.delete(userDataId);
        if (userData.mediaId) {
          await mediaService4.delete(userData.mediaId);
          console.log("Media supprim\xE9 !");
        }
      } catch (mediaErr) {
        console.log("Erreur \xE0 la suppression du media:", mediaErr);
      }
    }).catch(async (err) => {
      await service2.delete(userDataId);
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
      dataList = await service2.findAll(req.params.room, req.query.instance.toString());
      console.log("dataList", dataList);
    } else {
      dataList = await service2.findAll(req.params.room);
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
      }, {
        headers: {
          "mission-token": TokenHandler()
        }
      }).catch((err) => {
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
    const userId = new import_mongoose16.Types.ObjectId(req.params.userId);
    console.log("userId", userId);
    console.log("req.params.room", req.params.room);
    const user = await userService3.find(userId);
    console.log("user", user);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    const dataList = await service2.findByUserId(user, req.params.room);
    console.log("dataList", dataList);
    return res.status(200).json(dataList);
  } catch (err) {
    next(err);
  }
});
UserDataController.route("/:room([a-z0-9]{6})/:userId([a-z0-9]{24})/:activityId([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    if (req.params.room !== req.params.room.toUpperCase()) {
      throw new NotFoundException("Room code invalide");
    }
    const userId = new import_mongoose16.Types.ObjectId(req.params.userId);
    const user = await userService3.find(userId);
    const activityId = new import_mongoose16.Types.ObjectId(req.params.activityId);
    console.log("activityId", activityId);
    console.log("activity._id", activity == null ? void 0 : activity._id);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    const dataList = await service2.findByUserIdAndActivityId(user, req.params.room, req.params.activityId);
    console.log("dataList", dataList);
    return res.status(200).json(dataList);
  } catch (err) {
    next(err);
  }
});
UserDataController.route("/:activityId([a-z0-9]{24})/:userId([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const userId = new import_mongoose16.Types.ObjectId(req.params.userId);
    const user = await userService3.find(userId);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    const activityId = new import_mongoose16.Types.ObjectId(req.params.activityId);
    const activity1 = await activityService.find(activityId);
    if (!activity1) {
      throw new NotFoundException("Activit\xE9 introuvable");
    }
    const mission = await mission_model_default.find({
      activites: activityId
    });
    console.log("missin", mission);
    if (!mission) {
      throw new NotFoundException("L activit\xE9 n est dans aucune mission");
    }
    const roomId = new import_mongoose16.Types.ObjectId(mission[0].roomId);
    console.log("roomId", roomId);
    const roomCode = await roomService5.findCodeById(roomId);
    console.log("roomId", roomCode);
    const dataList = await service2.findByUserIdAndActivityId(user, roomCode, activityId);
    console.log("dataList", dataList);
    return res.status(200).json(dataList);
  } catch (err) {
    next(err);
  }
});
var userData_controller_default = UserDataController;

// src/resources/instruction/instruction.controller.ts
var import_express5 = require("express");

// src/db/instruction.model.ts
var import_mongoose17 = __toESM(require("mongoose"));
var InstructionSchema = new import_mongoose17.default.Schema({
  "consigne": {
    type: String,
    required: true
  },
  "room": {
    type: String,
    required: true
  },
  "userTarget": {
    type: import_mongoose17.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});
var MInstruction = import_mongoose17.default.model("Instruction", InstructionSchema);
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
    const instructionList = await instruction_model_default.find({
      room
    }).exec();
    return instructionList;
  }
  // Trouve la liste des consignes pour un utilisateur donné
  async findByUserId(userTarget, room) {
    const instructionList = await instruction_model_default.find({
      userTarget,
      room
    }).exec();
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
__name(InstructionService, "InstructionService");

// src/resources/instruction/instruction.controller.ts
var import_mongoose18 = require("mongoose");
var InstructionController = (0, import_express5.Router)();
var instructionService = new InstructionService();
var usersService = new UsersService();
InstructionController.route("/").post(async (req, res, next) => {
  try {
    console.log("rq.bod.roomy", req.body.room);
    const roomRegex = /^[A-Z0-9]{6}$/;
    if (!roomRegex.test(req.body.room)) {
      return res.status(400).send("Le champ room doit \xEAtre constitu\xE9 de 6 caract\xE8res, les lettres doivent \xEAtre en majuscules.");
    }
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
    const instructionId = new import_mongoose18.Types.ObjectId(req.params.InstructionId);
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
    const userTarget = new import_mongoose18.Types.ObjectId(req.params.userTarget);
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
var mediaService5 = new MediaService();
var userDataService2 = new UserDataService();
MoodleController.route("/users").get(async (req, res) => {
  const userList = await userService4.findAll();
  const parsedList = [];
  if (userList.length === 0)
    return res.status(404).json({
      message: "moodle/users Pas de donn\xE9es participants dans cette instance"
    });
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
    mediaList.push(await mediaService5.findByUserId(userList[i]._id));
  }
  if (mediaList.length === 0)
    return res.status(404).json({
      message: "Pas de media dans cette instance"
    });
  return res.status(200).json(mediaList);
});
MoodleController.route("/userDatas").get(async (req, res) => {
  const userList = await userService4.findAll();
  const userDataList = [];
  for (let i = 0; i < userList.length; i++) {
    userDataList.push(await userDataService2.findByUserId(userList[i]));
  }
  if (userDataList.length === 0)
    return res.status(404).json({
      message: "Aucun participant ne s'est connect\xE9 \xE0  cette instance"
    });
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
  return res.status(200).json(userDataList);
});
var moodle_controller_default = MoodleController;

// src/resources/mission/mission.controller.ts
var import_express7 = require("express");
var import_mongoose19 = require("mongoose");
var import_path11 = require("path");
var import_fs6 = __toESM(require("fs"));
var import_multer4 = __toESM(require("multer"));
var MissionController = (0, import_express7.Router)();
var service3 = new MissionService();
var roomService6 = new RoomService();
var mediaService6 = new MediaService();
var activityService2 = new ActivityService();
var userService5 = new UsersService();
var instanceService3 = new InstanceService();
MissionController.route("/").get(async (req, res) => {
  try {
    const missionList = await service3.findAll();
    console.log("missionList;", missionList);
    if (missionList.length === 0) {
      return res.status(404).json({
        message: "Aucune mission trouv\xE9e"
      });
    }
    return res.status(200).json(missionList);
  } catch (error) {
    console.error("Error in GET /missions:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
}).post(async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Votre requ\xEAte est vide."
      });
    } else {
      const mission = await service3.createMission(req.body);
      const room = await roomService6.findById(req.body.roomId);
      if (room) {
        const roomId = new import_mongoose19.Types.ObjectId(req.body.roomId);
        room.mission.push(mission._id);
        await roomService6.update(room, roomId);
      } else {
        console.log("salle inconnue");
      }
      return res.status(201).json(mission);
    }
  } catch (error) {
    console.error("Error in POST /missions:", error);
    return res.status(500).json({
      message: "Erreur de pram\xE0tres"
    });
  }
});
MissionController.route("/:instanceName/:roomCode([A-Z-z0-9]{6})/").post(async (req, res, next) => {
  try {
    const instanceName = req.params.instanceName;
    const instance = await instanceService3.findByName(instanceName);
    if (!instance) {
      return res.status(404).json({
        message: "Instance introuvable"
      });
    }
    const roomCode = req.params.roomCode;
    const room = await roomService6.findByCodeAndInstance(roomCode, instanceName);
    if (!room) {
      return res.status(404).json({
        message: "Salle introuvable"
      });
    }
    const roomId = room._id;
    const mission = await service3.createMissionByCode(req.body, roomId);
    room == null ? void 0 : room.mission.push(mission._id);
    await roomService6.update(room, roomId);
    return res.status(201).json(mission);
  } catch (error) {
    console.error("Error in POST /missions//:instanec/:roomCode:");
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: `Echec \xE0 la validation de la mission  : ${messages.join(", ")}`
      });
    }
    next(error);
  }
}).get(async (req, res, next) => {
  try {
    const room = await roomService6.findByCodeAndInstance(req.params.roomCode, req.params.instanceName);
    if (room) {
      const missionList = room.mission;
      console.log("missionList", missionList);
      const missions = await Promise.all(missionList.map(async (element) => {
        return service3.find(element);
      }));
      console.log("missions dans instancce +rommcode", missions);
      return res.status(201).json(missions);
    } else {
      return res.status(404).json({
        error: "Room not found"
      });
    }
  } catch (err) {
    console.error("Error in GET /liste missions par instance et roomCode:", err);
    next(err);
  }
});
MissionController.route("/:id([a-z0-9]{24})/").get(async (req, res, next) => {
  try {
    const id = new import_mongoose19.Types.ObjectId(req.params.id);
    const mission = await service3.find(id);
    return res.status(200).json(mission);
  } catch (err) {
    console.error("Error in POST /missions/id:");
    next(err);
  }
}).delete(async (req, res, next) => {
  const id = new import_mongoose19.Types.ObjectId(req.params.id);
  const mission = await service3.find(id);
  if (!mission) {
    return res.status(404).json({
      error: `Mission avec ID ${id} non trouv\xE9e`
    });
  }
  try {
    await service3.delete(id);
    const room = await roomService6.findById(mission.roomId);
    if (room) {
      room.mission = room.mission.filter((id2) => !id2.equals(mission._id));
      await room.save();
    }
    return res.status(200).json(mission);
  } catch (error) {
    console.error("Erreur dans DELETE /missions/id:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
MissionController.route("/:idMission([a-z0-9]{24})/:idUser([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const missionId = new import_mongoose19.Types.ObjectId(req.params.idMission);
    const mission = await service3.find(missionId);
    const userId = new import_mongoose19.Types.ObjectId(req.params.idUser);
    const user = await userService5.find(userId);
    if (user === null) {
      return res.status(404).send("Le participant est introuvable");
    } else {
      if (mission === null) {
        return res.status(404).send("La mission est introuvable");
      } else {
        const userState = await service3.etatByUser(missionId, userId);
        const newResponse = {
          _id: mission._id,
          titre: mission.titre,
          roomId: mission.roomId,
          activites: mission.activites,
          nb_activites: mission.nb_activites,
          etat: userState,
          visible: mission.visible,
          active: mission.active,
          guidee: mission.guidee,
          visuel: mission.visuel,
          createdAt: mission.createdAt,
          updatedat: mission.updatedAt,
          __v: mission.__v
        };
        return res.status(200).json(newResponse);
      }
    }
  } catch (err) {
    console.error("Error in get /missions/idmission/iduser:");
    next(err);
  }
});
MissionController.route("/byRoomId/:roomId([a-z0-9]{24})/").get(async (req, res, next) => {
  try {
    const roomId = new import_mongoose19.Types.ObjectId(req.params.roomId);
    const missions = await service3.findByRoomId(roomId);
    const userId = new import_mongoose19.Types.ObjectId(req.params.userId);
    const user = await userService5.find(userId);
    console.log("ussser", user);
    if (!missions || missions.length === 0) {
      return res.status(404).send("Aucune mission trouv\xE9e pour cette salle");
    }
    return res.status(200).json(missions);
  } catch (err) {
    console.error("Error in get /missions/room/roomId:");
    next(err);
  }
});
MissionController.route("/listetat/:roomId([a-z0-9]{24})/:userId([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const roomId = new import_mongoose19.Types.ObjectId(req.params.roomId);
    const missions = await service3.findByRoomId(roomId);
    const userId = new import_mongoose19.Types.ObjectId(req.params.userId);
    const user = await userService5.find(userId);
    console.log("ussser", user);
    if (!missions || missions.length === 0) {
      return res.status(404).send("Aucune mission trouv\xE9e pour cette salle");
    }
    const responses = [];
    for (const mission of missions) {
      const userState = await service3.etatByUser(mission._id, user._id);
      const newResponse = {
        _id: mission._id,
        titre: mission.titre,
        roomId: mission.roomId,
        activites: mission.activites,
        nb_activites: mission.nb_activites,
        etat: userState,
        visible: mission.visible,
        active: mission.active,
        guidee: mission.guidee,
        visuel: mission.visuel,
        createdAt: mission.createdAt,
        updatedAt: mission.updatedAt,
        __v: mission.__v
      };
      responses.push(newResponse);
    }
    return res.status(200).json(responses);
  } catch (err) {
    console.error("Error in get /missions/room/roomId:");
    next(err);
  }
});
MissionController.route("/:id([a-z0-9]{24})/isVisible/").get(async (req, res) => {
  try {
    const id = new import_mongoose19.Types.ObjectId(req.params.id);
    const statusVisible = await service3.findVisibilityStatus(new import_mongoose19.Types.ObjectId(id));
    return res.status(200).json(statusVisible);
  } catch (error) {
    console.error("Error in GET /missions/{id}/isVisible:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
MissionController.route("/:id([a-z0-9]{24})/change-to-visible/").post(async (req, res) => {
  const id = req.params.id;
  const mission = await service3.find(new import_mongoose19.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const statusVisible = await service3.findVisibilityStatus(new import_mongoose19.Types.ObjectId(id));
    console.log("status visible", statusVisible);
    const titre = await service3.findTitreByid(new import_mongoose19.Types.ObjectId(id));
    if (statusVisible === true) {
      return res.status(200).json("Mission :  " + titre + " est d\xE9j\xE0 visible");
    } else {
      if (mission) {
        mission.visible = true;
        await mission.save();
        return res.status(201).json("Mission :  " + titre + " est d\xE9sormais visible");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
MissionController.route("/:id([a-z0-9]{24})/change-to-not-visible/").post(async (req, res) => {
  const id = req.params.id;
  const mission = await service3.find(new import_mongoose19.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const statusVisible = await service3.findVisibilityStatus(new import_mongoose19.Types.ObjectId(id));
    const titre = await service3.findTitreByid(new import_mongoose19.Types.ObjectId(id));
    console.log("statut visible", statusVisible);
    if (!statusVisible) {
      return res.status(200).json("Mission :  " + titre + " est d\xE9j\xE0 non visible");
    } else {
      if (mission) {
        mission.visible = false;
        await mission.save();
        return res.status(201).json("Mission :  " + titre + " est d\xE9sormais non visible");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
MissionController.route("/:id([a-z0-9]{24})/isActive/").get(async (req, res) => {
  try {
    const id = new import_mongoose19.Types.ObjectId(req.params.id);
    const isActiveStatus = await service3.findActiveStatus(id);
    return res.status(200).json(isActiveStatus);
  } catch (error) {
    console.error("Error in GET /missions/{id}/isActive:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
MissionController.route("/:id([a-z0-9]{24})/change-to-active/").post(async (req, res) => {
  const id = req.params.id;
  const mission = await service3.find(new import_mongoose19.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const statusActive = await service3.findActiveStatus(new import_mongoose19.Types.ObjectId(id));
    console.log("status visible", statusActive);
    const titre = await service3.findTitreByid(new import_mongoose19.Types.ObjectId(id));
    if (statusActive === true) {
      return res.status(200).json("Mission :  " + titre + " est d\xE9j\xE0 active");
    } else {
      if (mission) {
        mission.active = true;
        await mission.save();
        return res.status(201).json("Mission :  " + titre + " est d\xE9sormais active");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
MissionController.route("/:id([a-z0-9]{24})/change-to-not-active/").post(async (req, res) => {
  const id = req.params.id;
  const mission = await service3.find(new import_mongoose19.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const statusActive = await service3.findActiveStatus(new import_mongoose19.Types.ObjectId(id));
    const titre = await service3.findTitreByid(new import_mongoose19.Types.ObjectId(id));
    console.log("statut visible", statusActive);
    if (!statusActive) {
      return res.status(200).json("Mission :  " + titre + " est d\xE9j\xE0 non active");
    } else {
      if (mission) {
        mission.active = false;
        await mission.save();
        return res.status(201).json("Mission :  " + titre + " est d\xE9sormais non active");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
MissionController.route("/:id([a-z0-9]{24})/isGuidee/").get(async (req, res) => {
  try {
    const id = new import_mongoose19.Types.ObjectId(req.params.id);
    const isGuideeStatus = await service3.findGuideeStatus(id);
    return res.status(200).json(isGuideeStatus);
  } catch (error) {
    console.error("Error in GET /missions/{id}/isGuidee:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
MissionController.route("/:id([a-z0-9]{24})/change-to-guidee/").post(async (req, res) => {
  const id = req.params.id;
  const mission = await service3.find(new import_mongoose19.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const statusGuidee = await service3.findGuideeStatus(new import_mongoose19.Types.ObjectId(id));
    console.log("status visible", statusGuidee);
    const titre = await service3.findTitreByid(new import_mongoose19.Types.ObjectId(id));
    if (statusGuidee === true) {
      return res.status(200).json("Mission :  " + titre + " est d\xE9j\xE0 guid\xE9e");
    } else {
      if (mission) {
        mission.guidee = true;
        await mission.save();
        return res.status(201).json("Mission :  " + titre + " est d\xE9sormais guid\xE9e");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
MissionController.route("/:id([a-z0-9]{24})/change-to-not-guidee/").post(async (req, res) => {
  const id = req.params.id;
  const mission = await service3.find(new import_mongoose19.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const statusActive = await service3.findGuideeStatus(new import_mongoose19.Types.ObjectId(id));
    const titre = await service3.findTitreByid(new import_mongoose19.Types.ObjectId(id));
    console.log("statut visible", statusActive);
    if (!statusActive) {
      return res.status(200).json("Mission :  " + titre + " est d\xE9j\xE0 non guid\xE9e");
    } else {
      if (mission) {
        mission.guidee = false;
        await mission.save();
        return res.status(201).json("Mission :  " + titre + " est d\xE9sormais non guid\xE9e");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
MissionController.route("/:id([a-z0-9]{24})/activitesID").get(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const mission = await service3.find(new import_mongoose19.Types.ObjectId(id));
    const activityList = mission == null ? void 0 : mission.activites;
    if (mission) {
      return res.status(200).json(activityList);
    } else {
      return res.status(404).json("Mission non trouv\xE9e.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
});
MissionController.route("/:id([a-z0-9]{24})/activites").get(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const mission = await service3.find(new import_mongoose19.Types.ObjectId(id));
    if (!mission) {
      return res.status(404).json({
        error: "Mission non trouv\xE9e."
      });
    }
    const activityIds = mission.activites || [];
    const activities = await Promise.all(activityIds.map((activityId) => activityService2.find(new import_mongoose19.Types.ObjectId(activityId))));
    return res.status(200).json(activities);
  } catch (error) {
    console.error("Erreur lors de la r\xE9cup\xE9ration des activit\xE9s de la mission.", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
});
MissionController.route("/:id([a-z0-9]{24})/activitesVisibles").get(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const mission = await service3.find(new import_mongoose19.Types.ObjectId(id));
    if (!mission) {
      return res.status(404).json({
        error: "Mission non trouv\xE9e."
      });
    }
    const activityIds = mission.activites || [];
    const activities = await Promise.all(activityIds.map((activityId) => activityService2.find(new import_mongoose19.Types.ObjectId(activityId))));
    const visibleActivities = activities.filter((activity2) => activity2.visible === true);
    return res.status(200).json(visibleActivities);
  } catch (error) {
    console.error("Error fetching mission visible activities:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
});
MissionController.route("/:id([a-z0-9]{24})/activitesActives").get(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const mission = await service3.find(new import_mongoose19.Types.ObjectId(id));
    if (!mission) {
      return res.status(404).json({
        error: "Mission non trouv\xE9e."
      });
    }
    const activityIds = mission.activites || [];
    const activities = await Promise.all(activityIds.map((activityId) => activityService2.find(new import_mongoose19.Types.ObjectId(activityId))));
    const activeActivities = activities.filter((activity2) => activity2.active === true);
    return res.status(200).json(activeActivities);
  } catch (error) {
    console.error("Error fetching mission visible activities:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
});
MissionController.route("/:id([a-z0-9]{24})/activitesGuidees").get(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  try {
    const mission = await service3.find(new import_mongoose19.Types.ObjectId(id));
    if (!mission) {
      return res.status(404).json({
        error: "Mission non trouv\xE9e."
      });
    }
    const activityIds = mission.activites || [];
    const activities = await Promise.all(activityIds.map((activityId) => activityService2.find(new import_mongoose19.Types.ObjectId(activityId))));
    const guideeActivities = activities.filter((activity2) => (activity2 == null ? void 0 : activity2.guidee) === true);
    return res.status(200).json(guideeActivities);
  } catch (error) {
    console.error("Error fetching mission visible activities:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
});
MissionController.route("/:id([a-z0-9]{24})/visuel").get(async (req, res) => {
  const missionId = req.params.id;
  const mission = await service3.find(new import_mongoose19.Types.ObjectId(missionId));
  try {
    if (!mission) {
      return res.status(404).json({
        message: "La mission est introuvable"
      });
    } else {
      console.log(" mission inctrl/visuel", mission);
      const visuel = await service3.visuel(mission._id);
      console.log("visue", visuel);
      if (visuel === null) {
        console.log("ca opass ici");
        return res.sendFile((0, import_path11.join)(config2.ATTACHEMENT_SRC, "mission-visuel-default.jpg"));
      }
      if (visuel) {
        return res.sendFile((0, import_path11.join)(config2.ATTACHEMENT_SRC, "VISUEL-MISSIONS", "images", visuel.name));
      }
    }
  } catch (error) {
    console.error("Erreur au telechargment du visuel d la mission:", error);
    return res.status(500).json({
      message: "Erreur Interne du server"
    });
  }
});
MissionController.route("/:missionId([a-z0-9]{24})/visuel").delete(async (req, res, next) => {
  try {
    const missionId = new import_mongoose19.Types.ObjectId(req.params.missionId);
    const mission = await service3.find(missionId);
    if (!mission) {
      return res.status(404).json({
        error: "Mission non trouv\xE9e."
      });
    }
    const visuel = await service3.visuel(missionId);
    if (!visuel) {
      return res.status(404).json({
        error: "Visuel non trouv\xE9."
      });
    }
    import_fs6.default.unlinkSync((0, import_path11.join)(config2.ATTACHEMENT_SRC, "VISUEL-MISSIONS", "images", visuel.name));
    await mediaService6.delete(visuel._id);
    mission.visuel = null;
    await mission.save();
    return res.status(200).json();
  } catch (err) {
    next(err);
  }
});
var fileStorage4 = import_multer4.default.diskStorage({
  // définit le dossier de destination à partir de l'ID de l'utilisateur
  destination: function(req, file, cb) {
    const extension = (0, import_path11.extname)(file.originalname);
    try {
      const folder = getFileTypeByExtension(extension);
      req.body.type = folder;
      const dest = (0, import_path11.join)(config2.ATTACHEMENT_SRC, "VISUEL-MISSIONS", folder + "s");
      if (!import_fs6.default.existsSync(dest)) {
        import_fs6.default.mkdirSync(dest, {
          recursive: true
        });
      }
      cb(null, (0, import_path11.join)(dest));
    } catch (err) {
      cb(err, "");
    }
  },
  filename: function(req, file, cb) {
    const extension = (0, import_path11.extname)(file.originalname);
    try {
      const fileName = getFileNameFormatted(file.originalname, extension);
      req.body.name = fileName;
      cb(null, fileName);
    } catch (err) {
      cb(err, "");
    }
  }
});
var fileUpload3 = (0, import_multer4.default)({
  storage: fileStorage4
});
MissionController.route("/:idMission([a-z0-9]{24})/change-visuel").post(fileUpload3.single("file"), async (req, res, next) => {
  try {
    const missionId = new import_mongoose19.Types.ObjectId(req.params.idMission);
    const mission = await service3.find(missionId);
    if (!mission) {
      return res.status(404).send("Mission not found");
    }
    console.log("mission", mission);
    const room = mission.roomId;
    if (!room) {
      return res.status(400).send("Room ID not found in mission");
    }
    console.log("rooom", room);
    const researchedRoom = await roomService6.findById(room);
    if (!researchedRoom) {
      return res.status(404).send("Room not found");
    }
    const userId = researchedRoom.moderatorId;
    console.log("userId", userId);
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    const createdVisuel = await mediaService6.create(userId, req.body);
    mission.visuel = createdVisuel._id;
    console.log("mission.visuel", mission.visuel);
    await mission.save();
    return res.status(201).json(createdVisuel);
  } catch (err) {
    next(err);
  }
});
MissionController.route("/:missionId([a-z0-9]{24})/etat/:userId([a-z0-9]{24})/").get(async (req, res) => {
  const missionId = new import_mongoose19.Types.ObjectId(req.params.missionId);
  const userId = new import_mongoose19.Types.ObjectId(req.params.userId);
  const user = await userService5.find(userId);
  const mission = await service3.find(missionId);
  console.log("userid", user);
  if (user === null) {
    return res.status(404).send("Le participant est introuvable");
  } else {
    if (mission === null) {
      return res.status(404).send("La mission est introuvable");
    } else {
      try {
        const etatByUser = await service3.etatByUser(missionId, userId);
        if (Object.values(etat_enum_default).includes(etatByUser)) {
          return res.status(200).send(etatByUser);
        } else {
          return res.status(200).send(etatByUser);
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
    }
  }
});
MissionController.route("/:missionId([a-z0-9]{24})/inscrire/:userId([a-z0-9]{24})/").post(async (req, res) => {
  try {
    const missionId = new import_mongoose19.Types.ObjectId(req.params.missionId);
    const userId = new import_mongoose19.Types.ObjectId(req.params.userId);
    const user = await userService5.find(userId);
    const mission = await service3.find(missionId);
    console.log("userid", user);
    if (user === null) {
      return res.status(404).send("Le participant est introuvable");
    } else {
      if (mission === null) {
        return res.status(404).send("La mission est introuvable");
      } else {
        const isInEtat = await service3.etatByUser(missionId, userId);
        if (isInEtat === "NON_DEMARREE" || isInEtat === "EN_COURS" || isInEtat === "TERMINEE") {
          console.log("User d\xE9j\xE0 in array", isInEtat);
          return res.status(500).send(`Ce participant est d\xE9j\xE0 inscrit \xE0 cette mission. \xC9tat d'avancement: ${isInEtat}`);
        } else {
          const actvityEtatNonDem = await service3.inscriptionMission(missionId, userId);
          if (actvityEtatNonDem) {
            return res.status(200).send(actvityEtatNonDem);
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
MissionController.route("/:missionId([a-z0-9]{24})/inscrireRoom/").post(async (req, res) => {
  try {
    const missionId = new import_mongoose19.Types.ObjectId(req.params.missionId);
    const mission = await service3.findById(missionId);
    if (!mission) {
      return res.status(404).send("Mission introuvable.");
    }
    const roomId = mission == null ? void 0 : mission.roomId;
    if (roomId) {
      const room = await roomService6.findById(roomId);
      if (!room) {
        return res.status(404).send("Room non trouv\xE9e.");
      }
      const participants = room.participants || [];
      const results = [];
      for (const userId of participants) {
        const userObjectId = new import_mongoose19.Types.ObjectId(userId);
        const isInEtat = await service3.etatByUser(missionId, userObjectId);
        if (Object.values(etat_enum_default).includes(isInEtat)) {
          results.push({
            userId,
            message: `Ce participant est d\xE9j\xE0 inscrit \xE0 cette mission. \xC9tat d'avancement: ${isInEtat}`
          });
        } else {
          const inscription = await service3.inscriptionMission(missionId, userObjectId);
          if (inscription) {
            results.push({
              userId,
              message: "Inscription r\xE9ussie"
            });
          } else {
            console.log("AAA");
            results.push({
              userId,
              message: "Erreur lors de l'inscription"
            });
          }
        }
      }
      return res.status(200).json(results);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
MissionController.route("/:missionId([a-z0-9]{24})/start/:userId([a-z0-9]{24})/").post(async (req, res) => {
  try {
    const missionId = new import_mongoose19.Types.ObjectId(req.params.missionId);
    const userId = new import_mongoose19.Types.ObjectId(req.params.userId);
    const user = await userService5.find(userId);
    const mission = await service3.find(missionId);
    if (user === null) {
      return res.status(404).send("Le participant est introuvable");
    } else {
      if (mission === null) {
        return res.status(404).send("La mission est introuvable");
      } else {
        const isInEtat = await service3.etatByUser(missionId, userId);
        console.log("Isinetat", isInEtat);
        if (isInEtat === "EN_COURS") {
          console.log("User d\xE9j\xE0 in array", isInEtat);
          return res.status(500).send("Mission d\xE9j\xE0 en cours pour ce participant");
        } else if (isInEtat === "TERMINEE") {
          console.log("User d\xE9j\xE0 in array", isInEtat);
          return res.status(500).send("Mission d\xE9j\xE0 termin\xE9e pour ce participant");
        } else if (isInEtat === "NON_DEMARREE") {
          const missionEnCoursPourUser = await service3.startMission(missionId, userId);
          if (missionEnCoursPourUser) {
            return res.status(200).send(missionEnCoursPourUser);
          }
        } else
          return res.status(500).send("Le participant n a jamais \xE9t\xE9 inscrit \xE0 la mission");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
MissionController.route("/:missionId([a-z0-9]{24})/end/:userId([a-z0-9]{24})/").post(async (req, res) => {
  try {
    const missionId = new import_mongoose19.Types.ObjectId(req.params.missionId);
    const userId = new import_mongoose19.Types.ObjectId(req.params.userId);
    const user = await userService5.find(userId);
    const mission = await service3.find(missionId);
    console.log("userid", user);
    if (user === null) {
      return res.status(404).send("Le participant est introuvable");
    } else {
      if (mission === null) {
        return res.status(404).send("La mission est introuvable");
      } else {
        const isInEtat = await service3.etatByUser(missionId, userId);
        console.log("Isinetat", isInEtat);
        if (isInEtat === "NON_DEMARREE") {
          console.log("Le participant n a pas commenc\xE9 la mission.");
          return res.status(500).send("Mission jamais commenc\xE9e pour ce participant");
        } else if (isInEtat === "TERMINEE") {
          console.log("User d\xE9j\xE0 in array", isInEtat);
          return res.status(500).send("Mission d\xE9j\xE0 termin\xE9e pour ce participant");
        } else if (isInEtat === "EN_COURS") {
          const missionTermineePourUser = await service3.endMission(missionId, userId);
          if (missionTermineePourUser) {
            return res.status(200).send(missionTermineePourUser);
          }
        } else
          return res.status(500).send("Le participant n a jamais \xE9t\xE9 inscrit \xE0 la mission");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
var mission_controller_default = MissionController;

// src/resources/room/room.controller.ts
var import_express8 = require("express");
var import_mongoose20 = require("mongoose");
var RoomController = (0, import_express8.Router)();
var service4 = new RoomService();
RoomController.route("/").get(async (req, res) => {
  try {
    const roomList = await roomService.findAll();
    if (roomList.length === 0) {
      return res.status(404).json({
        message: "Aucune salle trouv\xE9e"
      });
    }
    return res.status(200).json(roomList);
  } catch (error) {
    console.error("Error in GET /room:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
RoomController.route("/:id([a-z0-9]{24})/").get(async (req, res, next) => {
  try {
    const id = new import_mongoose20.Types.ObjectId(req.params.id);
    const room = await service4.findById(id);
    return res.status(200).json(room);
  } catch (err) {
    next(err);
  }
});
RoomController.route("/:id([a-z0-9]{24})/moderator").get(async (req, res, next) => {
  try {
    const id = new import_mongoose20.Types.ObjectId(req.params.id);
    const room = await service4.findById(id);
    const moderator = room == null ? void 0 : room.moderatorId;
    return res.status(200).json(moderator);
  } catch (err) {
    next(err);
  }
});
RoomController.route("/:id([a-z0-9]{24})/participants").get(async (req, res, next) => {
  try {
    const id = new import_mongoose20.Types.ObjectId(req.params.id);
    const room = await service4.findById(id);
    const participantsList = room == null ? void 0 : room.participants;
    return res.status(200).json(participantsList);
  } catch (err) {
    next(err);
  }
});
RoomController.route("/:instanceName/:roomCode([A-Z0-9]{6})/participants").get(async (req, res, next) => {
  try {
    const room = await service4.findByCodeAndInstance(req.params.roomCode, req.params.instanceName);
    if (!room) {
      return res.status(404).json({
        message: "Salle introuvable"
      });
    }
    const participantsList = room == null ? void 0 : room.participants;
    return res.status(200).json(participantsList);
  } catch (err) {
    next(err);
  }
});
RoomController.route("/:id([a-z0-9]{24})/missions").get(async (req, res, next) => {
  try {
    const id = new import_mongoose20.Types.ObjectId(req.params.id);
    const room = await service4.findById(id);
    const missionsList = room == null ? void 0 : room.mission;
    return res.status(200).json(missionsList);
  } catch (err) {
    next(err);
  }
});
RoomController.route("/:instanceName/:roomCode([A-Z0-9]{6})/missions").get(async (req, res, next) => {
  try {
    const room = await service4.findByCodeAndInstance(req.params.roomCode, req.params.instanceName);
    if (!room) {
      return res.status(404).json({
        message: "Salle introuvable"
      });
    }
    const missionsList = room == null ? void 0 : room.mission;
    return res.status(200).json(missionsList);
  } catch (err) {
    next(err);
  }
});
var room_controller_default = RoomController;

// src/resources/instance/instance.controller.ts
var import_express9 = require("express");
var import_mongoose21 = require("mongoose");
var InstanceController = (0, import_express9.Router)();
var roomService7 = new RoomService();
var service5 = new InstanceService();
InstanceController.route("/").get(async (req, res) => {
  try {
    const roomList = await roomService7.findAll();
    if (roomList.length === 0) {
      return res.status(404).json({
        message: "Aucune salle trouv\xE9e"
      });
    }
    return res.status(200).json(roomList);
  } catch (error) {
    console.error("Error in GET /room:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
InstanceController.route("/:id([a-z0-9]{24})/").get(async (req, res, next) => {
  try {
    const id = new import_mongoose21.Types.ObjectId(req.params.id);
    const room = await roomService7.findById(id);
    return res.status(200).json(room);
  } catch (err) {
    next(err);
  }
});
InstanceController.route("/:instanceName/:roomCode([A-Z0-9]{6})/moderator").get(async (req, res, next) => {
  try {
    const roomCode = req.params.roomCode;
    const instanceName = req.params.instanceName;
    const instance = await service5.findByName(instanceName);
    if (!instance) {
      return res.status(404).json({
        error: "Instance introuvable."
      });
    }
    const room = await roomService7.findByCodeAndInstance(roomCode, instanceName);
    if (!room) {
      return res.status(404).json({
        error: "Salle introuvable."
      });
    }
    const roomId = room._id.toString();
    const roomsInInstance = instance.rooms.map((room2) => room2.toString());
    if (!roomsInInstance.includes(roomId)) {
      return res.status(403).json({
        error: "Aucune salle avec ce code dans cette instance. "
      });
    }
    const moderatorId = room.moderatorId.toString();
    return res.status(200).json(moderatorId);
  } catch (err) {
    next(err);
  }
});
var instance_controller_default = InstanceController;

// src/middlewares/exceptions.handler.ts
var ExceptionsHandler = /* @__PURE__ */ __name((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err.status && err.error) {
    return res.status(err.status).json({
      error: err.error
    });
  }
  return res.status(500).json({
    error: err
  });
}, "ExceptionsHandler");

// src/middlewares/unknownRoutes.handler.ts
var UnknownRoutesHandler = /* @__PURE__ */ __name(() => {
  throw new NotFoundException("La ressource demand\xE9e n'existe pas");
}, "UnknownRoutesHandler");

// src/index.ts
var import_body_parser = __toESM(require("body-parser"));
var import_http = __toESM(require("http"));
var import_https = __toESM(require("https"));
var import_fs8 = require("fs");
var import_swagger_jsdoc = __toESM(require("swagger-jsdoc"));
var import_swagger_ui_express = __toESM(require("swagger-ui-express"));

// src/resources/activity/activity.controller.ts
var import_express10 = require("express");
var import_mongoose22 = require("mongoose");
var import_path12 = require("path");
var import_fs7 = __toESM(require("fs"));
var import_multer5 = __toESM(require("multer"));
var service6 = new ActivityService();
var missionService3 = new MissionService();
var userService6 = new UsersService();
var roomService8 = new RoomService();
var fileStorage5 = import_multer5.default.diskStorage({
  // définit le dossier de destination à partir de l'ID de l'utilisateur
  destination: function(req, file, cb) {
    const extension = (0, import_path12.extname)(file.originalname);
    try {
      const folder = getFileTypeByExtension(extension);
      console.log("extension", extension);
      console.log("folder", folder);
      req.body.type = folder;
      const dest = (0, import_path12.join)(config2.ATTACHEMENT_SRC, req.body.userId, folder + "s");
      if (!import_fs7.default.existsSync(dest)) {
        import_fs7.default.mkdirSync(dest, {
          recursive: true
        });
      }
      cb(null, (0, import_path12.join)(dest));
    } catch (err) {
      cb(err, "");
    }
  },
  filename: function(req, file, cb) {
    const extension = (0, import_path12.extname)(file.originalname);
    try {
      const fileName = getFileNameFormatted(file.originalname, extension);
      req.body.name = fileName;
      cb(null, fileName);
    } catch (err) {
      cb(err, "");
    }
  }
});
var fileUpload4 = (0, import_multer5.default)({
  storage: fileStorage5
});
var ActivityController = (0, import_express10.Router)();
var activityService3 = new ActivityService();
ActivityController.route("/").get(async (req, res, next) => {
  try {
    const activityList = await service6.findAll();
    return res.status(200).json(activityList);
  } catch (err) {
    next(err);
  }
}).post(async (req, res, next) => {
  try {
    if (req.body.description_detaillee_consulter) {
      const savedConsulter = await ActivityConsulterService.createConsulter(req.body);
      return res.status(201).json(savedConsulter);
    } else if (req.body.description_detaillee_produire) {
      const savedProduire = await ActivityProduireService.createProduire(req.body);
      return res.status(201).json(savedProduire);
    } else {
      const savedActivity = await service6.create(req.body);
      return res.status(201).json(savedActivity);
    }
  } catch (error) {
    console.error("Error in POST /activity/");
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: `Echec \xE0 la validation de l activit\xE9 : ${messages.join(", ")}`
      });
    }
    next(error);
  }
});
ActivityController.route("/consulter").post(async (req, res, next) => {
  try {
    if (!req.body.description_detaillee_consulter) {
      return res.status(400).json({
        message: "Le champ description_detaillee_consulter est requis."
      });
    }
    const activityConsulter = await ActivityConsulterService.createConsulter(req.body);
    return res.status(201).send(activityConsulter);
  } catch (error) {
    console.error("Error in POST /activity/consulter");
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: `Echec \xE0 la validation de l activit\xE9 produire: ${messages.join(", ")}`
      });
    }
    next(error);
  }
}).get(async (req, res, next) => {
  try {
    const activityConsulterList = await ActivityConsulterService.findAll();
    return res.status(200).send(activityConsulterList);
  } catch (error) {
    next(error);
  }
});
ActivityController.route("/produire").post(async (req, res, next) => {
  try {
    if (!req.body.description_detaillee_produire) {
      return res.status(400).json({
        message: "Le champ description_detaillee_produire est requis."
      });
    }
    const activityProduire = await ActivityProduireService.createProduire(req.body);
    return res.status(201).send(activityProduire);
  } catch (error) {
    console.error("Error in POST /activity/produire");
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: `Echec \xE0 la validation de l activit\xE9 produire: ${messages.join(", ")}`
      });
    }
    next(error);
  }
}).get(async (req, res, next) => {
  try {
    const activityProduireList = await ActivityProduireService.findAll();
    return res.json(activityProduireList);
  } catch (err) {
    next(err);
  }
});
ActivityController.route("/:id([a-z0-9]{24})/").get(async (req, res, next) => {
  try {
    const id = new import_mongoose22.Types.ObjectId(req.params.id);
    const activity2 = await service6.findById(id);
    return res.status(200).json(activity2);
  } catch (err) {
    next(err);
  }
}).delete(async (req, res, next) => {
  const id = new import_mongoose22.Types.ObjectId(req.params.id);
  const activity2 = await service6.findById(id);
  if (!activity2) {
    return res.status(404).json({
      error: `Activit\xE9 avec ID ${id} non trouv\xE9e`
    });
  }
  try {
    const missions = await mission_model_default.find({
      activites: id
    });
    for (const mission of missions) {
      mission.activites.pull(id);
      mission.nb_activites = mission.activites.length;
      await mission.save();
    }
    await service6.delete(id);
    return res.status(200).json({
      message: `Activit\xE9  ${id} supprim\xE9e avec succ\xE8s`
    });
  } catch (error) {
    console.error("Error in DELETE /activity/id:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
ActivityController.route("/:idActivity([a-z0-9]{24})/:idUser([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const activityId = new import_mongoose22.Types.ObjectId(req.params.idActivity);
    const activity2 = await service6.find(activityId);
    const userId = new import_mongoose22.Types.ObjectId(req.params.idUser);
    const user = await userService6.find(userId);
    if (user === null) {
      return res.status(404).send("Le participant est introuvable");
    } else {
      if (activity2 === null) {
        return res.status(404).send("L activit\xE9 est introuvable");
      } else {
        const userState = await service6.etatByUser(activityId, userId);
        const newResponse = {
          _id: activity2._id,
          titre: activity2.titre,
          description: activity2.description,
          description_detaillee_produire: activity2.description_detaillee_produire,
          description_detaillee_consulter: activity2.description_detaillee_consulter,
          type: activity2.type,
          types: activity2.types,
          etat: userState,
          visible: activity2.visible,
          active: activity2.active,
          guidee: activity2.guidee,
          __t: activity2.__t,
          createdAt: activity2.createdAt,
          updatedat: activity2.updatedAt,
          __v: activity2.__v
        };
        return res.status(200).json(newResponse);
      }
    }
  } catch (err) {
    console.error("Error in get /missions/idmission/iduser:");
    next(err);
  }
});
ActivityController.route("/listetat/:idMission([a-z0-9]{24})/:idUser([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const missionId = new import_mongoose22.Types.ObjectId(req.params.idMission);
    const mission = await missionService3.find(missionId);
    const userId = new import_mongoose22.Types.ObjectId(req.params.idUser);
    const user = await userService6.find(userId);
    if (user === null) {
      return res.status(404).send("Le participant est introuvable");
    } else {
      if (mission === null) {
        return res.status(404).send("La mission est introuvable");
      } else {
        const activityIdList = mission.activites;
        if (!activityIdList || activityIdList.length === 0) {
          return res.status(404).send("Aucune activit\xE9 trouv\xE9e pour cette mission");
        }
        const responses = [];
        for (const activityId of activityIdList) {
          const userState = await service6.etatByUser(activityId, userId);
          const activity2 = await service6.findById(activityId);
          const newResponse = {
            _id: activity2._id,
            titre: activity2.titre,
            description: activity2.description,
            description_detaillee_produire: activity2.description_detaillee_produire,
            description_detaillee_consulter: activity2.description_detaillee_consulter,
            type: activity2.type,
            types: activity2.types,
            etat: userState,
            visible: activity2.visible,
            active: activity2.active,
            guidee: activity2.guidee,
            __t: activity2.__t,
            createdAt: activity2.createdAt,
            updatedat: activity2.updatedAt,
            __v: activity2.__v
          };
          responses.push(newResponse);
        }
        return res.status(200).json(responses);
      }
    }
  } catch (err) {
    console.error("Error in get /missions/idmission/iduser:");
    next(err);
  }
});
ActivityController.route("/addToMission/:idActivity([a-z0-9]{24})/:idMission([a-z0-9]{24})").post(async (req, res) => {
  try {
    const idActivity = req.params.idActivity;
    const idMission = req.params.idMission;
    const activity2 = await service6.findById(new import_mongoose22.Types.ObjectId(idActivity));
    if (!activity2) {
      return res.status(404).json({
        error: `Activit\xE9 avec ID ${idActivity} non trouv\xE9e`
      });
    }
    const mission = await mission_model_default.findById(new import_mongoose22.Types.ObjectId(idMission));
    if (!mission) {
      return res.status(404).json({
        error: `Mission avec ID ${idMission} non trouv\xE9e`
      });
    }
    const activityInOtherMission = await mission_model_default.findOne({
      activites: activity2._id
    });
    if (activityInOtherMission) {
      if (activityInOtherMission._id.equals(mission._id)) {
        return res.status(409).json({
          message: `L'activit\xE9 avec ID ${idActivity} est d\xE9j\xE0 pr\xE9sente dans cette mission.`
        });
      } else {
        return res.status(409).json({
          message: `L'activit\xE9 avec ID ${idActivity} est d\xE9j\xE0 pr\xE9sente dans une autre mission. Utilisez la m\xE9thode de duplication pour ajouter une activit\xE9 similaire \xE0 cette mission.`
        });
      }
    }
    if (mission.activites.includes(activity2._id)) {
      return res.status(409).json({
        message: "L'activit\xE9 est d\xE9j\xE0 pr\xE9sente dans la mission."
      });
    }
    mission.activites.push(activity2._id);
    mission.nb_activites += 1;
    await mission.save();
    return res.status(200).json(mission);
  } catch (error) {
    console.error("Error in Post /activity/mission/idAct/idMiss:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
}).delete(async (req, res) => {
  try {
    const idActivity = req.params.idActivity;
    const idMission = req.params.idMission;
    const activity2 = await service6.findById(new import_mongoose22.Types.ObjectId(idActivity));
    if (!activity2) {
      return res.status(404).json({
        error: `Activit\xE9 avec ID ${idActivity} non trouv\xE9e`
      });
    }
    const mission = await mission_model_default.findById(new import_mongoose22.Types.ObjectId(idMission));
    if (!mission) {
      return res.status(404).json({
        error: `Mission avec ID ${idMission} non trouv\xE9e`
      });
    }
    if (!mission.activites.includes(activity2._id)) {
      return res.status(409).json({
        message: "L'activit\xE9 n'est pas pr\xE9sente dans la mission."
      });
    }
    mission.activites = mission.activites.filter((id) => !id.equals(activity2._id));
    mission.nb_activites -= 1;
    await mission.save();
    return res.status(200).json({
      message: `L'activit\xE9 ${activity2} a \xE9t\xE9 retir\xE9e de la mission avec succ\xE8s.`
    });
  } catch (error) {
    console.error("Error in Delete /activity/mission/idAct/idMiss:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
ActivityController.route("/duplicate/:idActivity([a-z0-9]{24})").post(async (req, res) => {
  try {
    const idActivity = req.params.idActivity;
    console.log("idActivity", idActivity);
    const activitytodup = await service6.findById(new import_mongoose22.Types.ObjectId(idActivity));
    console.log("activitytodup", activitytodup);
    const isConsulter = activitytodup == null ? void 0 : activitytodup.description_detaillee_consulter;
    const isProduire = activitytodup == null ? void 0 : activitytodup.description_detaillee_produire;
    console.log("isConsulter", isConsulter);
    if (isProduire) {
      console.log("yyyy");
    }
    if (!isConsulter && !isProduire) {
      return res.status(404).json({
        error: `Activit\xE9 avec ID ${idActivity} non trouv\xE9e`
      });
    }
    if (isConsulter) {
      const activityData = {
        _id: new import_mongoose22.Types.ObjectId(),
        titre: activitytodup.titre + "-Copie",
        description: activitytodup.description,
        etat: activitytodup.etat,
        description_detaillee_consulter: activitytodup.description_detaillee_consulter,
        active: activitytodup.active,
        guidee: activitytodup.guidee,
        visible: activitytodup.visible,
        type: activitytodup.type
      };
      const duplicatedActivityConsulter = await ActivityConsulterService.createConsulter(activityData);
      return res.status(200).json(duplicatedActivityConsulter);
    }
    if (isProduire) {
      const activityData = {
        _id: new import_mongoose22.Types.ObjectId(),
        titre: activitytodup.titre + "-Copie",
        description: activitytodup.description,
        etat: activitytodup.etat,
        description_detaillee_produire: activitytodup.description_detaillee_produire,
        active: activitytodup.active,
        guidee: activitytodup.guidee,
        visible: activitytodup.visible,
        types: activitytodup.types
      };
      const duplicatedActivityConsulter = await ActivityProduireService.createProduire(activityData);
      return res.status(200).json(duplicatedActivityConsulter);
    }
  } catch (error) {
    console.error("Error in POST activity/duplicate/:idActivity:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
ActivityController.route("/:id([a-z0-9]{24})/isVisible").get(async (req, res) => {
  try {
    const id = new import_mongoose22.Types.ObjectId(req.params.id);
    const activity2 = await service6.findById(id);
    if (!activity2) {
      return res.status(404).json("Activit\xE9 introuvable");
    }
    const statusVisible = await service6.findVisibilityStatus(id);
    return res.status(200).json(statusVisible);
  } catch (error) {
    console.error("Error in GET /activity/{id}/isVisible:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
ActivityController.route("/:id([a-z0-9]{24})/change-to-visible").post(async (req, res) => {
  const id = req.params.id;
  const activity2 = await service6.find(new import_mongoose22.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  if (!activity2) {
    return res.status(404).json("Activit\xE9 introuvable");
  }
  try {
    const statusVisible = await service6.findVisibilityStatus(new import_mongoose22.Types.ObjectId(id));
    console.log("status visible", statusVisible);
    const titre = await service6.findTitreById(new import_mongoose22.Types.ObjectId(id));
    if (statusVisible === true) {
      return res.status(200).json("Activit\xE9 :  " + titre + " est d\xE9j\xE0 visible");
    } else {
      if (activity2) {
        activity2.visible = true;
        await activity2.save();
        return res.status(201).json("Activit\xE9 :  " + titre + " est d\xE9sormais visible");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
ActivityController.route("/:id([a-z0-9]{24})/change-to-not-visible").post(async (req, res) => {
  const id = req.params.id;
  const activity2 = await service6.find(new import_mongoose22.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  if (!activity2) {
    return res.status(404).json("Activit\xE9 introuvable");
  }
  try {
    const statusVisible = await service6.findVisibilityStatus(new import_mongoose22.Types.ObjectId(id));
    const titre = await service6.findTitreById(new import_mongoose22.Types.ObjectId(id));
    console.log("statut visible", statusVisible);
    if (!statusVisible) {
      return res.status(200).json("Activit\xE9 :  " + titre + " est d\xE9j\xE0 non visible");
    } else {
      if (activity2) {
        activity2.visible = false;
        await activity2.save();
        return res.status(201).json("Activit\xE9 :  " + titre + " est d\xE9sormais non visible");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
ActivityController.route("/:id([a-z0-9]{24})/isActive").get(async (req, res) => {
  try {
    const id = new import_mongoose22.Types.ObjectId(req.params.id);
    const isActiveStatus = await service6.findActiveStatus(id);
    return res.status(200).json(isActiveStatus);
  } catch (error) {
    console.error("Error in GET /activity/{id}/isActive:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
ActivityController.route("/:id([a-z0-9]{24})/change-to-active").post(async (req, res) => {
  const id = req.params.id;
  const activity2 = await service6.find(new import_mongoose22.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  if (!activity2) {
    return res.status(404).json("Activit\xE9 introuvable");
  }
  try {
    const statusActive = await service6.findActiveStatus(new import_mongoose22.Types.ObjectId(id));
    const titre = await service6.findTitreById(new import_mongoose22.Types.ObjectId(id));
    console.log("statut active", statusActive);
    if (statusActive) {
      return res.status(200).json("Activit\xE9 :  " + titre + " est d\xE9j\xE0 active");
    } else {
      if (activity2) {
        activity2.active = true;
        await activity2.save();
        return res.status(201).json("Activit\xE9 :  " + titre + " est d\xE9sormais active");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
ActivityController.route("/:id([a-z0-9]{24})/change-to-not-active").post(async (req, res) => {
  const id = req.params.id;
  const activity2 = await service6.find(new import_mongoose22.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  if (!activity2) {
    return res.status(404).json("Activit\xE9 introuvable");
  }
  try {
    const statusActive = await service6.findActiveStatus(new import_mongoose22.Types.ObjectId(id));
    const titre = await service6.findTitreById(new import_mongoose22.Types.ObjectId(id));
    console.log("statut active", statusActive);
    if (!statusActive) {
      return res.status(200).json("Activit\xE9 :  " + titre + " est d\xE9j\xE0 non active");
    } else {
      if (activity2) {
        activity2.active = false;
        await activity2.save();
        return res.status(201).json("Activit\xE9 :  " + titre + " est d\xE9sormais non active");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
ActivityController.route("/:id([a-z0-9]{24})/isGuidee").get(async (req, res) => {
  try {
    const id = new import_mongoose22.Types.ObjectId(req.params.id);
    const isGuideeStatus = await service6.findGuideeStatus(id);
    return res.status(200).json(isGuideeStatus);
  } catch (error) {
    console.error("Error in GET /activity/{id}/isActive:", error);
    return res.status(500).json({
      message: "Erreur du serveur"
    });
  }
});
ActivityController.route("/:id([a-z0-9]{24})/change-to-guidee").post(async (req, res) => {
  const id = req.params.id;
  const activity2 = await service6.find(new import_mongoose22.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  if (!activity2) {
    return res.status(404).json("Activit\xE9 introuvable");
  }
  try {
    const statusGuidee = await service6.findGuideeStatus(new import_mongoose22.Types.ObjectId(id));
    const titre = await service6.findTitreById(new import_mongoose22.Types.ObjectId(id));
    console.log("statut guidee", statusGuidee);
    if (statusGuidee) {
      return res.status(200).json("Activit\xE9 :  " + titre + " est d\xE9j\xE0 guid\xE9e");
    } else {
      if (activity2) {
        activity2.guidee = true;
        await activity2.save();
        return res.status(201).json("Activit\xE9 :  " + titre + " est d\xE9sormais guid\xE9e");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
ActivityController.route("/:id([a-z0-9]{24})/change-to-not-guidee").post(async (req, res) => {
  const id = req.params.id;
  const activity2 = await service6.find(new import_mongoose22.Types.ObjectId(id));
  if (!id) {
    return res.status(400).send("Le champ ID est manquant.");
  }
  if (!activity2) {
    return res.status(404).json("Activit\xE9 introuvable");
  }
  try {
    const statusGuidee = await service6.findGuideeStatus(new import_mongoose22.Types.ObjectId(id));
    const titre = await service6.findTitreById(new import_mongoose22.Types.ObjectId(id));
    console.log("statut guidee", statusGuidee);
    if (!statusGuidee) {
      return res.status(200).json("Activit\xE9 :  " + titre + " est d\xE9j\xE0 non guid\xE9e");
    } else {
      if (activity2) {
        activity2.guidee = false;
        await activity2.save();
        return res.status(201).json("Activit\xE9 :  " + titre + " est d\xE9sormais non guid\xE9e");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
ActivityController.route("/:activityId([a-z0-9]{24})/etat/:userId([a-z0-9]{24})/").get(async (req, res) => {
  try {
    const activityId = new import_mongoose22.Types.ObjectId(req.params.activityId);
    const userId = new import_mongoose22.Types.ObjectId(req.params.userId);
    const user = await userService6.find(userId);
    const activity2 = await service6.find(activityId);
    console.log("userid", user);
    if (user === null) {
      return res.status(404).send("Le participant est introuvable");
    } else {
      {
        if (activity2 === null) {
          return res.status(404).send("L activit\xE9 est introuvable");
        } else {
          const etatByUser = await service6.etatByUser(activityId, userId);
          if (Object.values(etat_enum_default).includes(etatByUser)) {
            return res.status(200).send(etatByUser);
          } else {
            return res.status(200).send(etatByUser);
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
ActivityController.route("/:activityId([a-z0-9]{24})/inscrire/:userId([a-z0-9]{24})/").post(async (req, res) => {
  try {
    const activityId = new import_mongoose22.Types.ObjectId(req.params.activityId);
    const userId = new import_mongoose22.Types.ObjectId(req.params.userId);
    const user = await userService6.find(userId);
    const activity2 = await service6.find(activityId);
    console.log("userid", user);
    if (user === null) {
      return res.status(404).send("Le participant n existe pas en bdd");
    } else {
      {
        if (activity2 === null) {
          return res.status(404).send("L activit\xE9 est introuvable");
        } else {
          const isInEtat = await service6.etatByUser(activityId, userId);
          if (isInEtat === "NON_DEMARREE" || isInEtat === "EN_COURS" || isInEtat === "TERMINEE") {
            console.log("User d\xE9j\xE0 in array", isInEtat);
            return res.status(500).send(`Ce participant est d\xE9j\xE0 inscrit \xE0 cette activit\xE9. \xC9tat d'avancement: ${isInEtat}`);
          } else {
            const actvityEtatNonDem = await service6.inscriptionActivity(activityId, userId);
            if (actvityEtatNonDem) {
              return res.status(200).send(actvityEtatNonDem);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
ActivityController.route("/:activityId([a-z0-9]{24})/inscrireRoom/").post(async (req, res) => {
  try {
    const activityId = new import_mongoose22.Types.ObjectId(req.params.activityId);
    const mission = await missionService3.findMissionByActivity(activityId);
    const roomId = new import_mongoose22.Types.ObjectId(mission == null ? void 0 : mission.roomId);
    const room = await roomService8.findById(roomId);
    if (!room) {
      return res.status(404).send("Room non trouv\xE9e.");
    }
    const participants = room.participants || [];
    const results = [];
    for (const userId of participants) {
      const userObjectId = new import_mongoose22.Types.ObjectId(userId);
      const isInEtat = await activityService3.etatByUser(activityId, userObjectId);
      if (Object.values(etat_enum_default).includes(isInEtat)) {
        console.log("ouipipi");
        results.push({
          userId,
          message: `Ce participant est d\xE9j\xE0 inscrit \xE0 cette activit\xE9. \xC9tat d'avancement: ${isInEtat}`
        });
      } else {
        const inscription = await activityService3.inscriptionActivity(activityId, userObjectId);
        if (inscription) {
          results.push({
            userId,
            message: "Inscription r\xE9ussie"
          });
        } else {
          results.push({
            userId,
            message: "Erreur lors de l'inscription"
          });
        }
      }
    }
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
ActivityController.route("/:activityId([a-z0-9]{24})/start/:userId([a-z0-9]{24})/").post(async (req, res) => {
  try {
    const activityId = new import_mongoose22.Types.ObjectId(req.params.activityId);
    const userId = new import_mongoose22.Types.ObjectId(req.params.userId);
    const user = await userService6.find(userId);
    const activity2 = await service6.find(activityId);
    if (user === null) {
      return res.status(404).send("Le participant est introuvable");
    }
    if (activity2 === null) {
      return res.status(404).send("L activit\xE9 est introuvable");
    }
    const isInEtat = await service6.etatByUser(activityId, userId);
    console.log("Isinetat", isInEtat);
    if (isInEtat === "EN_COURS") {
      console.log("User d\xE9j\xE0 in array", isInEtat);
      return res.status(500).send("Activit\xE9 d\xE9j\xE0 en cours pour ce participant");
    } else if (isInEtat === "TERMINEE") {
      return res.status(500).send("Activit\xE9 d\xE9j\xE0 termin\xE9e pour ce participant");
    } else if (isInEtat === "NON_DEMARREE") {
      const actvityDemPourUser = await service6.startActivity(activityId, userId);
      if (actvityDemPourUser) {
        const mission = await missionService3.findMissionByActivity(activityId);
        const userStateMission = await missionService3.etatByUser(mission._id, userId);
        if (userStateMission === "NON_DEMARREE") {
          await missionService3.startMission(mission._id, userId);
        }
        return res.status(200).send(actvityDemPourUser);
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
ActivityController.route("/:activityId([a-z0-9]{24})/end/:userId([a-z0-9]{24})/").post(async (req, res) => {
  try {
    const activityId = new import_mongoose22.Types.ObjectId(req.params.activityId);
    const activity2 = await service6.find(activityId);
    if (activity2 === null) {
      return res.status(404).send("L activit\xE9 est introuvable");
    }
    const userId = new import_mongoose22.Types.ObjectId(req.params.userId);
    const user = await userService6.find(userId);
    if (user === null) {
      return res.status(404).send("Le participant est introuvable");
    } else {
      const isInEtat = await service6.etatByUser(activityId, userId);
      console.log("Isinetat", isInEtat);
      if (isInEtat === "NON_DEMARREE") {
        console.log("User n a pas commenc\xE9 l activit\xE9", isInEtat);
        return res.status(500).send("Le participant est inscrit mais n a jamais d\xE9marr\xE9 l activit\xE9, nous ne pouvons pas changer l \xE9tat \xE0 termin\xE9e.");
      } else if (isInEtat === "TERMINEE") {
        console.log("User d\xE9j\xE0 in array", isInEtat);
        return res.status(500).send("Activit\xE9 d\xE9j\xE0 termin\xE9e pour cet User");
      } else if (isInEtat === "EN_COURS") {
        const actvityTermineePourUser = await service6.endActivity(activityId, userId);
        if (actvityTermineePourUser) {
          const mission = await missionService3.findMissionByActivity(activityId);
          if (mission === null) {
            return res.status(404).send("Mission introuvable");
          }
          const activityIdList = mission == null ? void 0 : mission.activites;
          const result = [];
          for (const activityId2 of activityIdList) {
            const etatUser = await service6.etatByUser(activityId2, userId);
            result.push(etatUser);
          }
          const allTerminee = result.every((etat) => etat === "TERMINEE");
          if (allTerminee) {
            console.log("Toutes les activit\xE9s de la mission sont 'terminee'");
            await missionService3.endMission(mission == null ? void 0 : mission._id, userId);
          } else {
            console.log("Des activit\xE9s ne sont pas 'terminee'");
          }
          return res.status(200).send(actvityTermineePourUser);
        }
      } else
        return res.status(500).send("Le user n a pas \xE9t\xE9 inscrit \xE0 l activit\xE9, il n est pas pr\xE9sent dans les etats de celle ci");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
ActivityController.route("/ressource-consulter/:activityId([a-z0-9]{24})").get(async (req, res, next) => {
  try {
    const activityId = new import_mongoose22.Types.ObjectId(req.params.activityId);
    const activity2 = await service6.findById(activityId);
    if (activity2 === null) {
      return res.status(404).send("L'activit\xE9 est introuvable");
    }
    const mission = await missionService3.findMissionByActivity(activityId);
    const roomId = new import_mongoose22.Types.ObjectId(mission == null ? void 0 : mission.roomId);
    const room = await roomService8.findById(roomId);
    if (!room) {
      return res.status(404).send("La salle est introuvable");
    }
    const userId = new import_mongoose22.Types.ObjectId(room.moderatorId);
    const axios4 = require("axios");
    try {
      const response = await axios4.get(`${config2.BASE_URL}/datas/${activityId}/${userId}`);
      console.log("response", response);
      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        const newResponse = {
          _id: data._id,
          description: data.description,
          mediaId: data.mediaId,
          type: data.type
        };
        return res.json(newResponse);
      } else {
        return res.status(404).json({
          message: "Pas de ressource pour cette activit\xE9"
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({
          message: "Pas de ressource pour cette activit\xE9"
        });
      }
      throw error;
    }
  } catch (err) {
    console.error("Erreur dans get /ressource-consulter/:activityId", err);
    next(err);
  }
});
var activity_controller_default = ActivityController;

// src/index.ts
var missionService4 = new MissionService();
var activityService4 = new ActivityService();
var roomService9 = new RoomService();
var app = (0, import_express11.default)();
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
  apis: [
    "**/*.controller.ts"
  ]
};
var specs = (0, import_swagger_jsdoc.default)(swaggerOptions);
app.use(import_body_parser.default.json());
app.use(import_body_parser.default.urlencoded({
  extended: true
}));
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
app.use("/activity", activity_controller_default);
app.use("/room", room_controller_default);
app.use("/instance", instance_controller_default);
app.use("/moodle", moodle_controller_default);
app.use("/docs", import_swagger_ui_express.default.serve);
app.get("/docs", import_swagger_ui_express.default.setup(specs, {
  customCss: ".swagger-ui .topbar { display: none } .try-out { display: none }",
  customSiteTitle: "MISSIONS HUB DOCS",
  customfavIcon: "https://missions.mobiteach.fr/mobi.ico"
}));
app.use("/", import_express11.default.static(__dirname + "/../public", {
  dotfiles: "allow"
}));
app.all("*", UnknownRoutesHandler);
app.use(ExceptionsHandler);
app.use((req, res, next) => {
  req.acceptsCharsets("utf-8");
  res.charset = "utf-8";
  next();
});
var addConnectedUsersToMission = /* @__PURE__ */ __name(async () => {
  try {
    const rooms = await roomService9.findAll();
    for (const room of rooms) {
      await missionService4.insrireParticipantsRoomToMissions(room._id);
    }
  } catch (error) {
    console.error("Erreur lors de l ajout des participants aux missions :", error);
  }
}, "addConnectedUsersToMission");
var addConnectedUsersToActivities = /* @__PURE__ */ __name(async () => {
  try {
    const rooms = await roomService9.findAll();
    for (const room of rooms) {
      const missions = await missionService4.findByRoomId(room._id);
      for (const mission of missions) {
        const activityList = mission == null ? void 0 : mission.activites;
        for (const activity2 of activityList) {
          const activityId = activity2._id;
          await activityService4.inscrireParticipantsToActivity(activityId, room._id);
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de l ajout des participants aux activit\xE9s :", error);
  }
}, "addConnectedUsersToActivities");
var missionIntervalId = setInterval(() => addConnectedUsersToMission(), 5e3);
var activityIntervalId = setInterval(() => addConnectedUsersToActivities(), 5e3);
var start = /* @__PURE__ */ __name(async () => {
  try {
    if (!(config2.SSL_KEY && config2.SSL_CERT)) {
      httpServer.listen(config2.API_PORT);
      console.log("MISSION HTTP server \xE0 l'\xE9coute sur : " + config2.API_PORT);
      import_mongoose23.default.connect(config2.DB_URI);
      httpServer.on("error", (err) => {
        throw err;
      });
      process.on("SIGINT", () => {
        httpServer.close();
      });
      httpServer.on("close", async () => {
        clearInterval(missionIntervalId);
        clearInterval(activityIntervalId);
        await import_mongoose23.default.disconnect();
        console.log("Server closed");
      });
    }
    if (config2.SSL_KEY && config2.SSL_CERT) {
      const options = {
        key: (0, import_fs8.readFileSync)(config2.SSL_KEY),
        cert: (0, import_fs8.readFileSync)(config2.SSL_CERT)
      };
      const httpsServer = import_https.default.createServer(options, app);
      httpsServer.listen(443);
      console.log("HTTPS (avec key et cert) server is listening on port : 443");
      import_mongoose23.default.connect(config2.DB_URI);
      httpsServer.on("error", (err) => {
        throw err;
      });
      process.on("SIGINT", () => {
        httpsServer.close();
      });
      httpsServer.on("close", async () => {
        clearInterval(missionIntervalId);
        clearInterval(activityIntervalId);
        httpsServer.close();
      });
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}, "start");
start();
