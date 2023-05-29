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


//4、创建立方体
// //BoxGeometry立方体——这个对象包含立方体中所有的顶点(vertices)和面（faces）
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// //设置材质/颜色
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// //网格：包含一个几何体和作用在此几何体上的材质，可以直接把网格放入场景在场景中自然移动
// const cube = new THREE.Mesh(geometry, material)

// // //修改物体位置 
// // cube.position.x = 3
// // //设置物体缩放
// // cube.scale.set(3, 2, 1)
// // //设置旋转 最后一个设置旋转值
// // cube.rotation.set(4, 0, 0, "XYZ")
// scene.add(cube)//添加cube到场景中

// camera.position.z = 5

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
// renderer.render(scene, camera)



//5、创建轨道控制器——使相机围绕着目标进行轨道运动
//附加组件，必须显示引入
//默认目标是原点
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
const controls = new OrbitControls(camera, renderer.domElement)

// //每一帧根据控制器更新画面
// function render () {
//   //如果后期需要控制器带有自动旋转等效果，就要加入controls.update()
//   controls.update()
//   renderer.render(scene, camera)
//   //渲染下一帧的时候就会调用render函数
//   //requestAnimationFrame浏览器为动画准备的API，
//   //如果页面不是激活状态下动画自动暂停
//   requestAnimationFrame(render)
// }
// render()


//6控制物体移动
//通过每一帧修改一点位置形成动画的方式
//渲染场景——渲染循环render loop或者动画循环animate loop
// function animate (time) {

//   //让立方体动起来
//   //这段代码每帧都会执行（正常情况下是60次/秒）
//   cube.rotation.x += 0.01
//   cube.rotation.y += 0.01
//   //requestAnimationFrame的优点当用户切换到其它的标签页时，它会暂停
//   //告诉浏览器——你希望执行一个动画，
//   //并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
//   //该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
//   //具体回调函数执行的间隔时间跟屏幕刷新次数、当前页面运行时负荷等因素有关

//   requestAnimationFrame(animate)
//   //如何实现每一帧的变化是一样的 速度*时间匀速运动
//   //time是回调函数被传入的DOMHighResTimeStamp参数，指示当前被排序的回调函数被触发的时间

//   let t = time / 1000
//   cube.position.x = t * 1
//   cube.position.y = t * 1


//   //渲染下一帧就会调用render函数
//   renderer.render(scene, camera)
// }
// animate(1000)

//7、坐标轴辅助器
//红色代表x轴、绿色代表Y轴、蓝色代表Z轴
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

//8、ArrowHelper箭头辅助器
//模拟方向的三维箭头
const dir = new THREE.Vector3(1, 2, 0)
dir.normalize()

//8、threejs物体缩放与旋转
//缩放scale属性是vector3对象，默认值是Vector3(1,1,1)
// cube.scale.set(3, 2, 1)
// cube.scale.x = 3
// //rotation:Euler
// //直接设置旋转属性，例如围绕x轴旋转90度
// cube.rotation.x = Math.PI / 2
// //order表示旋转顺序的字符串
// cube.rotation.set(-Math.PI / 4, 0, 0, "XZY")



//10、设置时钟
//clock用来跟踪时间
//new THREE.Clock中可传参autostart是否第一次就调用
//getDelta来自动开启时钟，默认true
const clock = new THREE.Clock()
function render1 () {
  //获得时钟运行的总时长
  let time = clock.getElapsedTime()
  //getDelta () 获取2帧之间的时间间隔
  //他两不能同时用，因为都会对oldTime属性重置，会导致不准
  let time1 = clock.getDelta()
  renderer.render(scene, camera)
  requestAnimationFrame(render1)
}
render1()

//11、Gsap动画库的使用
//https://www.bilibili.com/read/cv17889719/?from=readlist
//先npm install gsap
import gsap from 'gsap'
//html中写".box"来设置类元素
//threejs中写cube.postion
//一秒内水平移动200px
// gsap.to(cube.position, {
//   x: 5,
// })
// //设置旋转写cube.rotation
// var animate1 = gsap.to(cube.rotation, {
//   x: 2 * Math.PI,
//   duration: 5,
//   ease: "power1.inOut",
//   //设置重复的次数，无限循环-1
//   repeat: -1,
//   //往返运动
//   yoyo: true,
//   //延迟2秒
//   delay: 2,
//   //当动画完成执行的回调
//   onComplete: () => {
//     console.log(1)
//   },
//   //当动画开始时执行回调
//   onStart: () => {
//     console.log('2')
//   }
// })
//双击画面暂停或回复动画
// window.addEventListener("dblclick", () => {
//   if (animate1.isActive()) {
//     //暂停
//     animate1.pause()
//   } else {
//     //恢复
//     animate1.resume()
//   }
// })

//12、自适应屏幕大小
//监听画面变化更新渲染画面
window.addEventListener("resize", () => {
  //更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  //更新摄像机的投影矩阵
  camera.updateProjectionMatrix()
  //更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)

  //设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio)
})

//13、控制场景全屏
//双击实现全屏效果
window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullScreenElement
  if (!fullScreenElement) {
    //如果没有全屏就双击进入
    renderer.domElement.requestFullscreen()
  } else {
    //退出全屏
    document.exitFullscreen()
  }
})

//一定会有的正确调用render函数的方式

function render2 () {
  renderer.render(scene, camera)
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render2)
}

render2()

//14应用图形用户界面改变变量
//npm install --save dat.gui
import * as dat from 'dat.gui'
const gui = new dat.GUI()
//对数值的操作
// gui
//   .add(cube.position, "x")
//   .min(0)
//   .max(5)
//   .step(0.1)
//   .name("移动x轴")
//   .onChange((value) => {
//     console.log("值被修改了")
//   })
//   .onFinishChange((value) => {
//     console.log("完全停下", value)
//   })

//修改物体的颜色
// const params = {
//   color: "#ffff00",
//   fn: () => {
//     //设置立方体永久运动
//     gsap.to(cube.position, { x: 4, yoyo: true, repeat: -1 })
//   }
// }
// gui.addColor(params, "color").onChange((value) => {
//   console.log(1)
//   //在change里面修改
//   cube.material.color.set(value)
// })
// //显示设置
// gui.add(cube, "visible").name('是否显示')
// //设置按钮点击触发某个事件
// gui.add(params, 'fn')
// //设置一个文件夹
// var folder = gui.addFolder("设置立方体")
// folder.add(cube.material, "wireframe")//设置线框

//15、用点的方式创建几何体
//position 
// count:点重合，六个面一个面四个点——24个点
// array：每个点对应的xyz
//uv

//使用bufferGeometry创建一个矩形
//用的是两个三角形面片去合成，所以左上和右下的顶点会被复制两次
const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([
  -1.0, -1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0, 1.0, 1.0,
  -1.0, 1.0, 1.0,
  -1.0, -1.0, 1.0,
])
//最后一个数字用来区分几个数字为一组合成一个点
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const material = new THREE.MeshBasicMaterial({ color: 0xfff00 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)