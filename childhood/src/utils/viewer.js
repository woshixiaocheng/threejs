// @File 创建场景
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
//导入水面
import { Water } from 'three/examples/jsm/objects/Water.js';
//导入gltf库
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'//解压的，因为模型导入前是压缩了的
//导入hdr要用的loader
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import CANNON from 'cannon'


//------创建场景
const scene = new THREE.Scene()


//------创建设置添加相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .01, 100000);

camera.position.set(-2.055, 2.173, 23.97);
camera.zoom=9
// 全局camera.position.set(244.95, 134.3, -397.9);
//更新摄像头宽高比例
camera.aspect=window.innerWidth/window.innerHeight
//更新摄像头投影矩阵(任何修改都要调用)
camera.updateProjectionMatrix()
scene.add(camera)


//------创建渲染器
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


//------创建轨道控制器
// const controls=new OrbitControls(camera,renderer.domElement)




//------创建天空盒子
const skyBoxGeometry=new THREE.SphereGeometry(1000,60,60)
skyBoxGeometry.scale(1,1,-1)//翻转内部面这样让贴图贴里面，这很重要！！
const skyBoxMaterial=new THREE.MeshBasicMaterial({
  map:new THREE.TextureLoader().load('./dist/textures/sky.jpg'),
})
const skyBox=new THREE.Mesh(skyBoxGeometry,skyBoxMaterial)
scene.add(skyBox)


//-----设置光
//环境光
const ambientLight = new THREE.AmbientLight(0xffffff,.4) // 环境光
scene.add(ambientLight)
// 平行光
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

//----添加小岛模型
//实例化gltf载入库
const gltfLoader=new GLTFLoader()
//实例化解压库
const dracoLoader=new DRACOLoader()
//设置解压路径
dracoLoader.setDecoderPath('./dist/draco/')
//设置解压库
gltfLoader.setDRACOLoader(dracoLoader)
//载入模型
gltfLoader.load('./dist/models/land.glb',(gltf)=>{
  scene.add(gltf.scene)
})

// cannon物理引擎
// const cannonHelper = new CannonHelper(scene);
const world = new CANNON.World();
//在多个步骤的任意轴上测试刚体的碰撞,这是最快的碰撞检测算法，但是它不是最稳定的，因为它不能处理所有的碰撞，但是它对于大多数情况来说是足够的。
world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -10, 0);
//创建地面
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({ mass: 0 });//质量为0，不受重力影响
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, -1, -1), -Math.PI / 2);//设置地面的旋转

// 将物理地面添加到场景中
const groundMaterial = new THREE.MeshBasicMaterial({ 
transparent:true, opacity:0
});
const groundGeometry = new THREE.PlaneGeometry(800, 800);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y=0
scene.add(ground);

//将cannon物体与threejs对象关联起来
const groundBodyMesh=new THREE.Object3D()
groundBodyMesh.position.copy(ground.position)
scene.add(groundBodyMesh)
world.addBody(groundBody)

function createBall(){
  const radius=5//半径
  const segments=32//分段数
  const geometry=new THREE.SphereGeometry(radius,segments,segments)
  const material=new THREE.MeshPhongMaterial({color:0xff0000})
  const ball=new THREE.Mesh(geometry,material)

  //设置小球的初始位置
  const x=Math.random()*4-2
  const z=Math.random()*4-2
  ball.position.set(x,25,z)
  //把小球添加到场景中
  scene.add(ball)
  //创建cannonjs物体
  const shape=new CANNON.Sphere(radius)//创建球体
  const body=new CANNON.Body({mass:1})//质量为1
  body.addShape(shape)//添加形状

  //设置小球的初始位置和速度
  body.position.set(x,25,z)
  body.velocity.set(0,-10,0)

  //将cannon物体与threejs对象关联起来
  const ballBodyMesh=new THREE.Object3D()
  ballBodyMesh.position.copy(ball.position)
  scene.add(ballBodyMesh)
  world.addBody(body)
}

//----添加人物模型
//设置空物体代表人物模型的中心点
const peoplegeometry = new THREE.BoxBufferGeometry(.5, 1, .5);
peoplegeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, .5, 0));//设置模型的中心点
let target = new THREE.Mesh(peoplegeometry, new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0
}));
scene.add(target);

let playPosition ={ x: 0, y: -1, z: -0.8 }//人物模型的位置
var mixers = [], clip1, clip2,actionIdle,actionWalk;//动画混合器
const gltfPeopleLoader = new GLTFLoader();
gltfPeopleLoader.load('./dist/models/renwu.glb', mesh => {
  mesh.scene.traverse(child => {//遍历模型的子元素
    if (child.isMesh) {
      child.castShadow = true;//设置阴影
      child.material.side = THREE.DoubleSide;//设置双面
    }
  });

  var player = mesh.scene;
  player.position.set(playPosition.x, playPosition.y, playPosition.z);
  player.scale.set(1, 1, 1);
  target.add(player);

  var mixer = new THREE.AnimationMixer(player);//动画混合器

  //静止
  clip1 =THREE.AnimationUtils.subclip(mesh.animations[0],'Armature|mixamo.com|Layer0',0,251);//动画片段
  // // ,'walk'
  actionIdle=mixer.clipAction(clip1);//动画动作

  //走路
  clip2=THREE.AnimationUtils.subclip(mesh.animations[0],'Armature|mixamo.com|Layer0',251,283);//动画片段
  actionWalk =  mixer.clipAction(clip2);//动画片段
  actionIdle.play()
  function actionAnimation(){
    // 如果想播放动画,需要周期性执行`mixer.update()`更新AnimationMixer时间数据
    const clock = new THREE.Clock();
        requestAnimationFrame(actionAnimation);
        //clock.getDelta()方法获得loop()两次执行时间间隔
        const frameT = clock.getDelta();
        // 更新播放器相关的时间
        mixer.update(frameT);
        
}
actionAnimation();
  mixers.push(mixer);

});


// 人物动画-传入要play的动作

// 控制人物运动
// 鼠标按下锁定鼠标
document.addEventListener('mousedown', () => {    
  document.body.requestPointerLock();//把指针锁定到当前位置然后使其不可见
});
// 鼠标移动
document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement===document.body) {
    camera.rotation.y -= e.movementX * 0.002;//鼠标水平移动
    camera.rotation.x -= e.movementY * 0.002;//鼠标垂直移动
  }
})

//添加键盘事件
let playerOnFloor = false
let keyStates = {}
document.addEventListener('keydown', e => {
  keyStates[e.code] = true
})
document.addEventListener('keyup', e => {
  keyStates[e.code] = false
})


//根据keyStates控制状态
const velocity = new THREE.Vector3();
function handleControls(deltaTime) {
  // 如果player在地面上，速度为25
  const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);

  if (keyStates['KeyW']) {
    // 摁下W，获取当前水平向量，与这个值相乘，获得player速度改变
   velocity.add(getForwardVector().multiplyScalar(speedDelta));

  }

  if (keyStates['KeyS']) {

    velocity.add(getForwardVector().multiplyScalar(- speedDelta));

  }

  if (keyStates['KeyA']) {

    velocity.add(getSideVector().multiplyScalar(- speedDelta));

  }

  if (keyStates['KeyD']) {

    velocity.add(getSideVector().multiplyScalar(speedDelta));

  }

  if (playerOnFloor) {

    if (keyStates['Space']) {

      velocity.y = 15;

    }

  }
}

// 获得前进方向向量
function getForwardVector() {
  camera.getWorldDirection(player.direction);
  player.direction.y = 0;
  // 转化为单位向量
  player.direction.normalize();

  return player.direction;
}
// 获得左右方向向量
function getSideVector() {
  // Camera.getWorldDirection ( target : Vector3 ) : Vector3 调用该函数的结果将赋值给该Vector3对象。
  camera.getWorldDirection(player.direction);
  player.direction.y = 0;

  // 将该向量转换为单位向量（unit vector）， 也就是说，将该向量的方向设置为和原向量相同，但是其长度（length）为1。
  player.direction.normalize();
  player.direction.cross(camera.up);

  return player.direction;
}

//更新人物位置
const clock = new THREE.Clock();
function animate() {

  const deltaTime = Math.min(0.05, clock.getDelta())
  
  // 控制player移动
  handleControls(deltaTime)
  
  // 更新player的位置
  updatePlayer(deltaTime)
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}

function updatePlayer(deltaTime) {

  let damping = Math.exp(- 4 * deltaTime) - 1;
    
 velocity.addScaledVector(velocity, damping);
  
  // 位移距离
  const deltaPosition = velocity.clone().multiplyScalar(deltaTime);
  peoplegeometry.translate(deltaPosition);
  // 相机的位置，拷贝player的位置
  camera.position.copy(peoplegeometry.end);

}
animate()



// //载入环境纹理hdr
// const hdrLoader=new RGBELoader()
// hdrLoader.loadAsync('./dist/textures/050.hdr').then((texture)=>{
//   texture.mapping=THREE.EquirectangularReflectionMapping//设置映射
//   scene.background=texture//设置背景
//   scene.environment=texture//设置环境
// })


// //创建水面
// const waterGeometry=new THREE.CircleBufferGeometry(300,64)
// const water=new Water(
//   waterGeometry,
//   {
//     textureHeight:1024,
//     textureWidth:1024,
//     color:0xeeeeff,
//     flowDirection:new THREE.Vector2(1,1),//水面流动的方向
//     scale:1
//   }
// )
// water.position.y=3//让水面在地面上
// water.rotation.x=-Math.PI/2//让水面水平

// scene.add(water)



