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

enum BirdType {
    Yellow,
    Blue,
    Red,
}

const MIN_Y = -120;
const MAX_Y = 120;
const PIPE_START_X = 200;
const PIPE_GAP = 220;
const SCORE_POS_START = new Vec3(0, 175, 0);
const SCORE_POS_GAME_OVER = new Vec3(0, -90, 0);
const highestScoreKey = 'Highest score';

@ccclass('MainControl')
export class MainControl extends Component {
    @property({
        type: Sprite
    })
    private spBg: Sprite[] = [null, null];

    @property({
        type: Sprite
    })
    private spGround: Sprite[] = [null, null];

    @property({
        type: Prefab
    })
    private pipePrefab: Prefab = null;

    @property({
        type: Node
    })
    private gameOverPanel: Node = null;

    @property({
        type: Button
    })
    private btnReset: Button = null;

    @property({
        type: Button
    })
    private btnStart: Button = null;

    @property({
        type: Node
    })
    private pipeContainer: Node;

    @property({
        type: Label
    })
    private scoreLabel: Label = null;

    @property({
        type: Node
    })
    private highScore: Node ;

    @property({
        type: Label
    })
    private highScoreStr: Label;

    @property({
        type: SoundManager
    })
    private soundManager: SoundManager = null;

    @property({
        type: Node
    })
    private pauseBtn: Node;

    @property({
        type: Node
    })
    private resumeBtn: Node;

    @property({
        type: Node
    })
    private soundBtn: Node;

    @property({
        type: Node
    })
    private muteBtn: Node;

    @property({
        type: Node
    })
    private yellowBird: Node;

    @property({
        type: Node
    })
    private blueBird: Node;

    @property({
        type: Node
    })
    private redBird: Node;
    
    private curScore: number = 0;
    private maxScore: number = 0;
    private localScore: number = 0;
    private gameSpeed: number = 100
    private birdControl : BirdControl = null;
    private arrPipe: Node[] = [null, null, null];
    public gameStatus: GameStatus = GameStatus.Ready;

    public getSound() {
        return this.soundManager;
    }

    protected onLoad(): void {
        for(let i = 0; i < this.arrPipe.length; i++){
            this.arrPipe[i] = instantiate(this.pipePrefab);
            this.pipeContainer.addChild(this.arrPipe[i]);
            let xPipe = this.arrPipe[i].position.x;
            let yPipe = this.arrPipe[i].position.y;
            xPipe = PIPE_START_X + PIPE_GAP * i;
            yPipe = MIN_Y + Math.random() * (MAX_Y - MIN_Y);
            this.arrPipe[i].setPosition(new Vec3(xPipe, yPipe, 0));
        }
        if (!sys.localStorage.getItem(highestScoreKey)) {
            sys.localStorage.setItem(highestScoreKey, this.curScore.toString());
        }
        this.gameOverPanel.active = false;
        this.btnReset.node.on(Input.EventType.TOUCH_END, this.onBtnResetClicked, this);
        this.btnStart.node.on(Input.EventType.TOUCH_END, this.onBtnStartClicked, this);
        this.btnReset.node.active = false;
        this.btnStart.node.active = true;
        this.highScore.active = false;
        // Mute/Unmute from 
        let storeVolume = find('StoreVolume').getComponent(Store);
        this.soundManager.audioSource.volume = storeVolume.getValue().valueOf();
        // Get the Boolean value when choose bird
        let birdType = BirdType.Yellow;
        if (storeVolume.getBirdType(BirdType.Yellow)) {
            birdType = BirdType.Yellow;
        } else if (storeVolume.getBirdType(BirdType.Blue)) {
            birdType = BirdType.Blue;
        } else {
            birdType = BirdType.Red;
        }
        this.muteBtn.active = storeVolume.getValue().valueOf() === 1;
        this.soundBtn.active = !this.muteBtn.active;
        this.birdControl = this.getBirdControlComponent(birdType);
    }

    protected update(deltaTime: number): void {
        // if game status is not playing, stop calculate and return
        if(this.gameStatus != GameStatus.Playing)
            return;

        // move the background node
        this.moveBackgroundNodes(deltaTime);
        // move the ground node
        this.moveGroundNodes(deltaTime);
        // move the pipe node
        this.movePipeNodes(deltaTime);
        this.highScore.active = false;
    }

    public setScore(): void {
        this.curScore++;
        this.scoreLabel.string = this.curScore.toString();
    }

    private getBirdType(storeVolume: Store): BirdType {
        if (storeVolume.getBirdType(BirdType.Yellow)) {
            return BirdType.Yellow;
        } else if (storeVolume.getBirdType(BirdType.Blue)) {
            return BirdType.Blue;
        } else {
            return BirdType.Red;
        }
    }
    
    private getBirdControlComponent(birdType: BirdType): BirdControl {
        switch (birdType) {
            case BirdType.Yellow:
                return this.yellowBird.getComponent(BirdControl);
            case BirdType.Blue:
                return this.blueBird.getComponent(BirdControl);
            case BirdType.Red:
                return this.redBird.getComponent(BirdControl);
            default:
                return this.yellowBird.getComponent(BirdControl);
        }
    }

    private onBtnStartClicked(): void {
        // hide start button
        this.btnStart.node.active = false;
        this.btnReset.node.active = false;
        this.gameStatus = GameStatus.Playing;
        this.gameOverPanel.active = false;
        // show pause button
        this.pauseBtn.active = true;

        //Reset angle and position of the bird
        let storeVolume = find('StoreVolume').getComponent(Store);
        let yellow = storeVolume.getBirdType(BirdType.Yellow);
        let blue = storeVolume.getBirdType(BirdType.Blue);
        let red = storeVolume.getBirdType(BirdType.Red);
        this.yellowBird.active = yellow.valueOf();
        this.blueBird.active = blue.valueOf();
        this.redBird.active = red.valueOf();
        this.birdControl.node.setPosition(new Vec3(0,0,0));
        this.birdControl.node.angle = 0;      
        // reset position of all the pipes
        this.resetPipePositions();

        // Reset score
        this.curScore = 0;
        this.scoreLabel.string = this.curScore.toString();
    }

    private onBtnResetClicked(): void {
        this.btnStart.node.active = false;
        this.btnReset.node.active = false;
        this.gameStatus = GameStatus.Playing;
        this.gameOverPanel.active = false;
        this.pauseBtn.active = true;

        //Reset map
        let storeVolume = find('StoreVolume').getComponent(Store);
        let birdType = this.getBirdType(storeVolume);
        this.birdControl = this.getBirdControlComponent(birdType);
        this.resetBirdPositionAndRotation(this.birdControl);
        this.resetPipePositions();

        //Score
        this.curScore = 0;
        this.scoreLabel.string = this.curScore.toString();
        this.scoreLabel.node.setPosition(SCORE_POS_START);
    }

    private moveBackgroundNodes(deltaTime: number): void {
        for (let i = 0; i < this.spBg.length; i++) {
            let newPosX = this.spBg[i].node.position.x;
            let newPosY = this.spBg[i].node.position.y;
            newPosX -= this.gameSpeed * deltaTime;
            if (newPosX <= -288) {
                newPosX = 288;
            }
            this.spBg[i].node.setPosition(new Vec3(newPosX, newPosY, 0));
        }
    }
    
    private moveGroundNodes(deltaTime: number): void {
        for (let i = 0; i < this.spGround.length; i++) {
            let newPos = this.spGround[i].node.getPosition();
            newPos.x -= this.gameSpeed * deltaTime;
            if (newPos.x <= -336) {
                newPos.x = 336;
            }
            this.spGround[i].node.setPosition(newPos);
        }
    }
    
    private movePipeNodes(deltaTime: number): void {
        for (let i = 0; i < this.arrPipe.length; i++) {
            let newPos = this.arrPipe[i].getPosition();
            newPos.x -= this.gameSpeed * deltaTime;
            if (newPos.x <= -200) {
                newPos.x = 430;
                newPos.y = MIN_Y + Math.random() * (MAX_Y - MIN_Y);
            }
            this.arrPipe[i].setPosition(newPos);
        } 
        this.highScore.active = false;
    }

    // Reset pipe position
    private resetPipePositions(): void {
        for (let i = 0; i < this.arrPipe.length; i++) {
            let newPos = this.arrPipe[i].getPosition();
            newPos.x = PIPE_START_X + PIPE_GAP * i;
            newPos.y = MIN_Y + Math.random() * (MAX_Y - MIN_Y);
            this.arrPipe[i].setPosition(newPos);
        }
    }

    private resetBirdPositionAndRotation(birdControl: BirdControl): void {
        birdControl.node.setPosition(new Vec3(0, 0, 0));
        birdControl.node.angle = 0;
    }

    public gameOver(): void {
        this.gameOverPanel.active = true;
        this.btnReset.node.active = true;
        this.pauseBtn.active = false;
        this.resumeBtn.active = false;
        this.gameStatus = GameStatus.GameOver;
        this.soundManager.playSound(SoundType.Die);
        this.showResults();
    }

    private showResults(): void {
        this.highScore.active = true;
        this.localScore = parseInt(sys.localStorage.getItem(highestScoreKey));
        this.maxScore = Math.max(this.localScore, this.curScore);
        sys.localStorage.setItem(highestScoreKey, this.maxScore.toString());
        this.highScoreStr.string = this.maxScore.toString();
        this.scoreLabel.node.setPosition(SCORE_POS_GAME_OVER);
    }

    private backToMenu(): void {
        director.loadScene('Menu');
    }

    private onClickPause(): void {
        director.pause();
        this.pauseBtn.active = false;
        this.resumeBtn.active = true;
    }

    private onClickResume(): void {
        director.resume();
        this.pauseBtn.active = true;
        this.resumeBtn.active = false;
    }

    private onClickSoundOn(): void {
        this.soundManager.audioSource.volume = 1;
        this.muteBtn.active = true;
        this.soundBtn.active = false;
    }   

    // Click to mute and show mute button 0
    private onClickMute(): void {
        this.soundManager.audioSource.volume = 0;
        this.soundBtn.active = true;
        this.muteBtn.active = false;
    }
}

