import { Gestor } from  './gestor_ficheros'

interface wordC {
  word: string,
  wordc: string
}

export class MatrizC {
  private regex = /[{}"]/g;
  private words: string[];
  private word: string;
  public wordCA: wordC[] = [];

  constructor(contenido: Gestor){
    this.word = contenido.getContent();
    this.word = this.word.replace(this.regex, '');
    this.words = this.word.split(',');
    
    this.words.forEach(element => {
      let auxWord: wordC = {
        word: element.substring(0, element.indexOf(':')),
        wordc: element.substring(element.indexOf(':') + 1,  element.length)
      };
      this.wordCA.push(auxWord);
    });
  };

  show(){
    console.log(this.wordCA);
  }
  
}