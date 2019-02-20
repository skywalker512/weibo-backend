const { env } = process;

const upyun = {
    bucket: env.UPYUN_BUCKET,
    operator: env.UPYUN_OPERATOR,
    password: env.UPYUN_PASSWORD,
}

export default upyun