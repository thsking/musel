import home from '../pages/home/home.page.js';
import playerAudio from '../components/player-audio/player-audio.component';
import basket from '../components/basket/basket.component';

export default class App {
  constructor(){
    this.innerHTML = `
      <home-page></home-page>
      <player-audio></player-audio>
      <my-basket></my-basket>
    `;
  }
  get innerHTML(){
    return document.querySelector('app');
  }
  set innerHTML(content){
    this.innerHTML.innerHTML = content;
  }
}