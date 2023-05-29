
/*目标：制作酷炫的三角形 */
//创建场景
import * as THREE from "three"
const scene = new THREE.Scene()

//创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

//设置相机位置
camera.position.set(0, 0, 10)
scene.add(camera)


const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

//如何创建一个三角形：每个三角形要三个顶点，每个顶点三个值=9
for (let i = 0; i < 50; i++) {
  const geometry = new THREE.BufferGeometry()
  const positionArray = new Float32Array(9)//不传详细的点就要传数字
  for (let j = 0; j < 9; j++) {
    positionArray[j] = Math.random() * 5
  }
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  )
  //设置随机color
  let color = new THREE.Color(Math.random(), Math.random(), Math.random())
  const material = new THREE.MeshBasicMaterial({ color: color })
  //根据集合体和材质创建物体
  const mesh = new THREE.Mesh(geometry, material)
  console.log(mesh)
  scene.add(mesh)
}
const renderer = new THREE.WebGLRenderer()
//设置渲染器尺寸可以把浏览器窗口设为，如果对性能比较敏感可以传一半
renderer.setSize(window.innerWidth, window.innerHeight)
//显示给场景的是canvas元素
document.body.appendChild(renderer.domElement)
//使用渲染器，通过相机把场景渲染进来——将画面渲染到canvas上
// renderer.render(scene, camera)

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
const controls = new OrbitControls(camera, renderer.domElement)
function render2 () {
  renderer.render(scene, camera)
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render2)
}

render2()