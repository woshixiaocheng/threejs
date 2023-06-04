import './style.css'
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
//导入水面
import { Water } from 'three/examples/jsm/objects/Water.js';
//导入gltf库
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'//解压的，因为模型导入前是压缩了的
//导入hdr要用的loader
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
//创建场景
const scene = new THREE.Scene()

//创建设置添加相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)

camera.position.set(-50,50,130)
//更新摄像头宽高比例
camera.aspect=window.innerWidth/window.innerHeight
//更新摄像头投影矩阵(任何修改都要调用)
camera.updateProjectionMatrix()
scene.add(camera)

//创建渲染器
const renderer=new THREE.WebGLRenderer({
  antialias:true,//设置抗锯齿
  //对数深度缓冲区-可以防止加载闪烁
  logarithmicDepthBuffer:true
})
//设置渲染器宽高
renderer.setSize(window.innerWidth,window.innerHeight)


//根据宽高比例修改渲染器的宽高和相机的比例
window.addEventListener('resize',()=>{
  camera.aspect=window.innerWidth/window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth,window.innerHeight)
})

//很重要！！把渲染器添加到页面上
document.body.appendChild(renderer.domElement)
//创建轨道控制器
const controls=new OrbitControls(camera,renderer.domElement)

//一定要调用的渲染场景的函数
function render(){
    renderer.render(scene,camera)
    requestAnimationFrame(render)
}
render()

//创建测试立方体
// const geometry=new THREE.BoxGeometry(1,1,1)
// const material=new THREE.MeshBasicMaterial({color:0x00ff00})
// const cube=new THREE.Mesh(geometry,material)
// cube.position.x=3
// scene.add(cube)

//创建巨大的天空球
const skyBoxGeometry=new THREE.SphereGeometry(1000,60,60)
skyBoxGeometry.scale(1,1,-1)//翻转内部面这样让贴图贴里面，这很重要！！
const skyBoxMaterial=new THREE.MeshBasicMaterial({
  map:new THREE.TextureLoader().load('./dist/textures/sky.jpg'),
})
const skyBox=new THREE.Mesh(skyBoxGeometry,skyBoxMaterial)
scene.add(skyBox)

//视频纹理——让天空动起来
const video=document.createElement('video')
video.src='./dist/textures/sky.mp4'
video.loop=true//循环播放

//当鼠标移动的时候再播放视频
window.addEventListener('click',()=>{
  //判断视频是否处于播放状态
  if(video.paused){
  video.play()
  skyBoxMaterial.map=new THREE.VideoTexture(video)
  skyBoxMaterial.needsUpdate=true//更新纹理
  }
})

//载入环境纹理hdr
const hdrLoader=new RGBELoader()
hdrLoader.loadAsync('./dist/textures/050.hdr').then((texture)=>{
  texture.mapping=THREE.EquirectangularReflectionMapping//设置映射
  scene.background=texture//设置背景
  scene.environment=texture//设置环境
})

//添加平行光
const light=new THREE.DirectionalLight(0xffffff,1)
light.position.set(-100,100,10)
scene.add(light)
//创建水面
const waterGeometry=new THREE.CircleBufferGeometry(300,64)
const water=new Water(
  waterGeometry,
  {
    textureHeight:1024,
    textureWidth:1024,
    color:0xeeeeff,
    flowDirection:new THREE.Vector2(1,1),//水面流动的方向
    scale:1
  }
)
water.position.y=3//让水面在地面上
water.rotation.x=-Math.PI/2//让水面水平

scene.add(water)


//添加小岛模型
//实例化gltf载入库
const gltfLoader=new GLTFLoader()
//实例化解压库
const dracoLoader=new DRACOLoader()
//设置解压路径
dracoLoader.setDecoderPath('./dist/draco/')
//设置解压库
gltfLoader.setDRACOLoader(dracoLoader)
//载入模型
gltfLoader.load('./dist/model/island2.glb',(gltf)=>{
  scene.add(gltf.scene)
})

