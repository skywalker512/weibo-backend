import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true }, // 以邮箱作为用户的唯一凭据, 以来统一第三方登陆
  name: { type: String, required: true }, // 用户名
  group: { type: Number, default: 2 },   // 用户组
  avatar: { type: String, default: '' },    // 头像
  profile: { type: String, default: '' },   // 个人简介
  password: { type: String, required: true },
  starMeNum: { type: Number, default: 0 }, // 粉丝数
  starOtherNum:{ type: Number, default: 0 }, // 关注的用户数
  lastPublishAt: { type: Date, default: Date.now },  // 用户最后发帖
  phone: { type: String, default: '' },
},{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

export default mongoose.model('User', UserSchema);