import playerAudioTemplate from './player-audio.html';
import * as Tools from '../../scripts/tools';
import AudioModel from '../../models/audio.model';

const Template = Tools.createElementFromHTML(playerAudioTemplate);

export default class PlayerAudioComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listenClick();
    this.listenClickPlayAudio();
  }

  playAudio(audio) {
    let audioToRead = new AudioModel(audio);
    if (audioToRead instanceof AudioModel) {
      this.audio = audioToRead;
      this.currentAudio = audioToRead;
      this.play();
    }
  }

  listenClick() {
    this.addEventListener('click', event => {
      const target = event.target;
      if (target.classList.contains('player-btn-toggle-play') || target.closest('.player-btn-toggle-play')) {
        this.togglePlay();
      }
      else if (target.classList.contains('player-btn-prev') || target.closest('.player-btn-prev')) {
        console.log('listen prev song');
      }
      else if (target.classList.contains('player-btn-next') || target.closest('.player-btn-next')) {
        console.log('listen next song');
      }
      else if (target.classList.contains('player-progress-bar') || target.closest('.player-progress-bar')) {
        this.clickOnPosition(event);
      }
      else if (target.classList.contains('basket-btn') || target.closest('.basket-btn')){
        Tools.createCustomEvent(document, 'openBasket');
      }
    });
  }

  listenClickPlayAudio() {
    document.addEventListener('clickAudioPlay', event => {
      if (event.detail && event.detail.audio) {
        if (this.audioPlaying && event.detail.audio.id === this.audioPlaying.dataset.audioId) {

          if (this.audioPlaying && this.audioPlaying.paused)
            this.play();
          else
            this.stop();

        } else {
          this.playAudio(event.detail.audio);
        }

      }
    });
  }

  set audio(audio) {
    this.stop();
    this.audioPlaying = new Audio(audio.fullPath);
    this.audioPlaying.dataset.audioId = audio.id;
    this.updateInfos(audio);
    this.play();
  }

  stop() {
    if (this.audioPlaying) {
      this.audioPlaying.pause();
    }
    this.$btnTogglePlay.textContent = 'play_circle_outline';
    Tools.createCustomEvent(document, 'audioIsPaused', { audio: this.audioPlaying });
  }

  play(from = undefined) {
    if (this.audioPlaying) {
      if (from) {
        this.audioPlaying.currentTime = from;
      }
      this.audioPlaying.play();
      this.audioPlaying.ontimeupdate = () => this.audioOnPlaying();
      Tools.createCustomEvent(document, 'audioIsPlaying', { audio: this.audioPlaying });
    }
    this.$btnTogglePlay.textContent = 'pause_circle_outline';
  }

  updateInfos(audio) {
    this.$title.textContent = audio.title;
    this.$price.textContent = audio.price;
    this.$totalDuration.textContent = Tools.secondeToMinute(audio.duration);
  }

  togglePlay() {
    if (this.audioPlaying && this.audioPlaying.paused) {
      this.play();
    } else {
      this.stop();
    }
  }

  audioOnPlaying(event) {
    let currentPos =
      Math.floor(this.audioPlaying.currentTime)
      / Math.floor(this.audioPlaying.duration)
      * 100;
    this.$progressBarCurrent.style.width = `${currentPos}%`;
    this.$currentTime.textContent = Tools.secondeToMinute(parseInt(this.audioPlaying.currentTime));
  }

  clickOnPosition(event) {
    let newOffet = event.offsetX;
    let progressBarWidth = this.$progressBar.offsetWidth;
    let percentage = parseInt((newOffet / progressBarWidth) * 100);

    if (this.audioPlaying && this.audioPlaying.duration) {
      let sec = this.audioPlaying.duration / 100 * percentage;
      this.play(sec);
    }
  }

  assignSelectors() {
    this.$btnTogglePlay = this.querySelector('.player-btn-toggle-play');
    this.$btnNext = this.querySelector('.player-btn-next');
    this.$btnPrev = this.querySelector('.player-btn-prev');
    this.$progressBar = this.querySelector('.player-progress-bar');
    this.$progressBarCurrent = this.querySelector('.player-progress-bar-current');
    this.$currentTime = this.querySelector('.player-progress-time-now');
    this.$title = this.querySelector('.title');
    this.$price = this.querySelector('.price');
    this.$totalDuration = this.querySelector('.player-progress-total');
  }

  render() {
    this.innerHTML = "";
    this.appendChild(Template);
    this.assignSelectors();
  }

}

customElements.define('player-audio', PlayerAudioComponent); 