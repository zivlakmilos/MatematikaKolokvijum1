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
                        let pivot11 = equations[i].prefix[vars[i]].clone();
                        let pivot12 = equations[k].prefix[vars[i]].clone();
                        pivot12.numerator *= -1;
                        pivot12.divide(pivot11);

                        let tmpEq1 = equations[i].clone();
                        let tmpEq2 = equations[k].clone();
                        tmpEq1.multiply(pivot12);
                        tmpEq2.add(tmpEq1);

                        let pivot3 = equations[j].prefix[vars[j]].clone();
                        let pivot4 = tmpEq2.prefix[vars[j]].clone();
                        pivot4.numerator *= -1
                        pivot4.divide(pivot3);
                        step += this._pivotToLatex(pivot4, k);
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

    solveMatrix(equations, callback) {
        this.result = [];

        if (equations.length == 0) {
            return this.result;
        }

        let step = '';
        let vars = Object.keys(equations[0].prefix);
        let a = [];
        let b = [];

        callback(this._displayEquations(equations, false));

        for (let i = 0; i < equations.length; i++) {
            a.push([]);
            b.push(equations[i].value);
            for (let j = 0; j < vars.length; j++) {
                if (equations[i].prefix.hasOwnProperty(vars[j])) {
                    a[i].push(equations[i].prefix[vars[j]].clone());
                } else {
                    a[i].push(new Fraction(0));
                }
            }
        }

        step = '\\[';
        step += this._matrixToLatex(vars);
        step += ' = ';
        step += '\\frac{1}{detA} \\cdot adjA \\cdot B';
        step += '\\]';
        step += '\\[';
        step += 'A = ';
        step += this._matrixToLatex(a);
        step += '\\]';
        step += '\\[';
        step += 'B = ';
        step += this._matrixToLatex(b);
        step += '\\]';
        callback(step);

        callback(this._calculateDeterminant(a));
        if (this.determinant == undefined) {
            callback('Sistem nema rešenje');
            return this.result;
        }

        callback(this._calculateAdj(a));

        callback(this._solveMatrix(vars, this.determinant, this.adjA, b));

        step = '';
        for (let key in this.result) {
            step += '\\[ \\boxed{' + key + ' = ' + this.result[key].toLatex() + '} \\]';
        }
        callback(step);

        return this.result;
    }

    _displayEquations(equations, pivot = true) {
        let result = '';
        for (let i = 0; i < equations.length; i++) {
            result += '\\[';
            result += equations[i].toLatex();
            if (i == 0 && pivot) {
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

    _matrixToLatex(matrix, matrixType = 'bmatrix') {
        let result = '';

        result = '\\begin{' + matrixType + '}';
        for (let i = 0; i < matrix.length; i++) {
            if (Array.isArray(matrix[i])) {
                for (let j = 0; j < matrix[i].length; j++) {
                    result += matrix[i][j].toLatex();
                    if (j < matrix[i].length - 1) {
                        result += ' & ';
                    } else if (i < matrix.length - 1) {
                        result += ' \\\\ '
                    }
                }
            } else {
                if (matrix[i] instanceof Fraction) {
                    result += matrix[i].toLatex();
                } else {
                    result += matrix[i];
                }
                if (i < matrix.length - 1) {
                    result += ' \\\\ ';
                }
            }
        }
        result += '\\end{' + matrixType + '}';

        return result;
    }

    _calculateDeterminant(matrix) {
        let result = '';

        result += '\\[';
        result += 'detA = ';
        result += this._matrixToLatex(matrix, 'vmatrix');
        result += ' = ';

        let pivots = [];
        let tmp = [];
        for (let i = 0; i < matrix[0].length; i++) {
            let pivot = matrix[0][i].clone();

            if (i % 2 == 1) {
                pivot.numerator *= -1;
            }
            pivots.push(pivot);

            if (pivot.sign() > 0 && i > 0) {
                result += '+';
            }
            result += pivot.toLatex() + ' \\cdot ';

            tmp.push([]);
            for (let j = 1; j < matrix.length; j++) {
                tmp[i].push([]);
                for (let k = 0; k < matrix[j].length; k++) {
                    if (k == i) {
                        continue;
                    }
                    tmp[i][j - 1].push(matrix[j][k].clone());
                }
            }
            result += this._matrixToLatex(tmp[i], 'vmatrix');
        }

        result += '\\]';
        result += '\\[';
        result += '= ';

        let step1 = '';
        let step2 = '';

        let step2Results = [];

        for (let i = 0; i < tmp.length; i++) {
            if (i > 0 && pivots[i].sign() > 0) {
                step1 += '+';
                step2 += '+';
            }

            step1 += pivots[i].toLatex();
            step1 += ' \\cdot (';
            let step1Results = [];

            step2 += pivots[i].toLatex();
            step2 += ' \\cdot (';

            let tmpStr = '';
            for (let j = 0; j < tmp[i].length; j++) {
                for (let k = 0; k < tmp[i][j].length; k++) {
                    let tmpPivot = tmp[i][j][k];
                    if (k == j) {
                        let paretheses = false;
                        if (tmpPivot.sign() < 0 && step1[step1.length - 1] != '(') {
                            step1 += '(';
                        }
                        if (isDigit(step1[step1.length - 1]) || step1[step1.length - 1] == ')') {
                            step1 += ' \\cdot ';
                        }
                        step1 += tmpPivot.toLatex();
                        if (paretheses) {
                            step1 += ')';
                        }

                        if (step1Results.length == 0) {
                            step1Results.push(tmpPivot.clone());
                        } else {
                            step1Results[0].multiply(tmpPivot);
                        }
                    } else {
                        let paretheses = false;
                        if (tmpPivot.sign() < 0) {
                            tmpStr += '(';
                            paretheses = true;
                        }
                        if (isDigit(tmpStr[tmpStr.length - 1]) || tmpStr[tmpStr.length - 1] == ')') {
                            tmpStr += ' \\cdot ';
                        }
                        tmpStr += tmpPivot.toLatex();
                        if (paretheses) {
                            tmpStr += ')';
                        }

                        if (step1Results.length <= 1) {
                            step1Results.push(tmpPivot.clone());
                            step1Results[1].numerator *= -1;
                        } else {
                            step1Results[1].multiply(tmpPivot);
                        }
                    }
                }
            }
            step1 += ' - ' + tmpStr;
            step1 += ')';

            for (let j = 0; j < step1Results.length; j++) {
                if (j > 0 && step1Results[j].sign() > 0) {
                    step2 += '+';
                }

                if (j == 0) {
                    step2Results.push(step1Results[j].clone());
                } else {
                    step2Results[step2Results.length - 1].add(step1Results[j]);
                }

                step2 += step1Results[j].toLatex();
            }

            step2 += ')';
        }

        result += step1;
        result += ' =\\]';
        result += '\\[';
        result += '= ';
        result += step2;
        result += ' =\\]';
        result += '\\[';
        result += '= ';

        let determinant = null;

        step1 = '';
        for (let i = 0; i < step2Results.length; i++) {
            let paretheses = false;

            if (i > 0 && pivots[i].sign() > 0) {
                result += '+';
            }
            result += pivots[i].toLatex();
            result += ' \\cdot ';

            if (step2Results[i].sign() < 0) {
                result += '(';
                paretheses = true;
            };
            result += step2Results[i].clone();
            if (paretheses) {
                result += ')';
            }

            pivots[i].multiply(step2Results[i]);

            if (step1.length > 0 && pivots[i].sign() > 0) {
                step1 += '+';
            }
            step1 += pivots[i].toLatex();

            if (!determinant) {
                determinant = pivots[i];
            } else {
                determinant.add(pivots[i]);
            }
        }

        result += ' =';
        result += '\\]';
        result += '\\[';
        result += '= ';
        result += step1;
        result += ' =';
        result += '\\]';
        result += '\\[';
        result += '= ';
        result += determinant.toLatex();
        result += '\\]';

        if (determinant.numerator == 0) {
            this.determinant = undefined;
        } else {
            this.determinant = determinant;
        }

        return result;
    }

    _calculateAdj(matrix) {
        this.adjA = [];
        let result = '';

        result = '\\[';
        result += 'ajdA = \\begin{bmatrix}'

        let determinants = [];

        let tmpAdj = [];

        for (let i = 0; i < matrix.length; i++) {
            this.adjA.push([]);
            tmpAdj.push([]);
            for (let j = 0; j < matrix[i].length; j++) {
                this.adjA.push([]);
                tmpAdj[i].push([]);

                if ((i + j) % 2 == 0) {
                    result += '+';
                } else {
                    result += '-';
                }

                let tmpK = 0;
                for (let k = 0; k < matrix.length; k++) {
                    if (k == i) {
                        continue;
                    }
                    tmpAdj[i][j].push([]);
                    for (let n = 0; n < matrix.length; n++) {
                        if (n == j) {
                            continue;
                        }
                        tmpAdj[i][j][tmpK].push(matrix[k][n].clone());
                    }
                    tmpK++;
                }
                result += this._matrixToLatex(tmpAdj[i][j], 'vmatrix');

                let tmpRes1 = null;
                let tmpRes2 = null;
                for (let k = 0; k < tmpAdj[i][j].length; k++) {
                    for (let n = 0; n < tmpAdj[i][j][k].length; n++) {
                        if (k == n) {
                            if (!tmpRes1) {
                                tmpRes1 = tmpAdj[i][j][k][n].clone();
                            } else {
                                tmpRes1.multiply(tmpAdj[i][j][k][n].clone());
                            }
                        } else {
                            if (!tmpRes2) {
                                tmpRes2 = tmpAdj[i][j][k][n].clone();
                            } else {
                                tmpRes2.multiply(tmpAdj[i][j][k][n].clone());
                            }
                        }
                    }
                }

                tmpRes2.numerator *= -1;
                tmpRes1.add(tmpRes2);
                if ((i + j) % 2 == 1) {
                    tmpRes1.numerator *= -1;
                }
                this.adjA[i][j] = tmpRes1;

                if (j < matrix[i].length - 1) {
                    result += ' & ';
                }
            }
            if (i < matrix.length - 1) {
                result += ' \\\\ ';
            }
        }

        result += '\\end{bmatrix}^T'
        result += ' ='
        result += '\\]';
        result += '\\[';
        result += '= ';
        result += this._matrixToLatex(this.adjA);
        result += '^T'
        result += '= ';
        result += '\\]';

        this.adjA = this._transposeMatrix(this.adjA);

        result += '\\[';
        result += '= ';
        result += this._matrixToLatex(this.adjA);
        result += '\\]';

        return result;
    }

    _transposeMatrix(matrix) {
        let result = [];

        for (let i = 0; i < matrix.length; i++) {
            result.push([]);
            for (let j = 0; j < matrix[i].length; j++) {
                result[i][j] = matrix[j][i];
            }
        }

        return result;
    }

    _solveMatrix(vars, determinant, adjA, b) {
        let result = '';

        determinant.reciprocal();

        result = '\\[';
        result += this._matrixToLatex(vars);
        result += ' = ';
        result += determinant.toLatex();
        result += ' \\cdot ';
        result += this._matrixToLatex(adjA);
        result += ' \\cdot ';
        result += this._matrixToLatex(b);
        result += ' =';
        result += '\\]';

        result += '\\[';
        result += '= ';
        result += determinant.toLatex();
        result += ' \\cdot ';
        result += '\\begin{bmatrix}';

        let res = [];
        for (let i = 0; i < b.length; i++) {
            res.push(null);
            for (let j = 0; j < adjA[i].length; j++) {
                let paretheses = false;
                if (j > 0 && adjA[i][j].sign() > 0) {
                    result += '+';
                }
                result += adjA[i][j].toLatex();
                result += ' \\cdot ';
                if (b[j].sign() < 0) {
                    result += '(';
                    paretheses = true;
                }
                result += b[j].toLatex();
                if (paretheses) {
                    result += ')';
                }

                let tmpRes = adjA[i][j].clone();
                tmpRes.multiply(b[j]);

                if (!res[i]) {
                    res[i] = tmpRes;
                } else {
                    res[i].add(tmpRes);
                }
            }
            if (i < b.length - 1) {
                result += ' \\\\ ';
            }
        }
        result += '\\end{bmatrix}';
        result += '\\]';

        result += '\\[';
        result += '= ';
        result += determinant.toLatex();
        result += ' \\cdot ';
        result += this._matrixToLatex(res);
        result += ' =';
        result += '\\]';

        result += '\\[';
        result += '= ';
        result += determinant.toLatex();
        result += ' \\cdot ';
        let divider = determinant.clone();
        divider.reciprocal();
        result += '\\begin{bmatrix}';
        for (let i = 0; i < res.length; i++) {
            let paretheses = false;
            result += res[i];
            result += ' : ';
            if (divider.sign() < 0) {
                paretheses = true;
                result += '(';
            }
            result += divider.toLatex();
            if (paretheses) {
                result += ')';
            }

            if (i < res.length - 1) {
                result += ' \\\\ ';
            }

            res[i].multiply(determinant);
        }
        result += '\\end{bmatrix}';
        result += ' =';
        result += '\\]';

        result += '\\[';
        result += '= ';
        result += this._matrixToLatex(res);
        result += '\\]';

        for (let i = 0; i < res.length; i++) {
            this.result[vars[i]] = res[i];
        }

        return result;
    }
};
