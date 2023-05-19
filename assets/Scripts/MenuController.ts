import { _decorator, Component, director, Node, Button, AudioSource, find, CCBoolean} from 'cc';
const { ccclass, property } = _decorator;
import { Store } from './Store';

@ccclass('MenuController')
export class MenuController extends Component {

    private storeVolume : Store;

    @property(Node)
    private soundBtn: Node

    @property(Node)
    private muteBtn: Node

    @property(Node)
    private audioSource: AudioSource

    onLoad() {
        if (find('StoreVolume') === null)
        {
            const storeVolumeNode = new Node('StoreVolume');
            director.addPersistRootNode(storeVolumeNode);
            this.storeVolume = storeVolumeNode.addComponent(Store);
        }
        else 
        {
            this.storeVolume = find('StoreVolume').getComponent(Store);
        }

        let canvas = director.getScene().getChildByName('Canvas')
        let paramsMain = this.storeVolume.getValue().valueOf();
        this.soundBtn.active = paramsMain === 1;
        this.muteBtn.active = paramsMain !== 1;
        // canvas.getChildByName('AudioSource').getComponent(AudioSource).enabled = paramsMain === 1;
        this.audioSource.getComponent(AudioSource).enabled = paramsMain === 1;
    }

    onClickPlayBtn() {
        director.loadScene("Main")
    }

    // Click to unmute 1
    onClickSoundOn() {
        let canvas = director.getScene().getChildByName('Canvas')
        this.soundBtn.active = true
        this.muteBtn.active = false
        this.audioSource.getComponent(AudioSource).enabled = true
        this.storeVolume.setValue(1)
    }   

    // Click to mute and show mute button 0
    onClickMute() {
        let canvas = director.getScene().getChildByName('Canvas')
        this.soundBtn.active = false
        this.muteBtn.active = true
        this.audioSource.getComponent(AudioSource).enabled = false
        this.storeVolume.setValue(0)
    }


    chooseYellowBird() {
        this.storeVolume.setYellow(true)
        this.storeVolume.setRed(false)
        this.storeVolume.setBlue(false)
    }

    chooseBlueBird() {
        this.storeVolume.setBlue(true)
        this.storeVolume.setRed(false)
        this.storeVolume.setYellow(false)
    }

    chooseRedBird() {
        this.storeVolume.setRed(true)
        this.storeVolume.setYellow(false)
        this.storeVolume.setBlue(false)
    }
}

