const projectName='.';
const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
module.exports = {
    resolve: {
        // 设置别名
        alias: {
            '@': resolve('./src'),// 这样配置后 @ 可以指向 src 目录
            '@assets': resolve('./src/assets'),// 这样配置后 @ 可以指向 src 目录
            '@images': resolve('./src/assets/images')// 这样配置后 @ 可以指向 src 目录
        }
    },
    
}
// exports.ali={
//     resolve: {
//         // 设置别名
//         alias: {
//             '@': resolve(projectName+'/src'),// 这样配置后 @ 可以指向 src 目录
//             '@assets': resolve(projectName+'/src/assets'),// 这样配置后 @ 可以指向 src 目录
//             '@images': resolve(projectName+'/src/assets/images')// 这样配置后 @ 可以指向 src 目录
//         }
//     }
// }