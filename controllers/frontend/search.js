import ArticleModel from '../../models/article/article'
import ImageModel from '../../models/article/image'
import VideoModel from '../../models/article/video'

class searchController {
    static async SearchArticle(ctx) {
        const {data} = ctx.params;
        if (!data) return ctx.error({ msg: '数据发送失败' });
        let { per_page, page } = ctx.query;
        if (!page) page = 1;
        if (!per_page) per_page = 10;
        const skip = (page - 1) * per_page; // 第一页 从 0 开始
        const articles = await ArticleModel.find({content: {$regex: data, $options: '$i'}}).sort({ createdAt: '-1' }).skip(skip).limit(Number(per_page)).populate('authorId', { name: 1, avatar: 1 }).populate('categoryId', { name: 1 }).lean()
        for(const value of articles) {
            value.images =  await ImageModel.find({ articleId: value._id },{ url: 1, path:1 , _id:0, location: 1}).lean({ virtuals: true })
            value.videos = await VideoModel.find({ articleId: value._id },{ url: 1, path:1 , _id:0, location: 1}).lean({ virtuals: true })
        }
        return ctx.success({ data: articles })
    }
}

export default searchController