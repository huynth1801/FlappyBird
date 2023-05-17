import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { MenuController } from './MenuController';

@ccclass('Store')
export class Store extends Component {
    @property({
        type: Number
    })
    public stored: number = 1

    protected start(): void {
        
    }
}

