/* @file--Viewer场景类函数*/
//包含场景、渲染器、灯光、控制器
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Viewer {
  scene: THREE.Scene | null = null
  camera: THREE.PerspectiveCamera | null = null
  renderer: THREE.WebGLRenderer | null = null
  ambientLight: THREE.AmbientLight | null = null
  mesh: THREE.Mesh | null = null

  constructor() {
    this.init()
  }

  init(): void {
    //新建一个场景
    this.scene = new THREE.Scene()
     this.setCamera()
     this.setRenderer()
     this.setControler()
    this.setSkyBox()
    this.setCube()
    // this.animate()
  }

  //新建主相机
  setCamera(): void {
    // 第二参数就是 长度和宽度比 默认采用浏览器
    //返回以像素为单位的窗口的内部宽度和高度
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1, 2000
      // 0.01,
      // 100000
    )
    this.camera.position.set(1, 1, -1);
    // this.camera.position.set(-50,50,130)
    //更新摄像头宽高比例
    this.camera.aspect=window.innerWidth/window.innerHeight
    //更新摄像头投影矩阵(任何修改都要调用)
    this.camera.updateProjectionMatrix()
    // this.scene ?? this.camera.lookAt( (this.scene as any).position);
    this.scene?.add(this.camera)
  }

  //设置渲染器
  setRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, //设置抗锯齿
      //对数深度缓冲区-可以防止加载闪烁
      logarithmicDepthBuffer: true,
    })
    // 设置画布的大小
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));//设置像素比
    this.renderer.shadowMap.enabled = true;//开启阴影
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;//算法过滤的更加柔和的阴影贴图
    //根据宽高比例修改渲染器的宽高和相机的比例
    window.addEventListener('resize', () => {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
      }
    })

    //这里 其实就是canvas 画布  renderer.domElement
    document.body.appendChild(this.renderer.domElement)
    console.log(this.renderer.domElement)
  }

  //设置轨道控制器
  setControler() {
    if (this.camera && this.renderer) {
      new OrbitControls(this.camera, this.renderer.domElement)
    }
  }

  //设置光
  setLight(): void {
    if (this.scene) {
      // 设置环境光
      this.ambientLight = new THREE.AmbientLight(0xffffff,.4) // 环境光
      this.scene.add(this.ambientLight)
      //设置平行光
      // 添加平行光
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(1, 1, 1).normalize();
      this.scene.add(light);
    }
  }

  //设置天空贴图
  setSkyBox(): void {
    //创建巨大的天空球
    const skyBoxGeometry=new THREE.SphereGeometry(1000,60,60)
    skyBoxGeometry.scale(1,1,-1)//翻转内部面这样让贴图贴里面，这很重要！！
    const skyBoxMaterial=new THREE.MeshBasicMaterial({
      map:new THREE.TextureLoader().load('./assets/sky.jpg'),
    })
    const skyBox=new THREE.Mesh(skyBoxGeometry,skyBoxMaterial)
    if(this.scene){
      this.scene.add(skyBox)
    }
  }
  //设置地面
  setMainLand(): void {
  }



  // 创建场景模型
  setCube(): void {
    if (this.scene) {
      const geometry = new THREE.BoxGeometry() //创建一个立方体几何对象Geometry
      const material = new THREE.MeshBasicMaterial({ color: 0xff3200 }); //材质对象Material
      // const texture = new THREE.TextureLoader().load('../assets/color.jpg') //首先，获取到纹理
      // const material = new THREE.MeshBasicMaterial({ map: texture }) //然后创建一个phong材质来处理着色，并传递给纹理映射
      this.mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
      this.scene.add(this.mesh) //网格模型添加到场景中
      this.render()
    }
  }

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
