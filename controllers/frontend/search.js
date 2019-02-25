import ArticleModel from '../../models/article/article'

class searchController {
    static async SearchArticle(ctx) {
        const {data} = ctx.params;
        const result = await ArticleModel.find({content: {$regex: data, $options: '$i'}}).limit(10)
        return ctx.success({ data: result })
    }
}

export default searchController