import UserModel from '../../models/user/user';
import md5 from 'md5';
import { user as userConfig } from '../../config/common'

class UserController {

    static async register(ctx) {
        if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了' });

        const { email, name, password } = ctx.request.body;

        // 为什么不在前端验证，因为接口是开放的，这样就可以注册空用户名了
        if (!name || !password || !email) return ctx.error({ msg: '提交的信息不能为空不能为空' });
        if (!userConfig.namePattern.test(name)) return ctx.error({ msg: '用户名必须大于4个字符小于16个字符' });
        if (!userConfig.passwordPattern.test(password)) return ctx.error({ msg: '密码必须分别包含2个大小写字母,并且大于6个字符小于16个字符' });
        if (!userConfig.emailPattern.test(email)) return ctx.error({ msg: '请输入正确的邮箱地址' });

        const isExitEmail = await UserModel.findOne({ email });
        if (isExitEmail) return ctx.error({ msg: '邮箱已存在' });

        const isExitName = await UserModel.findOne({ name })
        if(isExitName) return ctx.error({ msg: '用户名已存在' });
        const avatar = userConfig.gavatar + md5(email) + userConfig.gavaterOption;
        const result = await UserModel.create({ email, name, password: md5(password), avatar });
        if (!result) {
            return ctx.error({ msg: '注册失败' });
        } else {
            ctx.setCookies( result._id, result.group );
            return ctx.success({ msg: '注册成功' });
        }
    }

    static async login(ctx) {
        if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了' });

        const { info, password } = ctx.request.body;
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

        const result = await UserModel.findOne( {_id: ctx.session.userId}, { password: 0 } )
        if (!result) return ctx.error({ msg: '未知问题' });
        ctx.success({ msg: '查询成功', data: result });
    }
}

export default UserController;