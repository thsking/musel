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
  }

  initItems(){
    this.$audios.audios = BasketService.getAudios(); 
    this.calculeTotalPrice();
  }

  listenClick(){
    this.addEventListener('click', event => {
      const target = event.target;
      if(target.classList.contains('exit') || target.closest('.exit')){
        this.close();
      }
      if(target.classList.contains('clear-basket-btn') || target.closest('.clear-basket-btn')){
        this.clearBasket();
      }
    });
  }

  listenBasketEvent() {
    document.addEventListener('openBasket', event => {
      this.open();
    });
    document.addEventListener('basketAudiosUpdated', event => {
      this.$audios.audios = event.detail && event.detail.audios ? event.detail.audios : [] ;
      this.calculeTotalPrice();
    });
  }

  calculeTotalPrice(){
    let somme = 0;
    for(let audio of this.$audios.audios){
      somme += parseInt(audio.price);
    }
    this.$totalPrice.textContent = somme + " €";
  }

  clearBasket(){
    BasketService.clearAudios();
  }

  open(){
    this.classList.add('open');
  }

  close(){
    this.classList.remove('open');
  }

  async assignSelectors(){
    this.$audios = this.querySelector('audios-list');
    this.$totalPrice = this.querySelector('.total-price');
  }

  render(){
    this.innerHTML = "";
    this.appendChild(Template);
    this.assignSelectors();
  }
}

customElements.define('my-basket', BasketComponent); 