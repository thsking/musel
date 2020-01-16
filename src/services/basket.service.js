import * as Tools from '../scripts/tools';

const Storage = window.localStorage;
const audioName = 'bsk-audios';

export default class BasketService {
  
  constructor(){}

  static addAudio(audio){
    let audios = BasketService.getAudios();
    let audioFound = audios.filter(ad => ad.id === audio.id);
    if(audioFound.length === 0){
      audios.push(audio);
      BasketService.saveAudios(audios);
      Tools.createCustomEvent(document, 'basketAudioAdded', {audio});
    }
    else console.warn('We dont add audio already existing in the basket');
  }

  static removeAudio(audio){
    let audios = BasketService.getAudios(audioName);
    for(let [id, ad] of Object.entries(audios)){
      if(ad.id === audio.id){
        audios.splice(parseInt(id), 1);
      }
    }
    BasketService.saveAudios(audios);
    Tools.createCustomEvent(document, 'basketAudioRemoved', {audio});
  }

  static getAudios(){
    let audios = Storage.getItem(audioName);
    try {
      audios = JSON.parse(audios);
    } catch (error) {
      console.warn('can not parse audio', {error, audios});
      audios = [];
    }
    return audios ? audios : [];
  }

  static clearAudios(){
    BasketService.saveAudios([]);
  }

  static saveAudios(audios){
    Storage.setItem(audioName, JSON.stringify(audios));
    Tools.createCustomEvent(document, 'basketAudiosUpdated', {audios});
  }

}