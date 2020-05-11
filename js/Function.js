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

class Function {
    constructor() {
        this.prefix = [];
    }

    static parse(str) {
        str = str.replace(/\s/g,'');
        str = str.replace('−', '-');
        let strList = str.split('=');
        if (strList.length != 2) {
            return null;
        }

        let result = new Function();

        result.name = strList[0];

        let tmpStr = '';
        for (let i = 0; i < strList[1].length; i++) {
            let chr = strList[1][i];

            if (isDigit(chr)) {
                tmpStr += chr;
            }
            else if (isLetter(chr)) {
                let val = 1;
                if (tmpStr.length == 1 && !isDigit(tmpStr[0])) {
                    if (tmpStr[0] == '-') {
                        val = -1;
                    }
                } else if (tmpStr.length > 0) {
                    val = parseInt(tmpStr);
                }

                let key = chr;
                while (i < strList[1].length - 1 && isDigit(strList[1][i + 1])) {
                    i++;
                    key += strList[1][i];
                }

                result.prefix[key] = new Fraction(val);
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

    calc(vars) {
        let result = new Fraction(0);

        for (let key in this.prefix) {
            let tmp = this.prefix[key].clone();
            tmp.multiply(vars[key]);
            result.add(tmp);
        }

        return result;
    }

    toString() {
        let result = '';

        result += this.name + '=';
        let first = true;
        for (let key in this.prefix) {
            let value = this.prefix[key];
            if (value == 0) {
                continue;
            }

            if (value.sign() >= 0 && !first) {
                result += '+';
            }

            if (Math.abs(value.numerator) != (Math.abs(value.denominator))) {
                result += value.toString();
            } else if (value.sign() < 0) {
                result += '-';
            }
            result += key;
            first = false;
        }

        return result;
    }

    toLatex(point = null) {
        let result = '';

        result += this.name;
        if (point) {
            result += '_{' + point + '}';
        }
        result += ' = ';
        let first = true;
        for (let key in this.prefix) {
            let value = this.prefix[key];
            if (value == 0) {
                continue;
            }

            if (value.sign() >= 0 && !first) {
                result += '+';
            }

            if (Math.abs(value.numerator) != (Math.abs(value.denominator))) {
                result += value.toLatex();
            } else if (value.sign() < 0) {
                result += '-';
            }
            if (key.length > 1) {
                result += key[0];
                result += '_{';
                result += key.substr(1);
                result += '}';
            } else {
                result += key;
            }
            first = false;
        }

        return result;
    }

    clone() {
        let obj = new Equation();
        for (let key in this.prefix) {
            obj.prefix[key] = this.prefix[key].clone();
        }
        obj.value = this.value.clone();

        return obj;
    }
};
