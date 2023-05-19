import { _decorator, Component, Node, Sprite, Vec2, Vec3, Prefab, instantiate, math, director, PhysicsSystem2D, EPhysics2DDrawFlags, Button, Input, Label, sys, Canvas, Animation, animation, find, SpriteFrame , resources} from 'cc';
import { BirdControl } from './BirdControl';
import { SoundManager, SoundType } from './SoundManager';
import { Store } from './Store';
const { ccclass, property } = _decorator;

export enum GameStatus{
    Ready = 0,
    Playing,
    GameOver
}

@ccclass('MainControl')
export class MainControl extends Component {
    @property(Sprite)
    private spBg: Sprite[] = [null, null];

    @property(Sprite)
    private spGround: Sprite[] = [null, null];

    @property(Prefab)
    private pipePrefab: Prefab = null;

    @property(Node)
    private gameOverPanel: Node = null;

    @property(Button)
    private btnReset: Button = null;

    private arrPipe: Node[] = [null, null, null];
    public gameStatus: GameStatus = GameStatus.Ready;

    @property(Button)
    private btnStart: Button = null;

    @property(Label)
    private scoreLabel: Label = null;

    @property(Node)
    private highScore: Node 

    @property(SoundManager)
    public soundManager: SoundManager = null;

    @property(Node)
    private pauseBtn: Node

    @property(Node)
    private resumeBtn: Node


    private curScore: number = 0;
    private maxScore: number = 0;
    private localScore: number = 0;
    public birdControl : BirdControl = null;

    onLoad(){
        this.localScore = parseInt(sys.localStorage.getItem('Highest score'));
        this.gameOverPanel.active = false;
        this.btnReset.node.on(Input.EventType.TOUCH_END, this.onBtnResetClicked, this);
        this.btnStart.node.on(Input.EventType.TOUCH_END, this.onBtnStartClicked, this);
        this.btnReset.node.active = false;
        this.btnStart.node.active = true;
        // this.birdControl = this.node.getChildByName('Bird').getComponent(BirdControl);
        // this.birdControl.node.active = false;
        this.highScore.active = false
        // this.node.getChildByName('BackToMenu').active = false
        let param = find('StoreVolume').getComponent(Store).getValue()
        this.soundManager.audioSource.volume = param.valueOf();
        var storeVolume = find('StoreVolume').getComponent(Store)
        let yellow = storeVolume.getYellow()
        let blue = storeVolume.getBlue()
        let red = storeVolume.getRed()
        console.log(this.node.getChildByName('BlueBird').active);
        if (yellow) {
            this.birdControl = this.node.getChildByName('Bird').getComponent(BirdControl);
            this.birdControl.node.active = !yellow;
        } else if (blue) {
            this.node.getChildByName('BlueBird').active = blue.valueOf()
            this.birdControl = this.node.getChildByName('BlueBird').getComponent(BirdControl);
            this.birdControl.node.active = !blue;
        } else {
            this.node.getChildByName('RedBird').active = red.valueOf()
            this.birdControl = this.node.getChildByName('RedBird').getComponent(BirdControl);
            this.birdControl.node.active = !red;
        }
    }


    start() {
        for(let i = 0; i < this.arrPipe.length; i++){
            this.arrPipe[i] = instantiate(this.pipePrefab);
            this.node.getChildByName('PipeContainer').addChild(this.arrPipe[i]);
            let minY = -120;
            let maxY = 120;
            let xPipe = this.arrPipe[i].position.x;
            let yPipe = this.arrPipe[i].position.y;
            xPipe = 170 + 200 * i;
            yPipe = minY + Math.random() * (maxY - minY);
            this.arrPipe[i].setPosition(new Vec3(xPipe, yPipe, 0));
        }
    }

    update(deltaTime: number) {
        // if game status is not playing, stop calculate and return
        if(this.gameStatus != GameStatus.Playing)
            return;

        // move the background node
        for(let i = 0; i < this.spBg.length; i++){
            let newPos = this.spBg[i].node.getPosition();
            newPos.x -= 1.0;
            if(newPos.x <= -288)
            {
                newPos.x = 288;
            }
            this.spBg[i].node.setPosition(newPos);
        }

        // move the ground node
        for(let i = 0; i < this.spGround.length; i++){
            let newPos = this.spGround[i].node.getPosition();
            newPos.x -= 1.0;
            if(newPos.x <= -336)
            {
                newPos.x = 336;
            }
            this.spGround[i].node.setPosition(newPos);
        }

        // move the pipe node
        for(let i = 0; i < this.arrPipe.length; i++){
            let newPos = this.arrPipe[i].getPosition();
            newPos.x -= 1.0;
            if(newPos.x <= -170)
            {
                newPos.x = 430;
                let minY = -120;
                let maxY = 120;
                newPos.y = minY + Math.random() * (maxY - minY);
            }
            this.arrPipe[i].setPosition(newPos);
        }

        this.highScore.active = false
    }

    setScore(){
        this.curScore++;
        this.scoreLabel.string = this.curScore.toString();
    }

    onBtnStartClicked(){
        // hide start button
        this.btnStart.node.active = false;
        this.btnReset.node.active = false;
        this.gameStatus = GameStatus.Playing;
        this.gameOverPanel.active = false;
        // show pause button
        this.pauseBtn.active = true

        //Reset angle and position of the bird
        // this.birdControl.node.active = true;
        let storeVolume = find('StoreVolume').getComponent(Store)
        let yellow = storeVolume.getYellow()
        let blue = storeVolume.getBlue()
        let red = storeVolume.getRed()
        this.node.getChildByName('Bird').active = yellow.valueOf();
        this.node.getChildByName('Bird').getComponent(BirdControl).node.active = yellow.valueOf()
        this.node.getChildByName('BlueBird').active = blue.valueOf();
        this.node.getChildByName('BlueBird').getComponent(BirdControl).node.active = blue.valueOf()
        this.node.getChildByName('RedBird').active = red.valueOf();
        this.node.getChildByName('RedBird').getComponent(BirdControl).node.active = red.valueOf()
        this.birdControl.node.setPosition(new Vec3(0,0,0));
        this.birdControl.node.angle = 0;
        
        // reset position of all the pipes
        for(let i = 0; i < this.arrPipe.length; i++){
            let newPos = this.arrPipe[i].getPosition();
            newPos.x = 170 + 220 * i
            let minY = -120;
            let maxY = 120;
            newPos.y = minY + Math.random() * (maxY - minY);
            this.arrPipe[i].setPosition(newPos);
        }

        // Reset score
        this.curScore = 0;
        this.scoreLabel.string = this.curScore.toString();
    }

    onBtnResetClicked(){
        this.btnStart.node.active = false;
        this.btnReset.node.active = false;
        this.gameStatus = GameStatus.Playing;
        this.gameOverPanel.active = false;
        this.pauseBtn.active = true

        //Reset map
        this.birdControl.node.setPosition(new Vec3(0,0,0));
        this.birdControl.node.angle = 0;
        this.node.getChildByName('BlueBird').setPosition(new Vec3(0,0,0))
        this.node.getChildByName('BlueBird').angle = 0
        this.node.getChildByName('RedBird').setPosition(new Vec3(0,0,0))
        this.node.getChildByName('RedBird').angle = 0
        for(let i = 0; i < this.arrPipe.length; i++){
            let newPos = this.arrPipe[i].getPosition();
            newPos.x = 170 + 220 * i
            let minY = -120;
            let maxY = 120;
            newPos.y = minY + Math.random() * (maxY - minY);
            this.arrPipe[i].setPosition(newPos);
        }

        //Score
        this.curScore = 0;
        this.scoreLabel.string = this.curScore.toString();
        this.scoreLabel.node.setPosition(0,175,0)
    }

    gameOver(){
        this.gameOverPanel.active = true;
        this.btnReset.node.active = true;
        this.pauseBtn.active = false
        this.resumeBtn.active = false
        this.gameStatus = GameStatus.GameOver;
        this.soundManager.playSound(SoundType.Die);
        this.node.getChildByName('BackToMenu').active = true
        this.showResults()
    }

    showResults() {
        this.highScore.active = true
        this.maxScore = Math.max(this.localScore, this.curScore)
        sys.localStorage.setItem('Highest score' , JSON.stringify(this.maxScore))
        this.localScore = parseInt(sys.localStorage.getItem('Highest score'))
        this.node.getChildByName('HighScore').getComponentInChildren(Label).string = this.maxScore.toString();
        this.scoreLabel.node.setPosition(0,-100,0)
    }

    backToMenu() {
        director.loadScene('Menu')
    }

    onClickPause() {
        director.pause()
        this.pauseBtn.active = false
        this.resumeBtn.active = true
    }

    onClickResume() {
        director.resume()
        this.pauseBtn.active = true
        this.resumeBtn.active = false
    }
}

