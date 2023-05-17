import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { MenuController } from './MenuController';

@ccclass('Store')
export class Store extends Component {
    @property({
        type: Number
    })
    private stored: number = 1

    getValue() {
        return this.stored
    }

    setValue(newValue: number) {
        this.stored = newValue;
    }
}

