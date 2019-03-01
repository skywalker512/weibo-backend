// 代码参考于 https://www.jianshu.com/p/a9c0b277a3b3

import { weibo as weiboConfig } from '../../config/oauth'
import fetch from 'node-fetch'
import UserModel from '../../models/user/user'
import md5 from 'md5'

export default class {
    static redirectToWeibo(ctx) {
        // if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了' });
        //重定向到认证接口,并配置参数
        const path = `https://api.weibo.com/oauth2/authorize?client_id=${weiboConfig.ak}&redirect_uri=${process.env.APP_DOMAIN}/api/oauth/weibo/callback`
        //转发到授权服务器
        ctx.redirect(path);
    }

    static async callback(ctx) {
        const code = ctx.query.code
        if (!code) return ctx.error({ msg: '返回信息不完整' })

        const params = {
            client_id: weiboConfig.ak,
            client_secret: weiboConfig.sk,
            grant_type: 'authorization_code',
            code,
            redirect_uri: `${process.env.APP_DOMAIN}/api/oauth/weibo/callback`
        }
        // 微博不支持 json ？？？
        const data = Object.keys(params).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');

        const body  = await fetch('https://api.weibo.com/oauth2/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        }).then(res => { return res.json() })
        console.log(body)
        // https://stackoverflow.com/questions/46421645/unable-to-fetch-an-email-in-weibo
        // 微博不支持 email 竟然文档也不更新一下
        const userInfo = await fetch(`https://api.weibo.com/2/users/show.json?access_token=${body.access_token}&uid=${body.uid}`).then(res=> {return res.json()})
        if (!userInfo.idstr) return ctx.error({ msg: '数据获取失败' });
        // 因为 weibo 的接口里面没有一个是可以长久作为用户标记的，所以直接用用户名
        let result = await UserModel.findOne({ email: `${userInfo.idstr}@weibo` }, { password: 0, phone: 0 })
        if (!result) {
            const save = await UserModel.create({ email: `${userInfo.idstr}@weibo`, name: userInfo.screen_name, password: md5(userInfo.idstr+process.env.APP_SECRET), avatar: userInfo.avatar_hd });
            result = await UserModel.findOne({ _id: save._id }, { password: 0, phone: 0 })
        }
        ctx.setCookies(result._id, result.group)
        ctx.body = `<script>window.close();</script>`
    }
}