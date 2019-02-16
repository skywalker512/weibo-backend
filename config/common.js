const config = {
    development: {
        mongo: {
            uri: 'mongodb://localhost:27017/weibotest' // uri? 统一资源标识符
        }
    }
}

const user = {
    // 一对斜杠（/）之间的字符 -> 字符表达式
    // 字符类 \w 匹配任何ASCII字符组成的单词，等价于[a-zA-Z0-9]
    // 在正则表达式中用{ }来表示元素重复出现的次数
    namePattern: /^[\w_-]{6,16}$/,

    // .* 表示任意位置
    // 在符号“(?=” 和 “)” 之间加入一个表达式，它就是一个先行断言，用以说明圆括号内的表达式必须正确匹配\
    // (?=.*[!@#$%^&*?\(\)]) 特殊字符
    passwordPattern: /^.*(?=.{4,16})(?=.*\d)(?=.*[A-Z]{2,})(?=.*[a-z]{2,}).*$/,

    emailPattern: /^.*(?=.{1,30})(?=.*[@]).*$/,

    gavatar: 'https://cdn.v2ex.com/gravatar/',
    gavaterOption: '?d=retro&s=64',
}

const url = {
    smms: 'https://i.loli.net'
}

export { config, user, url }