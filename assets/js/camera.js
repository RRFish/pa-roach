// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        player:{
            type:cc.Node,
            default:null
        },
        UI:{
            type:cc.Node,
            default:null
        }
    },
    update (dt) {
        if(!this.player)return ;

        let w_pos = this.player.convertToWorldSpaceAR(cc.v2(0,0));
        let n_pos = this.node.parent.convertToNodeSpaceAR(w_pos);
        this.node.position=n_pos;

        //set ui position

        this.UI.setPosition(n_pos.x-384,n_pos.y-384);
    },
});
