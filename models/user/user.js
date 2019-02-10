import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true }, // 以邮箱作为用户的唯一凭据, 以来统一第三方登陆
  name: { type: String, required: true }, // 用户名
  avatar: { type: String, default: '' },    // 头像
  profile: { type: String, default: '' },   // 个人简介
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // 用户资料的更新
  lastPublishAt: { type: Date, default: Date.now },  // 用户最后发帖
  like: [{ type: Schema.Types.ObjectId, ref: 'Article' }], // 喜欢
});

export default mongoose.model('User', UserSchema);