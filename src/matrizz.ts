import { Gestor } from './gestor_ficheros'
import { StopWords }  from './stopWords'

interface wordF {
  word: string,
  rep: number
}

export class Matriz {
  private regex = /[.,;:?\s]/g;
  private words: string[];
  private matrixInicial: string [][] = [];
  private matrixSinStop: string [][] = [];
  private unicos: string[] = [];
  private vectorTF: wordF[][] = [];
  private IDF: number [][]= [];
  private vectorTFIDF: number[][] = [];
  private matrixCoseno: number[][] = [];
  private matrizsimilitudDocumentos: number[][]  = [];

  constructor(contenido: Gestor){
    for (let i: number = 1; i <= contenido.getNumbOfLines(); i++){
      let filas: string = contenido.getLine(i);
      this.words = filas.split(' ');
      for (let i: number = 0; i != this.words.length; i++){
        // Eliminar puntos, comas, etc
        this.words[i] = this.words[i].replace(this.regex, '');
        // Poner palabras en minuscula
        this.words[i] = this.words[i].toLowerCase();
      }
       // Elimina "palabras" vacías
      let index = this.words.indexOf('', 0);
      if(index > -1){
        this.words.splice(index, 1);
      }
      this.matrixInicial[i-1]= this.words;
    }
  };

  deleteStopWords(stopW: StopWords, file: string){
    let vectorStop: string[] = stopW.getStopWords();
    // Mapeamos los valores y los cambiamos 
    let map = new Map(Object.entries(JSON.parse(file)));

    for (let i: number = 0; i < this.matrixInicial.length; i++){
      for (let j: number = 0; j < this.matrixInicial[i].length; j++){
        if(map.has(this.matrixInicial[i][j])){
          this.matrixInicial[i][j] = String(map.get(this.matrixInicial[i][j]));
        }
      }
    }

    for (let i: number = 0; i < this.matrixInicial.length; i++){
      let fila: string[] = [];
      for (let j: number = 0; j < this.matrixInicial[i].length; j++){
        for (let k: number = 0; k < stopW.getStopWordsLength(); k++){
          if(this.matrixInicial[i][j] === vectorStop[k]){

            this.matrixInicial[i][j] = '-';
          }
        }
        if (this.matrixInicial[i][j] != '-'){
          fila.push(this.matrixInicial[i][j]);
        }
      }
      this.matrixSinStop.push(fila);
    }
  }

  sinRepetir(){
    this.unicos.push(this.matrixSinStop[0][0]);
    let repetido: number = 0;
    for (let i: number = 0; i < this.matrixSinStop.length; i++){
      for (let j: number = 0; j < this.matrixSinStop[i].length; j++){
        for (let k: number = 0; k < this.unicos.length; k++){
          if(this.matrixSinStop[i][j] == this.unicos[k]){
            repetido++;
          }
        }
        if(repetido == 0){
          this.unicos.push(this.matrixSinStop[i][j]);
        }
        repetido = 0;
      }
    }
  }

  calculoTF(){
    for (let i: number = 0; i < this.matrixSinStop.length; i++){
      let repetidos = {};
      let filaVectorTF: wordF[] = [];
      this.matrixSinStop[i].forEach(function(numero){
        repetidos[numero] = (repetidos[numero] || 0) + 1;
        let auxWord: wordF = {
          word: numero,
          rep: repetidos[numero]
        };
        if (repetidos[numero] > 1){
          for(let i: number = 0; i < filaVectorTF.length; i++){
            if(numero == filaVectorTF[i].word && repetidos[numero]-1 == filaVectorTF[i].rep){
              filaVectorTF.splice(i,1);
            } 
          }
        }
        filaVectorTF.push(auxWord);
      });
      this.vectorTF.push(filaVectorTF);
    }
  }

  calculoIDF(){
    let N: number = this.matrixSinStop.length;
    let dfX: number[][] = [];
    for (let i: number = 0; i < this.vectorTF.length; i++){
      let contadorPalabraFila: number[] = [];
      for (let j: number = 0; j < this.vectorTF[i].length; j++){
        let contPalabra: number = 0;
        for (let k : number = 0; k < this.vectorTF.length; k++){
          let palabraVecesFila = this.vectorTF[k].filter(palabra => palabra.word == this.vectorTF[i][j].word);
          if (palabraVecesFila.length > 0){
           contPalabra++;
          }
        }
        contadorPalabraFila.push(contPalabra);
      }
      dfX.push(contadorPalabraFila);
    }
    for (let i: number = 0; i < dfX.length; i++){
      let idfFila: number[] = [];
      for (let j: number = 0; j < dfX[i].length; j++){
        idfFila.push(Number(Math.log10(N/dfX[i][j]).toFixed(3)));
      }
      this.IDF.push(idfFila);
    }
    
  }

  calculoTFIDF(){
    for (let i: number = 0; i < this.IDF.length; i++){
      let filaTFIDF: number[] = [];
      for (let j: number = 0; j < this.IDF[i].length; j++){
        filaTFIDF.push(this.vectorTF[i][j].rep * this.IDF[i][j]);
      }
      this.vectorTFIDF.push(filaTFIDF);
    }
  }

  calculoSimilitudCoseno(doc1: number, doc2: number): number{
    let numerador: number = 0;
    let denominadorIzq: number = 0;
    let denominadorDrch: number = 0;
    for(let i: number = 0; i < this.unicos.length; i++){
    /* if(isNaN(this.matrizsimilitudDocumentos[doc1][i]) && isNaN(this.matrizsimilitudDocumentos[doc1][i]))  {
     break;
     }
     else if ( isNaN(this.matrizsimilitudDocumentos[doc2][i])){
      numerador += (this.matrizsimilitudDocumentos[doc1][i] * 0);
      denominadorIzq += Math.pow(this.matrizsimilitudDocumentos[doc1][i],2);
     }
     else if (isNaN(this.matrizsimilitudDocumentos[doc1][i])){
      numerador += (0 * this.matrizsimilitudDocumentos[doc2][i]);
      denominadorDrch += Math.pow(this.matrizsimilitudDocumentos[doc2][i],2);
     }
     else {*/
      numerador += (this.matrizsimilitudDocumentos[doc1][i] * this.matrizsimilitudDocumentos[doc2][i]);
      denominadorIzq += Math.pow(this.matrizsimilitudDocumentos[doc1][i],2);
      denominadorDrch += Math.pow(this.matrizsimilitudDocumentos[doc2][i],2);
     //}
    }
    let denominador: number  = Math.sqrt(denominadorDrch) * Math.sqrt(denominadorIzq);
    return Number((numerador/denominador).toFixed(3));
  }
    
  MatrixCoseno(){
    for(let i: number = 0; i < this.matrixSinStop.length; i++){
      let vectorAux: number[] = [];
      for(let j: number = 0; j < this.matrixSinStop.length; j++){
        vectorAux.push(0);
      }
      this.matrixCoseno.push(vectorAux)
    }
    for(let i: number = 0; i < this.matrixCoseno.length; i++){
      for(let j: number = 0; j < this.matrixCoseno[i].length; j++){
        this.matrixCoseno[i][j] = this.calculoSimilitudCoseno(i,j);
      }
    }
  }
  showMatrixCoseno(){
    console.log('Similitud entre documentos','\n');
    let docs: string= '\t';
    for(let i: number = 0; i < this.matrixCoseno.length; i++){
      docs = docs.concat(`Doc${i}\t`);
    } 
    console.log(docs);
    for (let i: number = 0; i < this.matrixCoseno.length; i++){
      let documento: string = `Doc${i}`;
      for (let j: number = 0; j < this.matrixCoseno[i].length; j++){
        documento = documento.concat(`\t${this.matrixCoseno[i][j]}`);
      }
      console.log(documento);
    }
  }

  showMatrixInicial(){
    console.log(this.matrixInicial);
  } 

  showUnicos(){
    console.log(this.unicos);
  } 

  showMatrixISinStop(){
    console.log(this.matrixSinStop);
  }

  calculoSimilitudDocumentos(){
    let indice: number = 0;
    for (let i: number = 0; i < this.vectorTF.length; i++){
      for (let j: number = 0; j < this.vectorTF[i].length; j++){
        indice = this.unicos.indexOf(this.vectorTF[i][j].word);
        this.matrizsimilitudDocumentos[i][indice] = this.vectorTFIDF[i][j];
      }
    }
  }

  similitudDocumentos(){
    for(let i: number = 0; i < this.matrixSinStop.length; i++){
      let vectorAux: number[] = [];
      for(let j: number = 0; j < this.unicos.length; j++){
        vectorAux.push(0);
      }
      this.matrizsimilitudDocumentos.push(vectorAux)
    }
    this.calculoSimilitudDocumentos();
  }

  showMatrixSimilitud(){
    for (let i: number = 0; i < this.IDF.length; i++){
      console.log('Documento ', i,'\n');
      console.log('Índice\t','\tTérmino\t\t','TF\t', 'IDF\t', 'TF-IDF\t');
      let cont: number = 1;
      for (let j: number = 0; j < this.IDF[i].length; j++){
        let docs: string= '';
        let docs2: string= '';
        docs = docs.concat(`${cont++}    \t${this.vectorTF[i][j].word.padStart(15)}`);
        docs2 = docs2.concat(`${this.vectorTF[i][j].rep}\t ${this.IDF[i][j]}\t${this.vectorTFIDF[i][j]}\t`);
        console.log(docs, '\t', docs2);
      }
      console.log('\n\n');
    }
  }
}
