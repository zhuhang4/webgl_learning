//添加颜色、了解varing的内插过程、varying中的float、int、sampler2d需要设置精度
import { Monitor } from 'gl-perf';
import img1 from './1.jpg';
var vshader = `
// precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_texcord;
    varying vec2 v_texcord;
    void main()
    {
        
        gl_Position=a_Position;
        v_texcord=a_texcord;
    }
`
var fshader = `
    precision mediump float;
    uniform sampler2D uSampler;
    varying vec2 v_texcord;
    
    void main()
    {
        gl_FragColor=texture2D(uSampler,v_texcord);
    }
`

var canvas = document.getElementById('webgl')



var gl = canvas.getContext('webgl');
var program;
var vertices = new Float32Array([
    -0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5, 1.0, 0.0
    
])


initShader(gl);
// gl.clearColor(0, 0, 0, 1);
// gl.clear(gl.COLOR_BUFFER_BIT);
// gl.drawArrays(gl.POINTS, 0, 1);
var a_pos = gl.getAttribLocation(program, "a_Position");
var a_texcord = gl.getAttribLocation(program, "a_texcord");
console.log(a_texcord)
useMuiltbuffer();
initTexture();
// draw();
function initShader(gl) {
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
    gl.useProgram(shaderProgram);//使用着色器
}
function useMuiltbuffer() {
    var FSIZE = vertices.BYTES_PER_ELEMENT;
    console.log(gl)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_pos);

    gl.vertexAttribPointer(a_texcord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_texcord);

    
}

function initTexture()
{
    var img=new Image();
    var texture=gl.createTexture();
    console.log(texture)
    var u_Sampler=gl.getUniformLocation(program,'uSampler');
    console.log(u_Sampler)

    img.onload=function()
    {
        console.log(img)

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  //对纹理图像进行Y轴反转
        //开启0号纹理单元
        gl.activeTexture(gl.TEXTURE0);
        //向 target 绑定纹理对象
        gl.bindTexture(gl.TEXTURE_2D, texture);
    
        //配置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //配置纹理图像
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

       
        gl.uniform1i(u_Sampler,0);

        draw();
        // setTimeout(()=>
        // {
        //     draw();
        // },2000)
    }
    console.log('img1',img1)
    img.src=img1;
    document.body.append(img)
}

function draw() {
    console.log('draw')
    // gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


// var m=new Monitor(canvas);
// setInterval(()=>
// {
//     draw();
//     m.update()
// },30);