import basektTemplate from './basket.html';
import * as Tools from '../../scripts/tools';

import AudioService from '../../services/audio.service';
import BasketService from '../../services/basket.service';

const Template = Tools.createElementFromHTML(basektTemplate);

export default class BasketComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback(){
    this.render();
    this.initItems();
    this.listenClick();
    this.listenBasketEvent();
    this.listenBasketAudios();
  }

  initItems(){
    // this.$audios;
    // BasketService.addAudio({an: 'AUDIO'});
    // console.log(BasketService.getAudios());
    // console.log({b: BasketService.getAudios() }); 
    this.$audios.audios = BasketService.getAudios(); 
  }

  listenClick(){
    this.addEventListener('click', event => {
      const target = event.target;
      if(target.classList.contains('exit') || target.closest('.exit')){
        this.close();
      }
    });
  }

  listenBasketEvent() {
    document.addEventListener('openBasket', event => {
      this.open();
    });
    document.addEventListener('basketAudiosUpdated', event => {
      console.log({basketAudiosUpdated: event});
      this.$audios.audios = event.detail && event.detail.audios ? event.detail.audios : [] ;
    });
  }

  listenBasketAudios(){
    document.addEventListener('basketAudiosUpdated', event => {
      console.log('basket updated');
    });
  }

  open(){
    this.classList.add('open');
  }

  close(){
    this.classList.remove('open');
  }

  async assignSelectors(){
    this.$audios = this.querySelector('audios-list');
  }

  render(){
    this.innerHTML = "";
    this.appendChild(Template);
    this.assignSelectors();
  }
}

customElements.define('my-basket', BasketComponent); 