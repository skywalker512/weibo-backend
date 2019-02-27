const { env } = process;

const sms = {
    appid: Number(env.SMS_APPID),
    appkey: String(env.SMS_APPKEY),
    templateId: Number(env.SMS_TEMPLATEID),
    smsSign: String(env.SMS_SIGN),
}

export default sms