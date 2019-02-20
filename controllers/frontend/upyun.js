import upyun from 'upyun'

import upyunConfig from '../../config/upyun'

const bucket = new upyun.Bucket(upyunConfig.bucket, upyunConfig.operator, upyunConfig.password)

export default class {
    static getHeaderSign(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        let params = {}
        params['save-key'] =  ctx.query.path || '/all/{year}/{mon}/{day}/{hour}_{min}_{sec}_{filename}{.suffix}'
        params['content-length-range'] = upyunConfig.contentLengthRange
        const headSign = upyun.sign.getPolicyAndAuthorization(bucket, params)
        ctx.success({ data: {headSign, bucket: upyunConfig.bucket, url: upyunConfig.url} })
    }
}