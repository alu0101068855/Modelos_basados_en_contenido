import * as fs from 'fs';

export class Gestor {
  private fileContent: string;
  private file: string;
  private textByLine: string[];
  
  constructor (fichero: string){
    this.file = fichero;
    this.checkFile();
  };

  checkFile(): boolean{
    if (fs.existsSync(this.file)){
      this.fileContent = fs.readFileSync(this.file, 'utf8');
      this.textByLine = this.fileContent.split("\n");
      return true;
    }
    else {
      console.error("El archivo no existe");
      return false;
    }
  }

  getContent(): string{
    return this.fileContent;
  }

  getNumbOfLines(): number {
    return this.textByLine.length;
  }

  printContent(){
    console.log(this.fileContent);
  }

  readLine(){
    let i: number = 1;

    this.textByLine.forEach(element => {
      console.log(`[${i}] ${element}`);
      i++;
    });
  }

  getLine(i: number): string{
    if (i < 1 || i > this.textByLine.length){
      return "Número de línea inválido";
    }
    else{
      i -= 1;
      return this.textByLine[i];
    }
  }

}
