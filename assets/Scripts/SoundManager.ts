import { _decorator, Component, Node, AudioClip, AudioSource } from "cc";
const { ccclass, property } = _decorator;

export enum SoundType {
  Fly = 0,
  Score,
  Die,
  Hit,
}

@ccclass("SoundManager")
export class SoundManager extends Component {
  @property({
    type: AudioSource
})
  public audioSource: AudioSource = null;

  // Sound effect for bird action
  @property({ type: AudioClip })
  private flySound: AudioClip = null;

  @property({ type: AudioClip })
  private scoreSound: AudioClip = null;

  @property({ type: AudioClip })
  private hitSound: AudioClip = null;

  @property({ type: AudioClip })
  private dieSound: AudioClip = null;

  public playSound(soundType: SoundType): void {
    if (soundType === SoundType.Fly) {
      this.audioSource.playOneShot(this.flySound, 1);
    } else if (soundType === SoundType.Score) {
      this.audioSource.playOneShot(this.scoreSound, 1);
    } else if (soundType === SoundType.Die) {
      this.audioSource.playOneShot(this.dieSound, 1);
    } else {
      this.audioSource.playOneShot(this.hitSound, 1);
    }
  }
}
