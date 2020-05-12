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

    onLoad () {
        this.heroAni = this.node.getComponent(cc.Animation);


        const manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;            
        

    },
    onCollisionEnter: function (other, self){
        if(other.node.group === 'monster'){
            const roach = other.node.getComponent('Roach');
            roach.dead();
        }
    },     
    emitSpray(state,hero){

        this.hero = hero;
        this.hero.emitingSpray = true;
        this.playState = this.heroAni.play('spray');
        switch (state){
            case 'player_right':
                this.node.angle = 180;
                this.node.setPosition(56,0);
                break;
            case 'player_up':
                this.node.angle = 90;
                this.node.setPosition(0,56);
                break;
            case 'player_down':
                this.node.angle = -90;
                this.node.setPosition(0,-56);
                break;
        }
        


    },

    update (dt) {
        if(!this.playState.isPlaying){
            this.hero.emitingSpray = false;
            this.node.destroy();
        }
    },
});
