import UserModel from '../../models/user/user';
import ArticleModel from '../../models/article/article';
import FavoriteModel from '../../models/article/favorite'
import ImageModel from '../../models/article/image'
import StarModel from '../../models/user/star'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import md5 from 'md5';
import { user as userConfig } from '../../config/common'
import mailConfig from '../../config/email'
import sms from './sms'
import VideoModel from '../../models/article/video'

const Store = new Redis({ url: process.env.REDIS }).client

class UserController {
    static async registerByPhone(ctx) {
        if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了' });

        const { phone, name, code } = ctx.request.body;

        // 为什么不在前端验证，因为接口是开放的，这样就可以注册空用户名了
        if (!name || !phone || !code) return ctx.error({ msg: '提交的信息不能为空不能为空' });
        const saveCode = await Store.hget(`phone:${phone}`, 'code')
        if (!saveCode) return ctx.error({ msg: '验证码已过期' })
        if (!(String(code) === String(saveCode))) return ctx.error({ msg: '验证码出错' })
        if (!userConfig.namePattern.test(name)) return ctx.error({ msg: '用户名必须大于4个字符小于16个字符' });

        const isExitPhone = await UserModel.findOne({ phone });
        if (isExitPhone) return ctx.error({ msg: '电话已存在' });

        const isExitName = await UserModel.findOne({ name })
        if (isExitName) return ctx.error({ msg: '用户名已存在' });
        const email = `${phone}@phone`
        const avatar = userConfig.gavatar + md5(email) + userConfig.gavaterOption;
        const result = await UserModel.create({ email, name, password: md5(phone+process.env.APP_SECRET), avatar, phone });
        const res = await UserModel.findOne({ _id: result._id }, { password: 0 })

        if (!res) return ctx.error({ msg: '注册失败' });
        ctx.setCookies(result._id, result.group);
        ctx.session.maxAge = 0;
        return ctx.success({ msg: '注册成功', data: res });
    }

    static async loginByPhone(ctx) {
        if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了' });

        const { phone, code, isKeep } = ctx.request.body;
        if (!phone || !code) return ctx.error({ msg: '提交的信息不能为空不能为空' });
        // 块级作用域
        const saveCode = await Store.hget(`phone:${phone}`, 'code')
        if (!saveCode) return ctx.error({ msg: '验证码已过期' })
        if (!(String(code) === String(saveCode))) return ctx.error({ msg: '验证码出错' })
        const result = await UserModel.findOne({ phone }, { password: 0 });

        if (!result) return ctx.error({ msg: '登陆信息错误' });

        // 种下 Cookies
        ctx.setCookies(result._id, result.group);
        if (Number(isKeep) === 0) ctx.session.maxAge = 0;
        // 这里在登陆的时候就传回数据，以减少请求
        ctx.success({ msg: '登录成功', data: result });
    }

    

    static async verifyPhone(ctx) {
        if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了' });
        const { phone } = ctx.request.body
        if (!phone) return ctx.error({ msg: '数据发送失败' })
        const ko = {
            code: mailConfig.code(),
            expire: mailConfig.expire(),
            phone,
        }
        let isSend = 0
        await sms([String(ko.code), '15'], String(phone)).then(res => {
            if (String(res.errmsg) === 'OK') isSend = 1
            Store.hmset(`phone:${phone}`, 'code', ko.code)
            Store.pexpireat(`phone:${phone}`, ko.expire)
        })
        if (isSend === 1) {
            return ctx.success({ msg: '短信发送成功' })
        } else {
            return ctx.error({ msg: '短信发送失败' })
        }
    }

    static async verifyEmail(ctx) {
        if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了' });
        const { email } = ctx.request.body
        if (!email) return ctx.error({ msg: '数据发送失败' })
        const ko = {
            code: mailConfig.code(),
            expire: mailConfig.expire(),
            email,
        }
        const mailOption = mailConfig.mailOption(ko.code, ko.email)
        const transporter = nodeMailer.createTransport(mailConfig.smtp)
        let isSend = 0
        await transporter.sendMail(mailOption).then(() => {
            Store.hmset(`mail:${ko.email}`, 'code', ko.code)
            Store.pexpireat(`mail:${ko.email}`, ko.expire)
            isSend = 1
        })
        if (isSend === 1) {
            return ctx.success({ msg: '邮件发送成功' })
        } else {
            return ctx.error({ msg: '邮件发送失败' })
        }
    }

    static async register(ctx) {
        if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了' });
        if (!ctx.session.isPass) return ctx.error({ msg: '您没有通过验证' });
        ctx.session.isPass = false // 用完既销毁 将状态取消

        const { email, name, password, code } = ctx.request.body;

        // 为什么不在前端验证，因为接口是开放的，这样就可以注册空用户名了
        if (!name || !password || !email || !code) return ctx.error({ msg: '提交的信息不能为空不能为空' });
        const saveCode = await Store.hget(`mail:${email}`, 'code')
        if (!saveCode) return ctx.error({ msg: '验证码已过期' })
        if (!(String(code) === String(saveCode))) return ctx.error({ msg: '验证码出错' })
        if (!userConfig.namePattern.test(name)) return ctx.error({ msg: '用户名必须大于4个字符小于16个字符' });
        if (!userConfig.passwordPattern.test(password)) return ctx.error({ msg: '密码必须分别包含2个大小写字母,并且大于6个字符小于16个字符' });
        if (!userConfig.emailPattern.test(email)) return ctx.error({ msg: '请输入正确的邮箱地址' });

        const isExitEmail = await UserModel.findOne({ email });
        if (isExitEmail) return ctx.error({ msg: '邮箱已存在' });

        const isExitName = await UserModel.findOne({ name })
        if (isExitName) return ctx.error({ msg: '用户名已存在' });
        const avatar = userConfig.gavatar + md5(email) + userConfig.gavaterOption;
        const result = await UserModel.create({ email, name, password: md5(password), avatar });
        const res = await UserModel.findOne({ _id: result._id }, { password: 0 })

        if (!res) return ctx.error({ msg: '注册失败' });
        ctx.setCookies(result._id, result.group);
        ctx.session.maxAge = 0;
        return ctx.success({ msg: '注册成功', data: res });
    }

    static async login(ctx) {
        if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了' });
        if (!ctx.session.isPass) return ctx.error({ msg: '您没有通过验证' });
        ctx.session.isPass = false // 用完既销毁 将状态取消

        const { info, password, isKeep } = ctx.request.body;
        if (!info || !password) return ctx.error({ msg: '提交的信息不能为空不能为空' });
        // 仅检查密码
        if (!userConfig.passwordPattern.test(password)) return ctx.error({ msg: '密码必须分别包含2个大小写字母,并且大于6个字符小于16个字符' });
        // 块级作用域
        let result;
        // 如果符合 邮箱规则
        if (userConfig.emailPattern.test(info)) {
            // 已通过 if 来检查了
            result = await UserModel.findOne({ email: info, password: md5(password) }, { password: 0 });
        } else {
            if (!userConfig.namePattern.test(info)) return ctx.error({ msg: '用户名必须大于4个字符小于16个字符' });
            result = await UserModel.findOne({ name: info, password: md5(password) }, { password: 0 });
        }
        if (!result) return ctx.error({ msg: '登陆信息错误' });
        // 种下 Cookies
        ctx.setCookies(result._id, result.group);
        if (Number(isKeep) === 0) ctx.session.maxAge = 0;
        // 这里在登陆的时候就传回数据，以减少请求
        ctx.success({ msg: '登录成功', data: result });
    }

    static async logout(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });

        // 移除 Cookies
        ctx.removeCookies();
        return ctx.success({ msg: '登出成功' });
    }

    static async getUser(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });

        const result = await UserModel.findOne({ _id: ctx.session.userId }, { password: 0 })
        if (!result) return ctx.error({ msg: '未知问题' });
        ctx.success({ msg: '查询成功', data: result });
    }

    static async patchUser(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });

        const _id = ctx.params._id
        if (!_id) return ctx.error({ msg: '数据发送失败' })

        const { profile, avatar } = ctx.request.body
        if (profile) {
            await UserModel.findOneAndUpdate({ _id }, { $set: { profile } })
            ctx.success({ msg: '修改成功' });
        } else if (avatar) {
            await UserModel.findOneAndUpdate({ _id }, { $set: { avatar } })
            ctx.success({ msg: '修改成功' });
        } else {
            return ctx.error({ msg: '没有修改的东西' })
        }
    }

    static async getSpecialUser(ctx) {
        const _id = ctx.params._id
        if (!_id) return ctx.error({ msg: '数据发送失败' });
        const article = await ArticleModel.find({ authorId: _id }, {  lastCommentAt: 0, changedBy: 0 }).sort({ createdAt: '-1' }).limit(10).populate('authorId', { name: 1, avatar: 1 }).lean();
        for (const value of article) {
            value.images = await ImageModel.find({ articleId: value._id }, { url: 1, path: 1, _id: 0, location: 1 }).lean({ virtuals: true })
            value.videos = await VideoModel.find({ articleId: value._id },{ url: 1, path:1 , _id:0, location: 1}).lean({ virtuals: true })
        }
        const user = await UserModel.findOne({ _id }, { password: 0 }).lean()
        user.isMe = ctx.session.userId === String(user._id) ? 1 : 0
        return ctx.success({ data: { user, article } });
    }

    static async getSpecialUserFavorite(ctx) {
        const _id = ctx.params._id
        if (!_id) return ctx.error({ msg: '数据发送失败' });
        const favorite = await FavoriteModel.find({ authorId: _id }, { articleId: 1 }).populate('articleId', {  lastCommentAt: 0, changedBy: 0 }).lean()
        const article = []
        for (const value of favorite) {
            const user = await UserModel.findOne({ _id: value.articleId.authorId }, { name: 1, avatar: 1 })
            value.articleId.authorId = user
            value.articleId.images = await ImageModel.find({ articleId: value.articleId._id }, { url: 1, path: 1, _id: 0, location: 1 }).lean({ virtuals: true })
            value.articleId.videos = await VideoModel.find({ articleId: value.articleId._id },{ url: 1, path:1 , _id:0, location: 1}).lean({ virtuals: true })
            article.push(value.articleId)
        }
        return ctx.success({ data: article });
    }

    static async starUser(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        const _id = ctx.params._id
        if (!_id) return ctx.error({ msg: '数据发送失败' })
        const starUser = await UserModel.findOne({ _id })
        if (!starUser) return ctx.error({ msg: '获取详情数据失败!' })
        const nowStar = await StarModel.findOne({ authorId: ctx.session.userId, starUserId: _id })
        if (String(_id) === String(ctx.session.userId)) return ctx.error({ msg: '你不能关注你自己' }) // js 不知道数据类型比较头疼
        if (nowStar) {
            await StarModel.deleteOne({ authorId: ctx.session.userId, starUserId: _id })
            await UserModel.findOneAndUpdate({ _id }, { $inc: { starMeNum: -1 } }) // 粉丝数减一
            await UserModel.findOneAndUpdate({ _id: ctx.session.userId }, { $inc: { starOtherNum: -1 } }) // 我关注的用户减一
            return ctx.success({ msg: '取消关注成功' })
        } else {
            await StarModel.create({ authorId: ctx.session.userId, starUserId: _id })
            await UserModel.findOneAndUpdate({ _id }, { $inc: { starMeNum: 1 } }) // 粉丝数加一
            await UserModel.findOneAndUpdate({ _id: ctx.session.userId }, { $inc: { starOtherNum: 1 } }) // 我关注的用户加一
            return ctx.success({ msg: '关注成功' })
        }
    }
}

export default UserController;