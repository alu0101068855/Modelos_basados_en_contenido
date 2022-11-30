import { Gestor } from './gestor_ficheros'


export class StopWords {
  private stop_words: string[] = []; 

  constructor(contenido: Gestor){
    for (let i: number = 1; i < contenido.getNumbOfLines(); i++){
      this.stop_words.push(contenido.getLine(i));
    }
  };

  getStopWords(): string[]{
    return this.stop_words;
  }
  getStopWordsLength(): number{
    return this.stop_words.length;
  }

  showString(){
    console.log(this.stop_words);
  }
}
