import ImageModel from '../../models/article/image'

class ImageController {
    static async createImage(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        const data = ctx.request.body;
        if (!(Object.keys(data).length > 3)) return ctx.error({ msg: '数据发送失败' });

        data.authorId = ctx.session.userId;

        const result = await ImageModel.create(data)
        return ctx.success({ msg: '图片信息储存成功', data: result._id })
    }
}

export default ImageController