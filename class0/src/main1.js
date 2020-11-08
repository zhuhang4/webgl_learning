import {Monitor} from 'gl-perf';
//通过buffer赋值

var vshader=`
    attribute vec4 a_Position;
    void main()
    {
        gl_Position=a_Position;
        gl_PointSize=10.0;
    }
`
var fshader=`
    void main()
    {
        gl_FragColor=vec4(1.0,0.0,0.0,1.0);
    }
`

var canvas=document.getElementById('webgl')
var gl=canvas.getContext('webgl');
var program;
var vertices=new Float32Array([
    -0.5,0.5,-0.5,0.0,0.0,0.5
])


initShader(gl);
gl.clearColor(0,0,0,1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.POINTS,0,1);

usebuffer();

function initShader(gl) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);// 创建顶点着色器
    gl.shaderSource(vertexShader, vshader);// 绑定顶点着色器源码
    gl.compileShader(vertexShader);// 编译定点着色器

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);// 创建片段着色器
    gl.shaderSource(fragmentShader, fshader);// 绑定片段着色器源码
    gl.compileShader(fragmentShader);// 编译片段着色器

    var shaderProgram =program= gl.createProgram();// 创建着色器程序
    gl.attachShader(shaderProgram, vertexShader);// 指定顶点着色器
    gl.attachShader(shaderProgram, fragmentShader);// 指定片段着色色器
    gl.linkProgram(shaderProgram);// 链接程序
    gl.useProgram(shaderProgram);//使用着色器
}
function usebuffer()
{
    
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_pos,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_pos);

    // gl.clearColor(0.0,0.0,0.0,1);
    draw();
}
function draw()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,3);
}


var a_pos=gl.getAttribLocation(program,"a_Position");
canvas.addEventListener('mousedown',(e)=>
{
    let x=(e.clientX*2-200)/200;
    let y=-(e.clientY*2-200)/200;
    console.log(x,y)
    

    gl.vertexAttrib4f(a_pos,x,y,1.0,1.0);
    gl.clearColor(0,0,0,1);
    gl.drawArrays(gl.POINTS,0,1);
});

var m=new Monitor(canvas);
setInterval(function(){
    draw();
    m.update()
});