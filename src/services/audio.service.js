const audiosPath = '/public/audios.json';

export default class AudioService {
  
  constructor(){}

  static async getAudiosList(){
    return fetch(audiosPath).then(audios => {
      return audios.json();
    });
  }

}