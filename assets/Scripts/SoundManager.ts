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
  @property(AudioSource)
  public audioSource: AudioSource = null!;

  // Sound effect for bird action
  @property({ type: AudioClip })
  private flySound: AudioClip = null;

  @property({ type: AudioClip })
  private scoreSound: AudioClip = null;

  @property({ type: AudioClip })
  private hitSound: AudioClip = null;

  @property({ type: AudioClip })
  private dieSound: AudioClip = null;

  playSound(soundType: SoundType) {
    switch (soundType) {
      case SoundType.Fly:
        this.audioSource.playOneShot(this.flySound, 1);
        break;
      case SoundType.Score:
        this.audioSource.playOneShot(this.scoreSound, 1);
        break;
      case SoundType.Die:
        this.audioSource.playOneShot(this.dieSound, 1);
        break;
      case SoundType.Hit:
        this.audioSource.playOneShot(this.hitSound, 1);
        break;
    }
  }
}
