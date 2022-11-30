"use strict";
exports.__esModule = true;
exports.StopWords = void 0;
var StopWords = /** @class */ (function () {
    function StopWords(contenido) {
        this.stop_words = [];
        for (var i = 1; i < contenido.getNumbOfLines(); i++) {
            this.stop_words.push(contenido.getLine(i));
        }
    }
    ;
    StopWords.prototype.getStopWords = function () {
        return this.stop_words;
    };
    StopWords.prototype.getStopWordsLength = function () {
        return this.stop_words.length;
    };
    StopWords.prototype.showString = function () {
        console.log(this.stop_words);
    };
    return StopWords;
}());
exports.StopWords = StopWords;
