const { env } = process;

const github = {
    client_id: String(env.GITHUB_CLIENT_ID),
    client_secret: String(env.GITHUB_CLIENT_SECRET),
    scope: ['user'], // 这里可以选择获取什么信息，鉴于黑客派事件，能少获取就少获取
}

export { github }