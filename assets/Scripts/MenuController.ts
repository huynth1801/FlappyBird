import { _decorator, Component, director, Node, Button, AudioSource, find} from 'cc';
const { ccclass, property } = _decorator;
import { SoundManager } from './SoundManager';
import { MainControl } from './MainControl';

@ccclass('MenuController')
export class MenuController extends Component {

    private audioSource: AudioSource

    onLoad() {
        let param = find("Sound");
        console.log(param.getComponent(Button));
    }

    onClickPlayBtn() {
        director.loadScene("Main")     
    }

    onClickSoundOn() {
        this.node.getChildByName("Sound").active = false
        this.node.getChildByName("Mute").active = true
        this.audioSource.play()
    }
}

