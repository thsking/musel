import * as Tools from '../scripts/tools';

const srcPath = '/public/audios/';

export default class AudioModel {

  constructor(audio = {}) {
    this.setValues(audio);
  }

  setValues(audio = {}){
    this.id = Tools.assignOrSetDefault(audio.id, 0); // or string;
    this.title = Tools.assignOrSetDefault(audio.title, "");
    this.duration = Tools.assignOrSetDefault(audio.duration, 0); // sec
    this.price = Tools.assignOrSetDefault(audio.price, 0); // euro 00,00
    this.extraitPath =  Tools.assignOrSetDefault(audio.extraitPath, "");
    this.cover =  Tools.assignOrSetDefault(audio.cover, "");
  }

  get fullPath(){
    if(this.extraitPath)
      return `${srcPath}${this.extraitPath}`;
    return undefined;
  }

}