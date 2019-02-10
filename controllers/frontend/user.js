import UserModel from '../../models/user/user';
import md5 from 'md5';
import { user as userConfig } from '../../config/common'

class UserController {

    static async register(ctx) {
        if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了', code: 40009 });

        const { email, name, password } = ctx.request.body;

        // 为什么不在前端验证，因为接口是开放的，这样就可以注册空用户名了
        if (!name || !password || !email) return ctx.error({ msg: '提交的信息不能为空不能为空', code: 40005 });
        if (!userConfig.namePattern.test(name)) return ctx.error({ msg: '用户名必须大于4个字符小于16个字符', code: 40007 });
        if (!userConfig.passwordPattern.test(password)) return ctx.error({ msg: '密码必须分别包含2个大小写字母,并且大于6个字符小于16个字符', code: 40008 });
        if (!userConfig.emailPattern.test(email)) return ctx.error({ msg: '请输入正确的邮箱地址', code: 40009 });

        const isExit = await UserModel.findOne({ email });
        if (isExit) return ctx.error({ msg: '邮箱已存在', code: 40005 });

        const result = await UserModel.create({ email, name, password: md5(password) });
        if (!result) {
            return ctx.error({ msg: '注册失败', code: 60002 });
        } else {
            ctx.setCookies(md5(result._id));
            return ctx.success({ msg: '注册成功' });
        }
    }

    static async login(ctx) {
        if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了', code: 40009 });

        const { info, password } = ctx.request.body;
        if (!info || !password) return ctx.error({ msg: '提交的信息不能为空不能为空', code: 40005 });
        // 仅检查密码
        if (!userConfig.passwordPattern.test(password)) return ctx.error({ msg: '密码必须分别包含2个大小写字母,并且大于6个字符小于16个字符', code: 40008 });
        // 块级作用域
        let result;
        // 如果符合 邮箱规则
        if (userConfig.emailPattern.test(info)) {
            // 已通过 if 来检查了
            result = await UserModel.findOne({ email: info, password: md5(password) }, { password: 0 });
        } else {
            if (!userConfig.namePattern.test(info)) return ctx.error({ msg: '用户名必须大于4个字符小于16个字符', code: 40007 });
            result = await UserModel.findOne({ name: info, password: md5(password) }, { password: 0 });
        }
        if (!result) return ctx.error({ msg: '登陆信息错误', code: 40006 });
        // 种下 Cookies
        ctx.setCookies(md5(result._id));
        // 这里在登陆的时候就传回数据，以减少请求
        ctx.success({ msg: '登录成功', data: result });
    }

    static async logout(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆', code: 40006 });

        // 移除 Cookies
        ctx.removeCookies();
        return ctx.success({ msg: '登出成功' });
    }

    static async getUser(ctx) {
        
    }
}

export default UserController;