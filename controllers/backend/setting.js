import LinkModel from '../../models/setting/link';

class SettingController {
    static async createLink(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        if (!ctx.isAdmin()) return ctx.error({ msg: '您没有权限访问' });

        const data = ctx.request.body;
        if (!(Object.keys(data).length === 2)) return ctx.error({ msg: '数据发送失败' });

        const result = await LinkModel.create(data);
        if (!result) return ctx.error({ msg: '连接创建失败' });
        return ctx.success({ msg: '创建成功', data: result });
    }
}

export default SettingController;