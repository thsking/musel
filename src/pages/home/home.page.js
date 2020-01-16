import HomeTemplate from './home.html';
import AudiosList from '../../components/audios-list/audios-list.component';

import AudioService from '../../services/audio.service';

export default class HomePage extends HTMLElement {
  constructor(){
    super();
  }
  connectedCallback (){
    this.innerHTML = HomeTemplate;
    this.fillAudiosList();
  }
  async fillAudiosList(){
    this.audiosList.audios = await AudioService.getAudiosList();
  }
  get audiosList(){
    return this.querySelector('audios-list');
  }
}

customElements.define('home-page', HomePage); 