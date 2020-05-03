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

class EquationSystemSolver {
    constructor() {
        this.result = [];
    }

    solveGaussian(equations, callback) {
        this.result = [];

        if (equations.length == 0) {
            return this.result;
        }

        callback(this._displayEquations(equations));

        let vars = Object.keys(equations[0].prefix);

        let step = '';
        for (let i = 0; i < equations.length - 1; i++) {
            for (let j = 0; j < i; j++) {
                step += '\\[';
                step += equations[j].toLatex();
                step += '\\]';
            }

            let pivot = equations[i].prefix[vars[i]].clone();
            step += '\\[';
            step += equations[i].toLatex();
            step += '\\]';

            for (let j = i + 1; j < equations.length; j++) {
                let pivot2 = equations[j].prefix[vars[i]].clone();
                pivot2.numerator *= -1;
                pivot2.divide(pivot);
                step += '\\[';

                let tmp = equations[i].clone();
                tmp.multiply(pivot2);
                equations[j].add(tmp);
                step += equations[j].toLatex();

                if (j == i + 1 && j < equations.length - 1) {
                    for (let k = j + 1; k < equations.length; k++) {
                        let pivot = equations[j].prefix[vars[j]].clone();
                        let pivot2 = equations[k].prefix[Object.keys(equations[j].prefix)[0]].clone();
                        pivot2.nominator *= -1
                        pivot2.divide(pivot);
                        step += this._pivotToLatex(pivot2, k);
                    }
                }
                step += '\\]';
            }

            callback(step);
            step = '';
        }

        step = '';
        for (let i = equations.length - 1; i >= 0; i--) {
            step += '\\[';
            step += this._solveEquation(equations[i]);
            step += '\\]';
        }
        callback(step);

        return this.result;
    }

    _displayEquations(equations) {
        let result = '';
        for (let i = 0; i < equations.length; i++) {
            result += '\\[';
            result += equations[i].toLatex();
            if (i == 0) {
                let pivot = equations[i].prefix[Object.keys(equations[i].prefix)[0]].clone();
                for (let j = i + 1; j < equations.length; j++) {
                    let pivot2 = equations[j].prefix[Object.keys(equations[i].prefix)[0]].clone();
                    pivot2.numerator *= -1;
                    pivot2.divide(pivot);
                    result += this._pivotToLatex(pivot2, j);
                }
            }
            result += '\\]';
        }

        return result;
    }

    _pivotToLatex(pivot, n) {
        let result = '';

        if (Math.abs(pivot.numerator) == Math.abs(pivot.denominator)) {
            result += ' | \\cdot ';
            if (pivot.sign() < 0) {
                result += ' (-';
            }
            result += Math.abs(pivot.denominator).toString();
            if (pivot.sign() < 0) {
                result += ')';
            }
        } else if (pivot.numerator == 1 || pivot.numerator == -1) {
            result += ' | : ';
            if (pivot.sign() < 0) {
                result += '(-';
            }
            result += Math.abs(pivot.denominator).toString();
            if (pivot.sign() < 0) {
                result += ')';
            }
        } else if (pivot.denominator == 1 || pivot.denominator == -1) {
            result += ' | \\cdot ';
            if (pivot.sign() < 0) {
                result += '(-';
            }
            result += Math.abs(pivot.numerator).toString();
            if (pivot.sign() < 0) {
                result += ')';
            }
        } else {
            result += ' | \\cdot';
            if (pivot.sign() < 0) {
                result += '(';
            }
            result += pivot.toLatex();
            if (pivot.sign() < 0) {
                result += ')';
            }
        }

        if (result != '') {
            result += ' + I';
            for (let i = 0; i < n; i++) {
                result += 'I';
            }
        }

        return result;
    }

    _solveEquation(equation) {
        let result = equation.toLatex();

        let currentVar = '';

        let replaced = false;
        let step = '';
        let oldValue = equation.value.clone();
        for (let key in equation.prefix) {
            let prefix = equation.prefix[key].clone();
            if (prefix == 0) {
                continue;
            }

            if (this.result.hasOwnProperty(key)) {
                let val = this.result[key].clone();
                val.multiply(prefix);
                if (step.length > 0 && val.sign() > 0 && val.numerator != 0) {
                    step += '+';
                }
                if (val.numerator == 0) {
                    if (prefix.sign() < 0) {
                        step += '-';
                    } else if (step.length > 0) {
                        step += '+';
                    }
                }
                equation.prefix[key] = new Fraction(0);
                equation.value.subtract(val);
                step += val.toLatex();
                replaced = true;
            } else {
                if (step.length > 0 && prefix.sign() > 0) {
                    step += '+';
                }
                if (Math.abs(prefix.numerator) != Math.abs(prefix.denominator)) {
                    step += prefix.toLatex();
                }
                step += key;
                currentVar = key;
            }
        }

        if (replaced) {
            result += ' \\implies ';
            result += step;
            result += ' = ';
            result += oldValue.toLatex();

            result += ' \\implies ';
            if (equation.prefix[currentVar].numerator == equation.prefix[currentVar].denominator) {
                let val = equation.value.clone();

                if (equation.prefix[currentVar].sign() < 0) {
                    val.multiply(new Fraction(-1));
                }

                result += '\\boxed{';
                result += equation.toLatex();
                result += '}';

                this.result[currentVar] = equation.value.clone();
                return result;
            } else {
                result += equation.toLatex();
            }
        }

        if (currentVar != '') {
            result += ' \\implies ';
            result += currentVar + ' = ' + '\\frac{' + equation.value.toLatex() + '}{' + equation.prefix[currentVar].toLatex() + '}';
            result += ' \\implies \\boxed{';
            let tmp = equation.prefix[currentVar].clone();
            equation.divide(tmp);
            result += equation.toLatex();
            result += '}';
            this.result[currentVar] = equation.value;
        }

        return result;
    }
};
