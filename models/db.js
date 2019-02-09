import mongoose from 'mongoose';
import config from '../config/common';

const dbConfig = config.development; // 环境配置

mongoose.connect(dbConfig.mongo.uri, { useNewUrlParser: true });


// 连接成功 
mongoose.connection.on('connected', () => {
    console.log('Mongoose connection open to ' + dbConfig.mongo.uri);
});

// 连接失败
mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
});

// 断开连接
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected');
});