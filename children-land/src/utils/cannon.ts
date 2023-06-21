/* @file--Cannon 创建物理世界*/
import * as CANNON from 'cannon'
export default class Cannon {
    // world: CANNON.World | null = null
  
    constructor() {
      this.init()
    }
  
    init(): void {
        //初始化物理世界
        const world = new CANNON.World()
        //向全世界提供可以找到相撞物体的算法
        world.broadphase = new CANNON.NaiveBroadphase(world);
        //设置重力
        world.gravity.set(0, -9.82, 0)

    }
  
  }