const input = {};

cc.Class({
    extends: cc.Component,

    properties: {
        speed:{
            type:Number,
            default:200
        },
        spray:{
            type:cc.Prefab,
            default:null
        },
        walkAudio:{
            type:cc.AudioClip,
            default:null
        },
        dialog:cc.Node        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        cc.systemEvent.on('keydown',this.onKeyDown,this);
        cc.systemEvent.on('keyup',this.onKeyUp,this);
        //hero animation
        this.state = '';
        this.heroAni = this.node.getComponent(cc.Animation);
        //move
        this.sp = cc.v2(0,0);
        this.audio = this.getComponent(cc.AudioSource);

        //spray
        this.emitingSpray=false;



    },
    setState(state){
        if(this.state === state ) return ; 

        this.state = state;
        this.heroAni.play(state);
    },
    onKeyDown(e){
        input[e.keyCode] = true;

    },
    onKeyUp(e){
        input[e.keyCode] = false;
    },
    update (dt) {
        if(!this.dialog.getComponent('dialog').gameStart) return ;
        // const position = this.node.position;
        // console.log(position);
        if(input[cc.macro.KEY.up]){
            this.sp.y = 1;
        }
        else if(input[cc.macro.KEY.down]){
            this.sp.y = -1;
        }
        else{
            this.sp.y = 0;
        }

        if(input[cc.macro.KEY.left]){
            this.sp.x = -1;
        }
        else if(input[cc.macro.KEY.right]){
            this.sp.x = 1;
        } 
        else{
            this.sp.x = 0;
        }   
        
        const RB = this.node.getComponent(cc.RigidBody);
        this.lv = RB.linearVelocity;        

        if(this.sp.x){
            this.lv.x = this.sp.x * this.speed;
            this.lv.y = 0;
        }
        else if(this.sp.y){
            this.lv.x = 0;
            this.lv.y = this.sp.y * this.speed;
        }
        else{
            this.lv.x = 0;
            this.lv.y = 0;            
            //
        }
        RB.linearVelocity = cc.v2(this.lv.x,this.lv.y);


        
        //play animation
        let state = '';
        if(this.sp.x === 1){
            state = 'player_right';
        }
        else if(this.sp.x === -1){
            state = 'player_left';
        }
        else if(this.sp.y === 1){
            state = 'player_up';
        }
        else if(this.sp.y === -1){
            state = 'player_down';
        }

        if(state)   {
            this.setState(state);
            if(!this.audio.isPlaying){
                this.audio.clip = this.walkAudio;
                this.audio.play();
            }
        }
        else{
            this.audio.stop();
            this.heroAni.stop();
        }

        //Spray
        if(input[cc.macro.KEY.a]  && this.emitingSpray === false){
            const spray= cc.instantiate(this.spray);
            const sprayScript=spray.getComponent('Spray');
            this.node.addChild(spray);            
            sprayScript.emitSpray(this.state,this);
        }
        
    }
});
