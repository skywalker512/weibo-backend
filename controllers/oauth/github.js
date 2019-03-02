// 代码参考于 https://www.jianshu.com/p/a9c0b277a3b3

import { github as githubConfig } from '../../config/oauth'
import fetch from 'node-fetch'
import UserModel from '../../models/user/user'
import md5 from 'md5'

export default class {
    static redirectToGitHub(ctx) {
        if (ctx.isAuthenticated()) return ctx.error({ msg: '您已经登陆了' });
        //重定向到认证接口,并配置参数
        const path = `https://github.com/login/oauth/authorize?client_id=${githubConfig.client_id}&scope=${githubConfig.scope}`
        //转发到授权服务器
        ctx.redirect(path);
    }

    static async callback(ctx) {
        const code = ctx.query.code
        if (!code) return ctx.error({ msg: '返回信息不完整' })

        const params = {
            client_id: githubConfig.client_id,
            client_secret: githubConfig.client_secret,
            code
        }

        const body  = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then(res => { return res.text() })

        const args = body.split('&')
        const arg = args[0].split('=')
        const access_token = arg[1]
        let res = await fetch(`https://api.github.com/user?access_token=${access_token}`).then(res => { return res.json() })
        if (!res.login) return ctx.error({ msg: '数据获取失败' });
        let result = await UserModel.findOne({ email: res.email }, { password: 0, phone: 0 })
        if (!result) {
            const save = await UserModel.create({ email: res.email, name: res.login, password: md5(res.node_id+process.env.APP_SECRET), avatar: res.avatar_url });
            result = await UserModel.findOne({ _id: save._id }, { password: 0, phone: 0 })
        }
        ctx.setCookies(result._id, result.group)
        ctx.body = `<script>window.close();</script>`
    }
}