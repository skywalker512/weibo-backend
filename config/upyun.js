const { env } = process;

const upyun = {
    bucket: env.UPYUN_BUCKET,
    operator: env.UPYUN_OPERATOR,
    password: env.UPYUN_PASSWORD,
    contentLengthRange: '1024,12582912',
    url: env.UPYUN_URL,
}

export default upyun