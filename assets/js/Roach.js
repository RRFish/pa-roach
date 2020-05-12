// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        deadAudio:{
            type:cc.AudioClip,
            default:null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.audio = this.getComponent(cc.AudioSource);
        this.deading = false;
    },
    dead(){
        if(!this.deading){
            this.deading = true;
            const self=this;

            this.audio.clip = this.deadAudio;
            this.audio.play();
            setTimeout(()=>{
                console.log(self)
                self.node.destroy();
            },1000)
            
            const game = this.node.parent.getComponent('game');
            game.increaseKillNum();            
        }

    }

    // update (dt) {},
});
