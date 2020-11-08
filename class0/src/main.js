//顶点着色器程序
import img1 from './1.png';
var VSHADER_SOURCE =
    'attribute vec4 a_Position;' +
    'attribute vec2 a_TexCoord;' +
    'varying vec2 v_TexCoord;' +
    'void main(){' +
    'gl_Position = a_Position;' +
    'v_TexCoord = a_TexCoord;' +
    '}';

//片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;' +
    'varying vec2 v_TexCoord;' +
    'void main(){' +
    'gl_FragColor = texture2D(u_Sampler, v_TexCoord);' +
    '}';
var program;
function main() {
    //获取canvas元素
    var canvas = document.getElementById("webgl");
    if (!canvas) {
        console.log("Failed to retrieve the <canvas> element");
        return;
    }

    //获取WebGL绘图上下文
    var gl = canvas.getContext('webgl')
    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    //初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    //设置顶点位置
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    //指定清空<canvas>颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //配置纹理
    if (!initTextures(gl, n)) {
        console.log('Failed to intialize the texture.');
        return;
    }
}
function initShaders(gl,vshader,fshader) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);// 创建顶点着色器
    gl.shaderSource(vertexShader, vshader);// 绑定顶点着色器源码
    gl.compileShader(vertexShader);// 编译定点着色器
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);// 创建片段着色器
    gl.shaderSource(fragmentShader, fshader);// 绑定片段着色器源码
    gl.compileShader(fragmentShader);// 编译片段着色器
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var shaderProgram = program = gl.createProgram();// 创建着色器程序
    gl.attachShader(shaderProgram, vertexShader);// 指定顶点着色器
    gl.attachShader(shaderProgram, fragmentShader);// 指定片段着色色器
    gl.linkProgram(shaderProgram);// 链接程序
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(program);
        throw "Could not compile WebGL program. \n\n" + info;
    }
    console.log('1111111')
    gl.useProgram(shaderProgram);//使用着色器
    return true
}
function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        //顶点坐标，纹理坐标
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
    var n = 4; //点的个数

    //创建缓冲区对象
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log("Failed to create thie buffer object");
        return -1;
    }

    //将缓冲区对象保存到目标上
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);

    //向缓存对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    console.log(gl.program)
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }

    //将缓冲区对象分配给a_Postion变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);

    //连接a_Postion变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    //将纹理坐标分配给 a_TexCoord 并开启它
    var a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    if (a_TexCoord < 0) {
        console.log("Failed to get the storage location of a_TexCoord");
        return -1;
    }

    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);

    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl, n) {
    var texture = gl.createTexture();  //创建纹理对象
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    //获取 u_Sampler的存储位置
    var u_Sampler = gl.getUniformLocation(program, "u_Sampler");
    if (!u_Sampler) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }

    var image = new Image();  //创建一个image 对象
    if (!image) {
        console.log('Failed to create the image object');
        return false;
    }
    //注册图像加载事件的响应函数
    image.onload = function () {
        loadTexture(gl, texture, u_Sampler, image);
    }
    //浏览器开始加载图像
    image.src = './static/1.png';

    return true;
}

function loadTexture(gl,texture, u_Sampler, image) {
    console.log('llllllllllllll')
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  //对纹理图像进行Y轴反转
    //开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //向 target 绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE_SHORT_5_5_5_1, image);

    //将0号纹理传递给着色器
    console.log(u_Sampler)
    gl.uniform1i(u_Sampler, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // Draw the rectangle

}
main();