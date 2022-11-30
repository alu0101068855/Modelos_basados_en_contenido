"use strict";
exports.__esModule = true;
exports.Matriz = void 0;
var Matriz = /** @class */ (function () {
    function Matriz(contenido) {
        this.regex = /[.,;:?\s]/g;
        this.matrixInicial = [];
        this.matrixSinStop = [];
        this.unicos = [];
        this.vectorTF = [];
        this.IDF = [];
        this.vectorTFIDF = [];
        this.matrixCoseno = [];
        this.matrizsimilitudDocumentos = [];
        for (var i = 1; i <= contenido.getNumbOfLines(); i++) {
            var filas = contenido.getLine(i);
            this.words = filas.split(' ');
            for (var i_1 = 0; i_1 != this.words.length; i_1++) {
                // Eliminar puntos, comas, etc
                this.words[i_1] = this.words[i_1].replace(this.regex, '');
                // Poner palabras en minuscula
                this.words[i_1] = this.words[i_1].toLowerCase();
            }
            // Elimina "palabras" vacías
            var index = this.words.indexOf('', 0);
            if (index > -1) {
                this.words.splice(index, 1);
            }
            this.matrixInicial[i - 1] = this.words;
        }
    }
    ;
    Matriz.prototype.deleteStopWords = function (stopW, file) {
        var vectorStop = stopW.getStopWords();
        // Mapeamos los valores y los cambiamos 
        var map = new Map(Object.entries(JSON.parse(file)));
        for (var i = 0; i < this.matrixInicial.length; i++) {
            for (var j = 0; j < this.matrixInicial[i].length; j++) {
                if (map.has(this.matrixInicial[i][j])) {
                    this.matrixInicial[i][j] = String(map.get(this.matrixInicial[i][j]));
                }
            }
        }
        for (var i = 0; i < this.matrixInicial.length; i++) {
            var fila = [];
            for (var j = 0; j < this.matrixInicial[i].length; j++) {
                for (var k = 0; k < stopW.getStopWordsLength(); k++) {
                    if (this.matrixInicial[i][j] === vectorStop[k]) {
                        this.matrixInicial[i][j] = '-';
                    }
                }
                if (this.matrixInicial[i][j] != '-') {
                    fila.push(this.matrixInicial[i][j]);
                }
            }
            this.matrixSinStop.push(fila);
        }
    };
    Matriz.prototype.sinRepetir = function () {
        this.unicos.push(this.matrixSinStop[0][0]);
        var repetido = 0;
        for (var i = 0; i < this.matrixSinStop.length; i++) {
            for (var j = 0; j < this.matrixSinStop[i].length; j++) {
                for (var k = 0; k < this.unicos.length; k++) {
                    if (this.matrixSinStop[i][j] == this.unicos[k]) {
                        repetido++;
                    }
                }
                if (repetido == 0) {
                    this.unicos.push(this.matrixSinStop[i][j]);
                }
                repetido = 0;
            }
        }
    };
    Matriz.prototype.calculoTF = function () {
        var _loop_1 = function (i) {
            var repetidos = {};
            var filaVectorTF = [];
            this_1.matrixSinStop[i].forEach(function (numero) {
                repetidos[numero] = (repetidos[numero] || 0) + 1;
                var auxWord = {
                    word: numero,
                    rep: repetidos[numero]
                };
                if (repetidos[numero] > 1) {
                    for (var i_2 = 0; i_2 < filaVectorTF.length; i_2++) {
                        if (numero == filaVectorTF[i_2].word && repetidos[numero] - 1 == filaVectorTF[i_2].rep) {
                            filaVectorTF.splice(i_2, 1);
                        }
                    }
                }
                filaVectorTF.push(auxWord);
            });
            this_1.vectorTF.push(filaVectorTF);
        };
        var this_1 = this;
        for (var i = 0; i < this.matrixSinStop.length; i++) {
            _loop_1(i);
        }
    };
    Matriz.prototype.calculoIDF = function () {
        var _this = this;
        var N = this.matrixSinStop.length;
        var dfX = [];
        var _loop_2 = function (i) {
            var contadorPalabraFila = [];
            var _loop_3 = function (j) {
                var contPalabra = 0;
                for (var k = 0; k < this_2.vectorTF.length; k++) {
                    var palabraVecesFila = this_2.vectorTF[k].filter(function (palabra) { return palabra.word == _this.vectorTF[i][j].word; });
                    if (palabraVecesFila.length > 0) {
                        contPalabra++;
                    }
                }
                contadorPalabraFila.push(contPalabra);
            };
            for (var j = 0; j < this_2.vectorTF[i].length; j++) {
                _loop_3(j);
            }
            dfX.push(contadorPalabraFila);
        };
        var this_2 = this;
        for (var i = 0; i < this.vectorTF.length; i++) {
            _loop_2(i);
        }
        for (var i = 0; i < dfX.length; i++) {
            var idfFila = [];
            for (var j = 0; j < dfX[i].length; j++) {
                idfFila.push(Number(Math.log10(N / dfX[i][j]).toFixed(3)));
            }
            this.IDF.push(idfFila);
        }
    };
    Matriz.prototype.calculoTFIDF = function () {
        for (var i = 0; i < this.IDF.length; i++) {
            var filaTFIDF = [];
            for (var j = 0; j < this.IDF[i].length; j++) {
                filaTFIDF.push(this.vectorTF[i][j].rep * this.IDF[i][j]);
            }
            this.vectorTFIDF.push(filaTFIDF);
        }
    };
    Matriz.prototype.calculoSimilitudCoseno = function (doc1, doc2) {
        var numerador = 0;
        var denominadorIzq = 0;
        var denominadorDrch = 0;
        for (var i = 0; i < this.unicos.length; i++) {
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
            denominadorIzq += Math.pow(this.matrizsimilitudDocumentos[doc1][i], 2);
            denominadorDrch += Math.pow(this.matrizsimilitudDocumentos[doc2][i], 2);
            //}
        }
        var denominador = Math.sqrt(denominadorDrch) * Math.sqrt(denominadorIzq);
        return Number((numerador / denominador).toFixed(3));
    };
    Matriz.prototype.MatrixCoseno = function () {
        for (var i = 0; i < this.matrixSinStop.length; i++) {
            var vectorAux = [];
            for (var j = 0; j < this.matrixSinStop.length; j++) {
                vectorAux.push(0);
            }
            this.matrixCoseno.push(vectorAux);
        }
        for (var i = 0; i < this.matrixCoseno.length; i++) {
            for (var j = 0; j < this.matrixCoseno[i].length; j++) {
                this.matrixCoseno[i][j] = this.calculoSimilitudCoseno(i, j);
            }
        }
    };
    Matriz.prototype.showMatrixCoseno = function () {
        console.log('Similitud entre documentos', '\n');
        var docs = '\t';
        for (var i = 0; i < this.matrixCoseno.length; i++) {
            docs = docs.concat("Doc".concat(i, "\t"));
        }
        console.log(docs);
        for (var i = 0; i < this.matrixCoseno.length; i++) {
            var documento = "Doc".concat(i);
            for (var j = 0; j < this.matrixCoseno[i].length; j++) {
                documento = documento.concat("\t".concat(this.matrixCoseno[i][j]));
            }
            console.log(documento);
        }
    };
    Matriz.prototype.showMatrixInicial = function () {
        console.log(this.matrixInicial);
    };
    Matriz.prototype.showUnicos = function () {
        console.log(this.unicos);
    };
    Matriz.prototype.showMatrixISinStop = function () {
        console.log(this.matrixSinStop);
    };
    Matriz.prototype.calculoSimilitudDocumentos = function () {
        var indice = 0;
        for (var i = 0; i < this.vectorTF.length; i++) {
            for (var j = 0; j < this.vectorTF[i].length; j++) {
                indice = this.unicos.indexOf(this.vectorTF[i][j].word);
                this.matrizsimilitudDocumentos[i][indice] = this.vectorTFIDF[i][j];
            }
        }
    };
    Matriz.prototype.similitudDocumentos = function () {
        for (var i = 0; i < this.matrixSinStop.length; i++) {
            var vectorAux = [];
            for (var j = 0; j < this.unicos.length; j++) {
                vectorAux.push(0);
            }
            this.matrizsimilitudDocumentos.push(vectorAux);
        }
        this.calculoSimilitudDocumentos();
    };
    Matriz.prototype.showMatrixSimilitud = function () {
        for (var i = 0; i < this.IDF.length; i++) {
            console.log('Documento ', i, '\n');
            console.log('Índice\t', '\tTérmino\t\t', 'TF\t', 'IDF\t', 'TF-IDF\t');
            var cont = 1;
            for (var j = 0; j < this.IDF[i].length; j++) {
                var docs = '';
                var docs2 = '';
                docs = docs.concat("".concat(cont++, "    \t").concat(this.vectorTF[i][j].word.padStart(15)));
                docs2 = docs2.concat("".concat(this.vectorTF[i][j].rep, "\t ").concat(this.IDF[i][j], "\t").concat(this.vectorTFIDF[i][j], "\t"));
                console.log(docs, '\t', docs2);
            }
            console.log('\n\n');
        }
    };
    return Matriz;
}());
exports.Matriz = Matriz;
