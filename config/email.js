const { env } = process;

const email = {
    
    smtp: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secureConnection: true,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
        }
    },
    get code() { // 为什么要嵌套一个 return? 因为在后面调用的时候能让人明白这是动态生成的
        return () => {
            return Math.random().toString(10).slice(2, 8).toUpperCase()
        }
    },
    get expire() {
        return () => {
            return new Date().getTime() + 60 * 60 * 1000
        }
    },
    get mailOption() {
        return (code, to) => {
            return {
                from: `${env.SMTP_FROM}<${env.SMTP_USER}>`,
                to,
                subject: `[${env.APP_NAME}] 注册确认码`,
                html: `Hey! <br><br>有人想在 ${env.APP_NAME} 进行注册。(但愿是你)<br><br>如果确定是你的操作，只需输入下面的验证码即可。<br><br><b>${code}</b><br><br>如果不是你，请忽略。`
            }
        }
    }
}

export default email