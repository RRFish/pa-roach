let roleMap ={
    1:{
        name:"阿柴",
        url:"role/player"
    },
    2:{
        name:"怪物",
        url:"role/monster"
    }
}

cc.Class({
    extends: cc.Component,

    properties: {
        picSprite:cc.Sprite,
        nameLabel:cc.Label,
        textLabel:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init([
            {role:1,content:"我是阿柴"},
            {role:2,content:"我是monster"},
        ]);

        cc.systemEvent.on('keydown', this.keyDown,this);
    },
    keyDown(e){
        switch(e.keyCode){
            case cc.macro.KEY.space:
                this.nextTextData();
                break;
        }
    },
    onDestroyEvent(){
        cc.systemEvent.off('keydown', this.keyDown,this);
    },
    init(textDataArr){
        this.textIndex = -1;
        this.textDataArr = textDataArr;
        this.node.active = true;
        this.nextTextData();

    },
    nextTextData(){
        console.log(this.textIndex);
        if(++this.textIndex < this.textDataArr.length){
            this.setTextData(this.textDataArr[this.textIndex])
        }
        else{
            this.colseDialog();
        }
    },
    setTextData(textData){

        this.nameLabel.string = roleMap[textData.role].name;
        this.individuallySetContent(textData);
        // this.textLabel.string = textData.content;

        cc.loader.loadRes(roleMap[textData.role].url,cc.SpriteFrame,(err,texttrue)=>{
            this.picSprite.spriteFrame = texttrue;
        })
    },
    individuallySetContent(textData){

        let index = 0;
        let length = textData.content.length;
        const interval=setInterval(()=>{
            index++;
            this.textLabel.string = textData.content.slice(0,index);
            if(index===length)
                clearInterval(interval);
        },100)
        
    },
    colseDialog(){
        this.node.active=false;
        this.onDestroyEvent();
    }


    // update (dt) {},
});
