import passport from 'koa-passport';
import LoaclStrategy from 'passport-local';
import UserModel from '../models/user/user';

passport.use(new LoaclStrategy(async (username, password, done) => {
    const result = await UserModel.findOne({ username });
    if( !result ) {
        if ( result.password === password ) {
            return done(null, result);
        } else {
            return done(null, false, '密码错误');
        }
    } else {
        return done(null, false, '用户不存在');
    }
}))

passport.serializeUser( (user, done) => {
    done(null, user);
} )

passport.deserializeUser( (user, done) => {
    done(null, user);
} )

export default passport;