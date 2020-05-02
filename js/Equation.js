/*
 * This file is part of MatematikaKolokvijum1 project (https://github.com/zivlakmilos/MatematikaKolokvijum1) for solving math midtearm exam 1.
 * Copyright (c) 2020 Miloš Zivlak (milos@zivlak.rs).
 * 
 * This program is free software: you can redistribute it and/or modify  
 * it under the terms of the GNU General Public License as published by  
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License 
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

class Equation {
    constructor() {
        this.prefix = [];
        this.value = 0;
    }

    static parse(str) {
        str = str.replace(/\s/g,'');
        let strList = str.split('=');
        if (strList.length != 2) {
            return null;
        }

        let result = new Equation();

        result.value = new Fraction(parseInt(strList[1]));

        let tmpStr = '';
        for (let chr of strList[0]) {
            if (isDigit(chr)) {
                tmpStr += chr;
            }
            else if (isLetter(chr)) {
                let val = 1;
                if (tmpStr.length == 1 && !isDigit(tmpStr[0])) {
                    if (tmpStr[0] == '-') {
                        val = -1;
                    }
                } else if (tmpStr.length != 0) {
                    val = parseInt(tmpStr);
                }

                result.prefix[chr] = new Fraction(val);
                tmpStr = '';
            }
            else if (chr == '+' || chr == '-') {
                if (tmpStr.length == 0) {
                    tmpStr += chr;
                }
            }
        }

        return result;
    }

    multiply(rhs) {
        for (let key in this.prefix) {
            this.prefix[key].multiply(rhs);
        }
        this.value.multiply(rhs);
    }

    divide(rhs) {
        for (let key in this.prefix) {
            this.prefix[key].divide(rhs);
        }
        this.value.divide(rhs);
    }

    add(rhs) {
        for (let key in this.prefix) {
            this.prefix[key].add(rhs.prefix[key]);
        }
        this.value.add(rhs.value);
    }

    subtract(rhs) {
        for (let key in this.prefix) {
            this.prefix[key].subtract(rhs.prefix[key]);
        }
        this.value.subtract(rhs.value);
    }

    toString() {
        let result = '';

        for (let key in this.prefix) {
            let value = this.prefix[key];
            if (value.sign() >= 0 && result.length > 0) {
                result += '+';
            }

            if (Math.abs(value.numerator) != (Math.abs(value.denominator))) {
                result += value.toString();
            }
            result += key;
        }

        result += '=';
        result += this.value.toString();

        return result;
    }

    toLatex() {
        let result = '';

        for (let key in this.prefix) {
            let value = this.prefix[key];
            if (value.sign() >= 0 && result.length > 0) {
                result += '+';
            }

            if (Math.abs(value.numerator) != (Math.abs(value.denominator))) {
                result += value.toLatex();
            }
            result += key;
        }

        result += '=';
        result += this.value.toLatex();

        return result;
    }
};
