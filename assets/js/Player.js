// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        wave:{
            type:cc.Prefab,
            default:null
        }

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.keyEvent, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.keyEvent, this);
        this.direction=null;
        this.arrowKeyPress={
            up:false,
            down:false,
            left:false,
            right:false
        }

        const manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;        
        
    },    
    keyEvent(e){
        switch (e.keyCode){
            //walk
            case cc.macro.KEY.up:
                this.walkEvent(e);
                break;
            case cc.macro.KEY.down:
                this.walkEvent(e);
                break;
            case cc.macro.KEY.left:
                this.walkEvent(e);
                break;
            case cc.macro.KEY.right:
                this.walkEvent(e);
                break;
            //skill            
            case 32://wave
                this.emitSkill(e);
                break;

        }

    },
    emitSkill(e){
        if(e.type==='keyup')
        return ;
        const wave = cc.instantiate(this.wave);
        const waveScript=wave.getComponent('wave');
        waveScript.emitWave(this.direction,this);
        this.node.parent.addChild(wave);
    },
    walkEvent(e){
        switch (e.keyCode){
            case cc.macro.KEY.up:
                this.arrowKeyPress.up=e.type==='keyup'?false:true;
                break;
            case cc.macro.KEY.down:
                this.arrowKeyPress.down=e.type==='keyup'?false:true;
                break;
            case cc.macro.KEY.right:
                this.arrowKeyPress.right=e.type==='keyup'?false:true;
                break;                 
            case cc.macro.KEY.left:
                this.arrowKeyPress.left=e.type==='keyup'?false:true;
                break;
           
        }   


        this.playAudio(e);
        this.showArrow(e);
    },
    playAudio(e){
        const audio = this.getComponent(cc.AudioSource);
        // console.log(e.type)
        if(e.type==='keydown'){
            if(!audio.isPlaying){
                cc.log('play')
                audio.play();
            }
            
        }
        else if(e.type==='keyup'){
            audio.stop();
        }
    },
    move(dt){
        let p_x = this.node.x;
        let p_y = this.node.y;
        let stepLong=500*dt;
        const arrow=this.arrowKeyPress;
        const isTouch = this.node.getComponent('collideObject').touch;
        if(!isTouch){
            if(arrow.up)
            p_y+=stepLong;
            if(arrow.down)
            p_y-=stepLong;
            if(arrow.right)
            p_x+=stepLong;
            if(arrow.left)
            p_x-=stepLong;
    
            this.node.setPosition(p_x,p_y);
        }        


    },   
    move2(dt){
        let v_x = 0;
        let v_y = 0;
        let stepLong=10000*dt;
        const arrow=this.arrowKeyPress;

        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;
        

            if(arrow.up){
                v_y = stepLong;
            }
            if(arrow.down){
                v_y = -stepLong;
            }
            if(arrow.right){
                v_x = stepLong;
            }
            if(arrow.left){
                v_x = -stepLong;
            }
            this.lv.x=v_x;
            this.lv.y=v_y;

            this.node.getComponent(cc.RigidBody).linearVelocity = this.lv;
    
            // this.node.setPosition(p_x,p_y);    


    },      
    showArrow(e){
        const arrow = this.node.getChildByName("arrow");

        if(e.type=='keydown'){
            switch (e.keyCode){
                case cc.macro.KEY.up:
                    arrow.setPosition(0,100);
                    arrow.angle = 0;
                    this.direction='up';
                    break;
                case cc.macro.KEY.down:
                    arrow.setPosition(0,-100);
                    arrow.angle = 180;
                    this.direction='down';
                    break;
                case cc.macro.KEY.right:
                    arrow.setPosition(100,0);
                    arrow.angle = 270;
                    this.direction='right';
                    break;
                case cc.macro.KEY.left:
                    arrow.setPosition(-100,0);
                    arrow.angle = 90;
                    this.direction='left';
                    break;
            }
        }
    },

    update (dt) {
        this.move2(dt);
    },
});
