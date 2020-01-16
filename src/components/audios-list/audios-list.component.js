import audioListTemplate from './audios-list.html';
import * as Tools from '../../scripts/tools';
import BasketService from '../../services/basket.service';
import AudioModel from '../../models/audio.model';

const Template = Tools.createElementFromHTML(audioListTemplate);

export default class AudiosListComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this._audios = [];
    this.render();
    this.listenClick();
    this.listenAudioPlayingEvent();
  }

  get audios() {
    return this._audios;
  }

  set audios(audios) {
    this._audios = audios;
    this.render();
  }

  get type() {
    if (this.classList.contains('removable'))
      return 'removable';
    return 'addable';
  }

  listenClick() {
    this.addEventListener('click', event => {
      let target = event.target;

      if (target.classList.contains('play') || target.closest('.play')) {
        let $audioItem = target.closest('.audios-list-item');
        let audioId = $audioItem && $audioItem.dataset.audioId ? $audioItem.dataset.audioId : undefined;

        if (audioId && this._audios[audioId]) {
          Tools.createCustomEvent(document, 'clickAudioPlay', { audio: this._audios[audioId] });
        }
      }

      else if (target.classList.contains('add-to-cart') || target.closest('.add-to-cart')) {
        let audioFound = this.getAudioFromTarget(target);
        audioFound 
          ? BasketService.addAudio(new AudioModel(audioFound))
          : console.warn('Can not find the the audio containing the add-to-cart btn');
      }

      else if (target.classList.contains('remove-from-cart') || target.closest('.remove-from-cart')) {
        let audioFound = this.getAudioFromTarget(target);
        audioFound 
          ? BasketService.removeAudio(new AudioModel(audioFound))
          : console.warn('Can not find the the audio containing the add-to-cart btn');
      }


    });
  }

  getAudioFromTarget(target) {
    if (target && target.classList) {
      let $audioItem = target.classList.contains('audios-list-item')
        ? target.classList.contains('audios-list-item')
        : target.closest('.audios-list-item');

      if ($audioItem && $audioItem.id) {
        let audio = this.getAudioFromAudioId($audioItem.id);
        if (audio) return audio;
      }
    }
    return null;
  }

  getAudioFromAudioId(audioId) {
    let audio = this._audios.filter(ad => {
      if (ad.selectorId === audioId) return ad;
      if (ad.id === audioId) return ad;
    });
    if (audio.length > 0)
      return audio[0];
    return null;
  }

  showCurrentPlaying(audio, playing = true) {
    let $item = this.querySelector(`#${audio.selectorId}`);
    let $playBtn = $item.querySelector('.play');

    if (playing) {
      $playBtn.textContent = "pause_circle_filled";
    }
    else {
      $playBtn.textContent = "play_circle_filled";
    }
  }

  listenAudioPlayingEvent() {
    document.addEventListener('audioIsPlaying', event => {
      let audio = event.detail.audio;
      let audioId = audio && audio.dataset.audioId ? audio.dataset.audioId : undefined;
      let audioObj = audioId ? this._audios.filter(ad => ad.id === audioId) : undefined; // need to get id to find it on the html
      if (audioObj && audioObj[0])
        this.showCurrentPlaying(audioObj[0]);
    });
    document.addEventListener('audioIsPaused', event => {
      let audio = event.detail.audio;
      let audioId = audio && audio.dataset.audioId ? audio.dataset.audioId : undefined;
      let audioObj = audioId ? this._audios.filter(ad => ad.id === audioId) : undefined; // need to get id to find it on the html
      if (audioObj && audioObj[0])
        this.showCurrentPlaying(audioObj[0], false);
    });
  }

  createSelectorIdForAudio(audio, id) {
    const temporalId = `ali-${id}-${audio.id}`;
    const eltFound = document.querySelector("#" + temporalId);
    if (eltFound) {
      let newNameFound = false;
      while (!newNameFound) {
        const randomId = Tools.getRandomInt(1, 200000);
        const newName = `${temporalId}-${randomId}`;
        if (!document.querySelector(`#${newName}`)) {
          return newName;
        }
      }
    }
    else return temporalId;
  }

  render() {
    let fragment = document.createDocumentFragment();
    for (let [id, audio] of Object.entries(this._audios)) {
      let itemHtml = Template.cloneNode(true);
      let selectorId = this.createSelectorIdForAudio(audio, id);
      itemHtml.querySelector('.audio-title').textContent = audio.title;
      itemHtml.querySelector('.audio-duration').textContent = Tools.secondeToMinute(audio.duration);
      itemHtml.querySelector('.audio-price').textContent = audio.price + " €";
      itemHtml.dataset.audioId = id;
      itemHtml.setAttribute('id', selectorId);
      fragment.appendChild(itemHtml);
      this._audios[id].selectorId = selectorId;
    }
    this.innerHTML = "";
    this.appendChild(fragment);
  }
}

customElements.define('audios-list', AudiosListComponent); 