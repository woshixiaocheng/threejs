// 方式 1: 导入整个 three.js核心库
import * as THREE from "three"

//1、创建场景
const scene = new THREE.Scene()

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
)
//设置相机位置
camera.position.set(0, 0, 10)
//添加相机
scene.add(camera)

//3、渲染器
//除了我们在这里用到的WebGLRenderer渲染器之外，
//Three.js同时提供了其他几种渲染器，
//当用户所使用的浏览器过于老旧，或者由于其他原因不支持WebGL时，
//可以使用这几种渲染器进行降级。
const renderer = new THREE.WebGLRenderer()
//设置渲染器尺寸可以把浏览器窗口设为，如果对性能比较敏感可以传一半
renderer.setSize(window.innerWidth, window.innerHeight)
//显示给场景的是canvas元素
document.body.appendChild(renderer.domElement)
//使用渲染器，通过相机把场景渲染进来——将画面渲染到canvas上
renderer.render(scene, camera)


//4、创建立方体
//BoxGeometry立方体——这个对象包含立方体中所有的顶点(vertices)和面（faces）
const geometry = new THREE.BoxGeometry(1, 1, 1)
//设置材质/颜色
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
//网格：包含一个几何体和作用在此几何体上的材质，可以直接把网格放入场景在场景中自然移动
const cube = new THREE.Mesh(geometry, material)

//修改物体位置 
cube.position.x = 3
//设置物体缩放
cube.scale.set(3, 2, 1)
//设置旋转 最后一个设置旋转值
cube.rotation.set(4, 0, 0, "XYZ")
scene.add(cube)//添加cube到场景中

// camera.position.z = 5

//5、创建轨道控制器——使相机围绕着目标进行轨道运动
//附加组件，必须显示引入
//默认目标是原点
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
const controls = new OrbitControls(camera, renderer.domElement)

//每一帧根据控制器更新画面
function render () {
  //如果后期需要控制器带有自动旋转等效果，就要加入controls.update()
  controls.update()
  renderer.render(scene, camera)
  //渲染下一帧的时候就会调用render函数
  //requestAnimationFrame浏览器为动画准备的API，
  //如果页面不是激活状态下动画自动暂停
  requestAnimationFrame(render)
}
render()


//6控制物体移动
//通过每一帧修改一点位置形成动画的方式
//渲染场景——渲染循环render loop或者动画循环animate loop
function animate (time) {

  //让立方体动起来
  //这段代码每帧都会执行（正常情况下是60次/秒）
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  //requestAnimationFrame的优点当用户切换到其它的标签页时，它会暂停
  requestAnimationFrame(animate)
  //如何实现每一帧的变化是一样的
  // let t = time / 1000
  // cube.position.x = t * 1
  // cube.position.y = t * 1


  //渲染下一帧就会调用render函数
  renderer.render(scene, camera)
}
animate(1000)

//7、坐标轴辅助器
//红色代表x轴、绿色代表Y轴、蓝色代表Z轴
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

//8、ArrowHelper箭头辅助器
//模拟方向的三维箭头
const dir = new THREE.Vector3(1, 2, 0)
dir.normalize()

// //设置时钟
// const clock = new THREE.Clock()
// function render () {
//   //获得时钟运行的总时长
//   let time = clock.getElapsedTime()
//   //
//   renderer.render(scene, camera)
//   requestAnimationFrame(render)
// }
// render()