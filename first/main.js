// 方式 1: 导入整个 three.js核心库
import * as THREE from "three";

//1、创建场景
const scene = new THREE.Scene();

//2、透视相机
//第一个是视野角度，第二个是长宽比
//第三个是近截面，第四个是远截面
//当物体某些部分比摄像机的远截面远或者比近截面近的时候
//这部分就不会被渲染到场景中
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//3、渲染器
//除了我们在这里用到的WebGLRenderer渲染器之外，
//Three.js同时提供了其他几种渲染器，
//当用户所使用的浏览器过于老旧，或者由于其他原因不支持WebGL时，
//可以使用这几种渲染器进行降级。
const renderer = new THREE.WebGLRenderer();
//设置渲染器尺寸可以把浏览器窗口设为，如果对性能比较敏感可以传一半
renderer.setSize( window.innerWidth, window.innerHeight );
//显示给场景的是canvas元素
document.body.appendChild( renderer.domElement );


//4、创建立方体
//BoxGeometry立方体
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//设置材质/颜色
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//网格：包含一个几何体和作用在此几何体上的材质，可以直接把网格放入场景在场景中自然移动
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

//5、创建轨道控制器——使相机围绕着目标进行轨道运动
//附加组件，必须显示引入
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const controls = new OrbitControls( camera, renderer.domElement );

//渲染场景——渲染循环render loop或者动画循环animate loop
function animate() {
    //requestAnimationFrame的优点当用户切换到其它的标签页时，它会暂停
	requestAnimationFrame( animate );
    //让立方体动起来
    //这段代码每帧都会执行（正常情况下是60次/秒）
    cube.rotation.x += 0.01;
cube.rotation.y += 0.01;
//渲染下一帧就会调用render函数
	renderer.render( scene, camera );
}
animate();
