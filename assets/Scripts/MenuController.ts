import { _decorator, Component, director, Node, Button, AudioSource, find} from 'cc';
const { ccclass, property } = _decorator;
import { SoundManager } from './SoundManager';
import { MainControl } from './MainControl';
import { Store } from './Store';

@ccclass('MenuController')
export class MenuController extends Component {
    @property({type: Node})
    private StoreVolume: Node;

    private audioSource: AudioSource
    // @property(SoundManager)
    // public soundManager: SoundManager = null;

    public yellowBird: Node
    public blueBird: Node

    onLoad() {
        let canvas = director.getScene().getChildByName('Canvas')
        canvas.getChildByName("AudioSource").getComponent(AudioSource).enabled = true
    }

    onClickPlayBtn() {
        director.addPersistRootNode(this.StoreVolume);
        director.loadScene("Main")
    }


    // Click to unmute
    onClickSoundOn() {
        let canvas = director.getScene().getChildByName('Canvas')
        canvas.getChildByName('Sound').active = true
        canvas.getChildByName('Mute').active = false
        canvas.getChildByName('AudioSource').getComponent(AudioSource).enabled = true
        this.StoreVolume.getComponent(Store).stored = 1
    }   

    // Click to mute and show mute button
    onClickMute() {
        let canvas = director.getScene().getChildByName('Canvas')
        canvas.getChildByName('Sound').active = false
        canvas.getChildByName('Mute').active = true
        canvas.getChildByName('AudioSource').getComponent(AudioSource).enabled = false
        this.StoreVolume.getComponent(Store).stored = 0
    }


    chooseYellowBird() {
        director.addPersistRootNode(this.yellowBird)
    }

    chooseBlueBird() {
        director.addPersistRootNode(this.blueBird)
    }

    chooseRedBird() {

    }
}

