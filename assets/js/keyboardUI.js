// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        dialog:cc.Node,
        player:cc.Node,
        game:cc.Node
    },

    start () {
        // if(!cc.sys.isMobile){
        //     this.node.active = false; 
        //     return ;
        // }

        
        const tiledmap  = this.getComponent(cc.TiledMap);
        const tiledSize = tiledmap.getTileSize();

        const keys = ['a','up','down','left','right'];
        const layers = [];
        const layersSize = [];

        for(let i in keys){
            layers[i] = tiledmap.getLayer(keys[i]);
            layersSize[i] = layers[i].getLayerSize();
            

            for(let j = 0 ; j < layersSize[i].width ; j++){
                for(let h = 0 ; h < layersSize[i].height ; h++){
                    const tiled =  layers[i].getTiledTileAt(j, h, true);
                    if(tiled.gid !=0){
                        tiled.node.anchorX = 0;
                        tiled.node.anchorY = 0;
                        tiled.node.width = tiledSize.width;
                        tiled.node.height = tiledSize.height;
                        
                        tiled.node.on(cc.Node.EventType.TOUCH_START,(e)=>{
                            console.log('mousedown')
                            switch (keys[i]){
                                case 'a':
                                    console.log('keycode A')
                                    this.dialog.getComponent("dialog").keyDown({keyCode:cc.macro.KEY.a});
                                    this.player.getComponent("hero").onKeyDown({keyCode:cc.macro.KEY.a});
                                    const game=this.game.getComponent("game");
                                    if(game.gameover==true){
                                        game.reloadGame({keyCode:cc.macro.KEY.a})
                                    }
                                    break;
                                default:
                                    this.player.getComponent("hero").onKeyDown({keyCode:cc.macro.KEY[keys[i]]});
                                    break;
                                
                            }

                        },this);
                        tiled.node.on(cc.Node.EventType.TOUCH_END,(e)=>{
                            console.log('mouseup')
                            switch (keys[i]){
                                case 'a':
                                    this.player.getComponent("hero").onKeyUp({keyCode:cc.macro.KEY.a});
                                    break;
                                default:
                                    this.player.getComponent("hero").onKeyUp({keyCode:cc.macro.KEY[keys[i]]});
                                    break;
                            }

                        },this);                        
                    }
                }
            }

        }
        



    },

    // update (dt) {},
});
