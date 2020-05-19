

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
        },
        dialog:cc.Node
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

        this.interval=setInterval(()=>{
            if(this.dialog.getComponent('dialog').gameStart){
                this.generateRoach();
            }
            
        },700)
        


    },
    start(){
        const maps = this.maps.children;

        for(let i = 0 ; i < maps.length ; i++){
            let tiledmap  = maps[i].getComponent(cc.TiledMap);
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
    reloadGame(e){
        switch(e.keyCode){
            case cc.macro.KEY.a:
                cc.director.loadScene("room");
                break;
        }
    },
    generateRoach(){
        const roach = cc.instantiate(this.roach);
        this.node.addChild(roach);      
        this.setRandMonsterPosition(roach);  
        
        this.roachNum +=1;
        const roachNumLabel = this.labels.getChildByName('roachNum');
        roachNumLabel.getComponent(cc.Label).string = `蟑螂：${this.roachNum}`;

        //lose
        const loseNum=50;
        if(this.roachNum>=loseNum){
            this.gameover = true;
            // alert("失敗")
            const dialog = this.dialog.getComponent('dialog');
            dialog.init([
                {role:1,content:"失敗!!a鍵重新開始遊戲"}
            ]);
            clearInterval(this.interval);

            setTimeout(()=>{
                this.node.active=false;
            },1000)
            cc.systemEvent.on('keydown', this.reloadGame,this);            
        }        

    },
    increaseKillNum(){
        this.killNum +=1;
        this.roachNum -=1;
        const killNumLabel = this.labels.getChildByName('killNum');
        killNumLabel.getComponent(cc.Label).string = `擊殺：${this.killNum}`;      
        const roachNumLabel = this.labels.getChildByName('roachNum');
        roachNumLabel.getComponent(cc.Label).string = `蟑螂：${this.roachNum}`;  

        //win
        const winNum=30;
        if(this.killNum>=winNum){
            this.gameover = true;
            const dialog = this.dialog.getComponent('dialog');
            dialog.init([
                {role:1,content:"勝利!!a鍵重新開始遊戲"}
            ]);
            clearInterval(this.interval);

            setTimeout(()=>{
                this.node.active=false;
            },1000)
            cc.systemEvent.on('keydown', this.reloadGame, this);

            
        }        
    },
    setRandMonsterPosition(monster){

        const randArea = Math.floor(Math.random()*4);
        
        const map = this.maps.children[randArea];

        const tiledmap  = map.getComponent(cc.TiledMap);
        // const tiledSize =tiledmap.getTileSize();
        const layer = tiledmap.getLayer('road');
        const wallLayer = tiledmap.getLayer('walls');
        const layerSize = layer.getLayerSize();//0-23

        while(true){

            const layerPos={
                x:Math.floor(Math.random() * layerSize.width),
                y:Math.floor(Math.random() * layerSize.height)
            }
            const tiled = layer.getTiledTileAt(layerPos.x, layerPos.y, true);
            const wallTiled = wallLayer.getTiledTileAt(layerPos.x, layerPos.y, true);
            if(tiled.gid != 0 && wallTiled.gid==0 ){//is road
                const pos={
                    x:layerPos.x * map.width / layerSize.width,
                    y:map.height-(layerPos.y * map.height / layerSize.height)
                }
                // const pos = {
                //     x:192,
                //     y:192
                // }
                const worldPos = map.convertToWorldSpaceAR(cc.v2(pos.x,pos.y));
                const bgPos = this.node.convertToNodeSpaceAR(worldPos);
             
               monster.setPosition(bgPos);
               return ;
            }else{
                // console.log("tiled=0")
            }

        }

    },

});
