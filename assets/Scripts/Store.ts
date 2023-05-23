import { _decorator, CCInteger, Component, Node, CCBoolean } from "cc";
const { ccclass, property } = _decorator;

enum BirdType {
  Yellow,
  Blue,
  Red,
}

@ccclass("Store")
export class Store extends Component {
  @property({
    type: CCInteger,
  })
  private stored: Number = new Number(1);

  @property({
    type: CCBoolean,
  })
  private birdTypes: Boolean[] = [true, false, false];

  public getValue() {
    return this.stored;
  }

  public setValue(newValue: number) {
    this.stored = new Number(newValue);
  }

  public getBirdType(type: BirdType): Boolean {
    return this.birdTypes[type];
  }

  public setBirdType(type: BirdType, value: Boolean): void {
    this.birdTypes[type] = new Boolean(value);
  }
}
