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

class Fraction {
    constructor(numerator = 0, denominator = 1) {
        this.numerator = numerator;
        this.denominator = denominator;
    }

    sign() {
        if ((this.numerator >= 0 && this.denominator >= 0) || (this.numerator < 0 && this.denominator < 0)) {
            return 1;
        } else {
            return -1;
        }
    }

    simplify() {
        let gcd = this.calcGCD(this.numerator, this.denominator);
        this.numerator /= gcd;
        this.denominator /= gcd;
    }

    reciprocal() {
        let tmp = this.numerator;
        this.denominator = this.numerator;
        this.numerator = tmp;
    }

    multiply(rhs) {
        if (this.numerator == 0 || rhs.denominator == 0) {
            this.numerator = 0;
            this.denominator = 1;
            return;
        }

        this.numerator *= rhs.numerator;
        this.denominator *= rhs.denominator;
        this.simplify();
    }

    divide(rhs) {
        if (this.numerator == 0 || rhs.denominator == 0) {
            this.numerator = 0;
            this.denominator = 1;
            return;
        }

        this.numerator *= rhs.denominator;
        this.denominator *= rhs.numerator;
        this.simplify();
    }

    add(rhs) {
        this.numerator = this.numerator * rhs.denominator + rhs.numerator * this.denominator;
        this.denominator = this.denominator * rhs.denominator;
        this.simplify();
    }

    subtract(rhs) {
        this.numerator = this.numerator * rhs.denominator - rhs.numerator * this.denominator;
        this.denominator = this.denominator * rhs.denominator;
        this.simplify();
    }

    calcGCD(n1, n2) {
        if (isNaN(n1) || isNaN(n2)) {
            console.log('error');
            console.trace();
            return 0;
        }
        while (n2 != 0) {
            let tmp1 = n1;
            let tmp2 = n2;

            n1 = tmp2;
            n2 = tmp1 % tmp2;
        }

        return n1;
    }

    compare(rhs) {
        let tmp1 = this.numerator * rhs.denominator;
        let tmp2 = rhs.numerator * this.denominator;
        this.simplify();

        return tmp1 - tmp2;
    }

    toString() {
        if (this.numerator == 0) {
            return '0';
        }
        if (this.denominator == 1) {
            let result = '';
            if (this.sign() < 0) {
                result = '-';
            }
            result += Math.abs(this.numerator).toString();
            return result;
        }

        let result = '';
        if (this.sign() < 0) {
            result = '-';
        }
        result += Math.abs(this.numerator).toString() + '/' + Math.abs(this.denominator).toString();
        return result;
    }

    toLatex() {
        if (this.numerator == 0) {
            return '0';
        }
        if (this.denominator == 1) {
            let result = '';
            if (this.sign() < 0) {
                result = '-';
            }
            result += Math.abs(this.numerator).toString();
            return result;
        }

        let result = '';
        if (this.sign() < 0) {
            result = '-';
        }
        result += '\\frac{' + Math.abs(this.numerator).toString() + "}{" + Math.abs(this.denominator).toString() + '}';
        return result;
    }

    clone() {
        return clone(this);
    }
};
