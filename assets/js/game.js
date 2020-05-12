

cc.Class({
    extends: cc.Component,

    properties: {
        maps:{
            type:cc.Node,
            default:null
        },
        monster:{
            type:cc.Prefab,
            default:null
        },
        roach:{
            type:cc.Prefab,
            default:null
        },
        labels:{
            type:cc.Node,
            default:null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let p = cc.director.getPhysicsManager();
        p.enabled = true;
        // p.debugDrawFlags = true;
        p.gravity = cc.v2(0,0);

        // this.generateMonster();

        //Roach
        this.killNum = 0;
        this.roachNum = 0;

        setInterval(()=>{
            this.generateRoach();
        },1000)
        


    },
    start(){
        const maps = this.maps.children;

        for(map of maps){
            let tiledmap  = map.getComponent(cc.TiledMap);
            let tiledSize =tiledmap.getTileSize();
            let layer = tiledmap.getLayer('walls');
            let layerSize = layer.getLayerSize();
    
            for(let i =0; i<layerSize.width;i++){
                for(let j= 0;j<layerSize.height;j++){
                    let tiled = layer.getTiledTileAt(i, j, true);
                    if(tiled.gid !== 0){
                        tiled.node.group = 'wall';
    
                        let body = tiled.node.addComponent(cc.RigidBody);
                        body.type=cc.RigidBodyType.Static;
                        let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                        collider.offset = cc.v2(tiledSize.width/2,tiledSize.height/2);
                        collider.size = tiledSize;
                        collider.apply();
                    }
                }
            }
        }
    },
    generateMonster(){
        const monster = cc.instantiate(this.monster);
        this.node.addChild(monster);      
        this.setRandMonsterPosition(monster);  


    },
    generateRoach(){
        const roach = cc.instantiate(this.roach);
        this.node.addChild(roach);      
        this.setRandMonsterPosition(roach);  
        
        this.roachNum +=1;
        const roachNumLabel = this.labels.getChildByName('roachNum');
        roachNumLabel.getComponent(cc.Label).string = `蟑螂：${this.roachNum}`;
        console.log(roach.parent)

    },
    increaseKillNum(){
        this.killNum +=1;
        this.roachNum -=1;
        const killNumLabel = this.labels.getChildByName('killNum');
        killNumLabel.getComponent(cc.Label).string = `擊殺：${this.killNum}`;      
        const roachNumLabel = this.labels.getChildByName('roachNum');
        roachNumLabel.getComponent(cc.Label).string = `蟑螂：${this.roachNum}`;  
    },
    setRandMonsterPosition(monster){

        const randArea = Math.floor(Math.random()*3);
        
        // const map = this.maps.children[randArea];
        const map = this.maps.children[randArea];
        console.log(map.width)
        console.log(map.height)
        const tiledmap  = map.getComponent(cc.TiledMap);
        const tiledSize =tiledmap.getTileSize();
        const layer = tiledmap.getLayer('road');
        const layerSize = layer.getLayerSize();


        while(true){
            const layerPos={
                x:Math.floor(Math.random() * layerSize.width),
                y:Math.floor(Math.random() * layerSize.height)
            }
            const tiled = layer.getTiledTileAt(layerPos.x, layerPos.y, true);
            if(tiled.gid !== 0){//is road
                // const pos={
                //     x:layerPos.x * map.width / layerSize.width,
                //     y:layerPos.y * map.height / layerSize.height
                // }
                const pos = {
                    x:0,
                    y:0
                }
                const worldPos = map.convertToWorldSpaceAR(cc.v2(pos.x,pos.y));
                const bgPos = this.node.convertToNodeSpaceAR(worldPos);
             
               monster.setPosition(bgPos);
               return ;
            }

        }

    }

    // update (dt) {},
});
