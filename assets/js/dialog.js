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
            {role:1,content:"我是阿柴 (空白鍵)"},
            {role:1,content:"家裡最近多了很多蟑螂 (空白鍵)"},
            {role:1,content:"看來只好由我出馬將他們消滅了!! (空白鍵)"},
            {role:1,content:"a:攻擊 方向鍵:移動 "},
            {role:1,content:"勝利:打死30隻蟑螂 失敗:蟑螂超過50隻"},
        ]);

        cc.systemEvent.on('keydown', this.keyDown,this);
        
        this.gameStart = false;
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
        this.textEnd = true;
        this.textIndex = -1;
        this.textDataArr = textDataArr;
        this.node.active = true;
        this.nextTextData();
    },
    nextTextData(){
        console.log(this.textIndex);
        if(this.textEnd === false) return;
        this.textEnd = false;
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
            if(index===length){
                this.textEnd = true;
                clearInterval(interval);
            }
                
        },100)
        
    },
    colseDialog(){
        this.node.active=false;
        this.onDestroyEvent();
        this.gameStart = true;

    }


    // update (dt) {},
});
