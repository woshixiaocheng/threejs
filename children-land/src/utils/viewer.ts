/* @file--Viewer场景类函数*/
//包含场景、渲染器、灯光、控制器
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Viewer {
  scene: THREE.Scene | null = null
  camera: THREE.PerspectiveCamera | null = null
  renderer: THREE.WebGLRenderer | null = null
  ambientLight: THREE.AmbientLight | null = null
  // mesh: THREE.Mesh | null = null

  constructor(dom: HTMLElement) {
    this.init(dom)
  }

  init(dom: HTMLElement): void {
    //新建一个场景
    this.scene = new THREE.Scene()
    this.setCamera()
    this.setRenderer(dom)
    this.setControler()
    // this.setCube()
    // this.animate()
  }

  //新建透视相机
  setCamera(): void {
    // 第二参数就是 长度和宽度比 默认采用浏览器
    //返回以像素为单位的窗口的内部宽度和高度
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.z = 5
    this.scene?.add(this.camera)
  }

  //设置渲染器
  setRenderer(dom: HTMLElement): void {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, //设置抗锯齿
      //对数深度缓冲区-可以防止加载闪烁
      logarithmicDepthBuffer: true,
    })
    // 设置画布的大小
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    //根据宽高比例修改渲染器的宽高和相机的比例
    window.addEventListener('resize', () => {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
      }
    })

    //这里 其实就是canvas 画布  renderer.domElement
    dom.appendChild(this.renderer.domElement)
  }

  //设置轨道控制器
  setControler() {
    if (this.camera && this.renderer) {
      new OrbitControls(this.camera, this.renderer.domElement)
    }
  }

  // 设置环境光
  setLight(): void {
    if (this.scene) {
      this.ambientLight = new THREE.AmbientLight(0xffffff) // 环境光
      this.scene.add(this.ambientLight)
    }
  }

  // 创建场景模型
  // setCube(): void {
  //   if (this.scene) {
  //     const geometry = new THREE.BoxGeometry() //创建一个立方体几何对象Geometry
  //     // const material = new THREE.MeshBasicMaterial({ color: 0xff3200 }); //材质对象Material
  //     const texture = new THREE.TextureLoader().load('./src/assets/color.jpg') //首先，获取到纹理
  //     const material = new THREE.MeshBasicMaterial({ map: texture }) //然后创建一个phong材质来处理着色，并传递给纹理映射
  //     this.mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
  //     this.scene.add(this.mesh) //网格模型添加到场景中
  //     this.render()
  //   }
  // }

  // 渲染
  render(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  // // 动画
  // animate(): void {
  //   if (this.mesh) {
  //     requestAnimationFrame(this.animate.bind(this))
  //     this.mesh.rotation.x += 0.01
  //     this.mesh.rotation.y += 0.01
  //     this.render()
  //   }
  // }
}
