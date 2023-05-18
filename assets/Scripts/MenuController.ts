import { _decorator, Component, director, Node, Button, AudioSource, find, CCBoolean} from 'cc';
const { ccclass, property } = _decorator;
import { SoundManager } from './SoundManager';
import { MainControl } from './MainControl';
import { Store } from './Store';

@ccclass('MenuController')
export class MenuController extends Component {
    // private audioSource: AudioSource
    // @property(SoundManager)
    // public soundManager: SoundManager = null;

    @property({
        type : CCBoolean
    })
    private yellowBird
    @property({
        type : CCBoolean
    })
    private blueBird
    @property({
        type : CCBoolean
    })
    private redBird

    private storeVolume : Store;

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
        // canvas.getChildByName("AudioSource").getComponent(AudioSource).enabled = true
        let paramsMain = this.storeVolume.getValue().valueOf();
        canvas.getChildByName('Sound').active = paramsMain === 1;
        canvas.getChildByName('Mute').active = paramsMain !== 1;
        canvas.getChildByName('AudioSource').getComponent(AudioSource).enabled = paramsMain === 1;
        console.log(paramsMain)
    }


    onClickPlayBtn() {
        this.chooseBlueBird()
        this.chooseYellowBird()
        this.chooseRedBird()
        director.loadScene("Main")
    }


    // Click to unmute 1
    onClickSoundOn() {
        let canvas = director.getScene().getChildByName('Canvas')
        canvas.getChildByName('Sound').active = true
        canvas.getChildByName('Mute').active = false
        canvas.getChildByName('AudioSource').getComponent(AudioSource).enabled = true
        this.storeVolume.setValue(1)
    }   

    // Click to mute and show mute button 0
    onClickMute() {
        let canvas = director.getScene().getChildByName('Canvas')
        canvas.getChildByName('Sound').active = false
        canvas.getChildByName('Mute').active = true
        canvas.getChildByName('AudioSource').getComponent(AudioSource).enabled = false
        this.storeVolume.setValue(0)
    }


    chooseYellowBird() {
        // director.addPersistRootNode(this.yellowBird)
    }

    chooseBlueBird() {
        // director.addPersistRootNode(this.blueBird)
    }

    chooseRedBird() {
        // director.addPersistRootNode(this.redBird)
    }
}

