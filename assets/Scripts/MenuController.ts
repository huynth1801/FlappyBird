import { _decorator, Component, director, Node, Button, AudioSource, find} from 'cc';
const { ccclass, property } = _decorator;
import { SoundManager } from './SoundManager';
import { MainControl } from './MainControl';

@ccclass('MenuController')
export class MenuController extends Component {

    private audioSource: AudioSource

    onLoad() {
        // let canvas = director.getScene().getChildByName('Canvas')
        // let param = canvas.getChildByName("Sound")
        // console.log(param)
        console.log(this.audioSource)
    }

    onClickPlayBtn() {
        director.loadScene("Main")     
    }

    onClickSoundOn() {
        let canvas = director.getScene().getChildByName('Canvas')
        canvas.getChildByName("Sound").active = false
        canvas.getChildByName("Mute").active = true
        // this.audioSource.node.on(AudioSource.EventType.STARTED, this.onAudioStarted, this);
        
    }

    onClickMute() {
        let canvas = director.getScene().getChildByName('Canvas')
        canvas.getChildByName("Sound").active = true
        canvas.getChildByName("Mute").active = false
        // this.audioSource.node.on(AudioSource.EventType.ENDED, this.onAudioEnd, this);
    }

    onAudioStarted() {

    }

    onAudioEnd() {
        
    }
}

