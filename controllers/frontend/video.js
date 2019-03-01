import VideoModel from '../../models/article/video'

class VideoController {
    static async createVideo(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        const data = ctx.request.body;
        if (!(Object.keys(data).length > 2)) return ctx.error({ msg: '数据发送失败' });

        data.authorId = ctx.session.userId;

        const result = await VideoModel.create(data)
        return ctx.success({ msg: '视频信息储存成功', data: result._id })
    }
}

export default VideoController