import { _decorator, Component, director, Node, Button, AudioSource, find} from 'cc';
const { ccclass, property } = _decorator;
import { SoundManager } from './SoundManager';
import { MainControl } from './MainControl';

@ccclass('MenuController')
export class MenuController extends Component {

    private audioSource: AudioSource

    onLoad() {
        let canvas = director.getScene().getChildByName('Canvas')
        // let param = canvas.getChildByName("Sound")
        // param.active = false
        // console.log(param)
        // console.log(this.audioSource)
        // this.audioSource.node.on(AudioSource.EventType.ENDED, this.onAudioStarted, this);
        canvas.getChildByName("AudioSource").getComponent(AudioSource).enabled = true
    }

    onClickPlayBtn() {
        director.loadScene("Main")     
    }


    // Nhan vao de tat am va hien ra nut mute
    onClickSoundOn() {
        let canvas = director.getScene().getChildByName('Canvas')
        canvas.getChildByName("Sound").active = true
        canvas.getChildByName("Mute").active = false
        canvas.getChildByName("AudioSource").getComponent(AudioSource).enabled = true
        // this.audioSource.node.on(AudioSource.EventType.ENDED, this.onAudioStarted, this);
        
    }

    // Nhan vao de bat am va hien ra nut sound
    onClickMute() {
        let canvas = director.getScene().getChildByName('Canvas')
        canvas.getChildByName("Sound").active = false
        canvas.getChildByName("Mute").active = true
        canvas.getChildByName("AudioSource").getComponent(AudioSource).enabled = false
        // console.log("Clicked")
        // this.audioSource.node.on(AudioSource.EventType.STARTED, this.onAudioEnd, this);
    }

    onAudioStarted() {

    }

    onAudioEnd() {
        
    }
}

