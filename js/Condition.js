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

class Condition {
    constructor() {
        this.prefix = [];
        this.value = new Fraction();
        this.condition = '=';
    }

    static parse(str) {
        str = str.replace(/\s/g, '');
        str = str.replace('−', '-');

        let result = new Condition();

        for (let chr of str) {
            if (chr == '<' || chr == '>') {
                result.condition = chr + '=';
                break;
            } else if (chr == '=') {
                result.condition = chr;
                break;
            }
        }

        str = str.replace('<=', '=');
        str = str.replace('>=', '=');

        let strList = str.split('=');
        if (strList.length != 2) {
            return null;
        }

        result.value = new Fraction(parseInt(strList[1]));

        let tmpStr = '';
        for (let i = 0; i < strList[0].length; i++) {
            let chr = strList[0][i];

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
                while (i < strList[0].length - 1 && isDigit(strList[0][i + 1])) {
                    i++;
                    key += strList[0][i];
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

    check(points) {
        let result = false;
        let res = null;
        for (let key in this.prefix) {
            if (this.prefix[key].numerator == 0) {
                continue;
            }
            if (!res) {
                res = this.prefix[key].clone();
                res.multiply(points[key]);
            } else {
                let tmp = this.prefix[key].clone();
                tmp.multiply(points[key]);
                res.add(tmp);
            }
        }

        if (!res) {
            res = new Fraction(0);
        }

        let comp = res.compare(this.value);
        if (this.condition == '>=') {
            if (comp >= 0) {
                result = true;
            }
        } else if (this.condition == '<=') {
            if (comp <= 0) {
                result = true;
            }
        }

        return result;
    }

    toString() {
        let result = '';

        for (let key in this.prefix) {
            let value = this.prefix[key];
            if (value == 0) {
                continue;
            }

            if (value.sign() >= 0 && result.length > 0) {
                result += '+';
            }

            if (Math.abs(value.numerator) != (Math.abs(value.denominator))) {
                result += value.toString();
            } else if (value.sign() < 0) {
                result += '-';
            }
            result += key;
        }

        result += this.condition;
        result += this.value.toString();

        return result;
    }

    toLatex(eq = false) {
        let result = '';

        for (let key in this.prefix) {
            let value = this.prefix[key];
            if (value == 0) {
                continue;
            }

            if (value.sign() >= 0 && result.length > 0) {
                result += '+';
            }

            if (Math.abs(value.numerator) != (Math.abs(value.denominator))) {
                result += value.toLatex();
            } else if (value.sign() < 0) {
                result += '-';
            }
            if (key.length > 0) {
                result += key[0];
                result += '_{';
                result += key.substr(1);
                result += '}';
            } else {
                result += key;
            }
        }

        if (eq) {
            result += ' = ';
        } else if (this.condition == '<=') {
            result += ' \\leq ';
        } else if (this.condition == '>=') {
            result += ' \\geq ';
        } else {
            result += this.condition;
        }
        result += this.value.toLatex();

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
