//添加颜色、了解varing的内插过程、varying中的float、int、sampler2d需要设置精度
import { Monitor } from 'gl-perf';

var vshader = `
// precision mediump float;
    attribute vec4 a_Position;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main()
    {
        v_color=a_color;
        gl_Position=a_Position;
    }
`
var fshader = `
    precision lowp float;
    varying vec4 v_color;
    void main()
    {
        gl_FragColor=v_color;
    }
`

var canvas = document.getElementById('webgl')



var gl = canvas.getContext('webgl');
var program;
var vertices = new Float32Array([
    -0.5, 0.5, 1.0, 0.0, 0.0,
    -0.5, 0.0, 0.0, 1.0, 0.0,
    0.0, 0.5, 0.0, 0.0, 1.0
])


initShader(gl);
// gl.clearColor(0, 0, 0, 1);
// gl.clear(gl.COLOR_BUFFER_BIT);
// gl.drawArrays(gl.POINTS, 0, 1);
var a_pos = gl.getAttribLocation(program, "a_Position");
var a_color = gl.getAttribLocation(program, "a_color");
useMuiltbuffer();

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
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_pos);

    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_color);

    draw();
}

function draw() {
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
}


// var m=new Monitor(canvas);
// setInterval(()=>
// {
//     draw();
//     m.update()
// },30);