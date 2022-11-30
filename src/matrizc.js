"use strict";
exports.__esModule = true;
exports.MatrizC = void 0;
var MatrizC = /** @class */ (function () {
    function MatrizC(contenido) {
        var _this = this;
        this.regex = /[{}"]/g;
        this.wordCA = [];
        this.word = contenido.getContent();
        this.word = this.word.replace(this.regex, '');
        this.words = this.word.split(',');
        this.words.forEach(function (element) {
            var auxWord = {
                word: element.substring(0, element.indexOf(':')),
                wordc: element.substring(element.indexOf(':') + 1, element.length)
            };
            _this.wordCA.push(auxWord);
        });
    }
    ;
    MatrizC.prototype.show = function () {
        console.log(this.wordCA);
    };
    return MatrizC;
}());
exports.MatrizC = MatrizC;
