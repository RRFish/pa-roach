// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    emitWave(direction,player){
        this.direction=direction;
        this.player=player;
        switch (direction){
            case 'up':
                this.setWorldPosition(0,170);
                this.node.rotation = 90;
                break;
            case 'down':
                this.setWorldPosition(0,-170);
                this.node.rotation = 90;
                break;
            case 'right':
                this.setWorldPosition(120,0);
                break;                
            case 'left':
                this.setWorldPosition(-120,0);
                break;

        }
        console.log(direction)
        cc.log(this.node.position);


    },
    setWorldPosition(x,y){
        const realx = this.player.node.x + x;
        const realy = this.player.node.y + y;
        this.node.setPosition(realx,realy);

    },
    waveForward(dt){
        const stepLong = 200*dt ;
        const p_x = this.node.x;
        const p_y = this.node.y;

        switch (this.direction){
            case 'up':
                this.node.setPosition(p_x,p_y+stepLong);
                break;
            case 'down':
                this.node.setPosition(p_x,p_y-stepLong);
                break;
            case 'right':
                this.node.setPosition(p_x+stepLong,p_y);
                break;
            case 'left':
                this.node.setPosition(p_x-stepLong,p_y);
                break;
            
        }
        
    },
    waitDestroy(dt){
        this.distoryTime-=dt;
        if(this.distoryTime<=0){
            this.node.destroy();
        }
    },
    start () {
        this.distoryTime=1.5;

        const manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;          
          
    },
    onCollisionEnter: function (other,self) {
        console.log(other);
        const otherNode = other.node;
        const name = otherNode.name;
        const game = this.node.parent.getComponent('game');
        
        if(name === "monster"){
            otherNode.color = cc.Color.RED;
            other.getComponent(cc.AudioSource).play();
            setTimeout(()=>{
                otherNode.destroy();
                game.generateMonster();

            },2000)
        }

    },    
    update (dt) {
        this.waveForward(dt);

        this.waitDestroy(dt);
    },
});
