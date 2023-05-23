import { _decorator, Component, director, Node, Button, AudioSource, find, CCBoolean, Label} from 'cc';
const { ccclass, property } = _decorator;
import { Store } from './Store';

enum BirdType {
    Yellow,
    Blue,
    Red,
}

@ccclass('MenuController')
export class MenuController extends Component {

    private storeVolume : Store;

    @property({
        type: Node
    })
    private soundBtn: Node

    @property({
        type: Node
    })
    private muteBtn: Node

    @property({
        type: Node
    })
    private audioSource: AudioSource

    @property({
        type: Label
    })
    private showText: Label

    protected onLoad(): void {
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

        let paramsMain = this.storeVolume.getValue().valueOf();
        this.soundBtn.active = paramsMain === 1;
        this.muteBtn.active = paramsMain !== 1;
        this.audioSource.getComponent(AudioSource).enabled = paramsMain === 1;
    }

    private onClickPlayBtn(): void {
        director.loadScene("Main");
    }

    // Click to unmute 1
    private onClickSoundOn(): void {
        this.setSoundState(true);
    }

    private onClickMute(): void {
        this.setSoundState(false);
    }

    private setSoundState(isSoundOn: boolean): void {
        this.soundBtn.active = isSoundOn;
        this.muteBtn.active = !isSoundOn;
        this.audioSource.getComponent(AudioSource).enabled = isSoundOn;
        this.storeVolume.setValue(isSoundOn ? 1 : 0);
    }


    private chooseBirdType(type: BirdType, message: string): void {
        this.storeVolume.setBirdType(type, true);

        for (let i = 0; i < Object.keys(BirdType).length / 2; i++) {
            if (i !== type) {
                this.storeVolume.setBirdType(i, false);
            }
        }

        this.startPopUp(message);
    }

    private chooseYellowBird(): void {
        this.chooseBirdType(BirdType.Yellow, 'Chosen yellow bird!');
    }

    private chooseBlueBird(): void {
        this.chooseBirdType(BirdType.Blue, 'Chosen blue bird!');
    }

    private chooseRedBird(): void {
        this.chooseBirdType(BirdType.Red, 'Chosen red bird!');
    }

    private startPopUp(text: string): void {
        this.showText.string = text.toString();
    }
}

