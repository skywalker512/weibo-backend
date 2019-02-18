import Geetest from 'gt3-sdk'

import config from '../../config/geetest'

class GeetestClient {
    constructor (config) {
        this.client = new Geetest(config)
    }

    async register(params) {
        const data = await this.client.register(params)
        return data
    }

    async validate(fallback, params) {
        const success = await this.client.validate(fallback, params)
        return success
    }
}

const client = new GeetestClient(config)

export default class {
    static async register(ctx) {
        const result = await client.register()
        if(result.success === 0) {
            ctx.session.isFallback = true;
        }
        
        ctx.body = result
    }

    static async validate(ctx) {
        const { geetest_challenge, geetest_validate, geetest_seccode } = ctx.request.body;
        const is_fallback = ctx.session.isFallback ? true : false;

        const is_pass = await client.validate(is_fallback, {
            geetest_challenge,
            geetest_validate,
            geetest_seccode,
        });
        ctx.session.isPass = is_pass ? true : false
        ctx.body = { is_pass };
    }
}