import { _decorator, CCInteger, Component, Node, CCBoolean } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Store')
export class Store extends Component {
    @property({
        type: CCInteger
    })
    private stored: Number = new Number(1)

    @property({
        type : CCBoolean
    })
    private yellowBird: Boolean = true
    @property({
        type : CCBoolean
    })
    private blueBird: Boolean = false
    @property({
        type : CCBoolean
    })
    private redBird: Boolean = false

    getValue() {
        return this.stored
    }

    setValue(newValue: number) {
        this.stored = new Number(newValue);
    }

    getYellow() {
        return this.yellowBird
    }

    setYellow(yellow: boolean) {
        this.yellowBird = new Boolean(yellow)
    }

    getRed() {
        return this.redBird
    }

    setRed(red: boolean) {
        this.redBird = new Boolean(red)
    }

    getBlue() {
        return this.blueBird
    }

    setBlue(blue: boolean) {
        this.blueBird = new Boolean(blue)
    }
}
