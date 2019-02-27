import fetch from 'node-fetch'
import hex from 'crypto-js/enc-hex'
import sha256 from 'crypto-js/sha256'
import smsConfig from '../../config/sms'

function getRandom() {
    return Math.round(Math.random() * 99);
}

function getCurrentTime() {
    return Math.floor(Date.now() / 1000);
}

function calculateSignature(appkey, random, time, phone) {
    return hex.stringify(sha256(`appkey=${appkey}&random=${random}&time=${time}&mobile=${phone}`))
}

export default async function(params, phone) {
    const { appid, appkey, templateId, smsSign } = smsConfig
    const random = getRandom()
    const now = getCurrentTime()
    const sig = calculateSignature(appkey, random, now, phone)
    const options = {
        url: `https://yun.tim.qq.com/v5/tlssmssvr/sendsms?sdkappid=${appid}&random=${random}`,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            tel: {
                mobile: phone,
                nationcode: '86'
            },
            params,
            sig,
            sign: smsSign,
            tpl_id: templateId,
            time: now,
            ext: "",
            extend: "",
        }
    }
    const response = await fetch(options.url, { method: options.method, headers: options.headers, body: JSON.stringify(options.body) })
    const result = await response.json()
    return result
}