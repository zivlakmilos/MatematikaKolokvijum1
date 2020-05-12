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

class LinearProgramminSolver {
    constructor() {
        this.max = false;
    }

    solveGraphics(func, conditions, max, graph, callback1, callback2) {
        this.result = [];
        this.max = max;
        this.graph = graph;
        let step = '';

        for (let key in func.prefix) {
            let con = key + '>=0';
            let condition = Condition.parse(con);
            if (condition) {
                conditions.push(condition);
            }
        }

        callback1(this._displayProblem(func, conditions));
        callback1(this._showGraph(func, conditions));
        callback2(this._findPoints(func, conditions));
        callback2(this._findSolution(func, conditions));
        callback2(this._showResult(func));
        this._drawAreaOfInterest(func);

        return this.result;
    }

    _displayProblem(func, conditions) {
        let result = '';

        for (let i = 0; i < conditions.length; i++) {
            result += '\\[';
            result += conditions[i].toLatex();
            result += '\\]';
        }

        result += '\\[';
        result += func.toLatex();
        result += '\\]';

        result += '\\[';
        result += func.name;
        result += '_{';
        if (this.max) {
            result += 'max';
        } else {
            result += 'min';
        }
        result += '} = ?';
        result += '\\]';

        return result;
    }

    _showGraph(func, conditions) {
        this.points = [];
        let result = ''

        let lines = [];

        let keys = Object.keys(func.prefix);

        this.pointName = 0;

        let boundingBox = [-5, 0, 0, -5];

        let ok = true;
        for (let i = 0; i < conditions.length; i++) {
            let tmp = {};
            for (let key in func.prefix) {
                tmp[key] = new Fraction(0);
            }
            if (!conditions[i].check(tmp)) {
                ok = false;
                break;
            }
        }
        if (ok) {
            let p = [0, 0];
            let tmp = {};
            tmp['name'] = getAlphabet(this.pointName);
            tmp['coords'] = {};
            tmp['coords'][keys[0]] = new Fraction(p[0]);
            tmp['coords'][keys[1]] = new Fraction(p[1]);
            this.points.push(tmp);
            this.graph.create('point', p, { name: getAlphabet(this.pointName), size: 2 });
            this.pointName++;
        }

        for (let i = 0; i < conditions.length; i++) {
            lines.push(conditions[i].clone());
            if (Object.keys(conditions[i].prefix).length > 1 && conditions[i].value.numerator != 0) {
                let divider = lines[i].value.clone();
                lines[i].divide(divider);

                let x1 = lines[i].prefix[keys[0]].clone();
                let x2 = lines[i].prefix[keys[1]].clone();
                x1.reciprocal();
                x2.reciprocal();

                let valX1 = x1.numerator / x1.denominator;
                let valX2 = x2.numerator / x2.denominator;
                let p1 = [valX1, 0];
                let p2 = [0, valX2];
                if (p1[0] > boundingBox[2]) {
                    boundingBox[0] = -p1[0] * 0.25;
                    boundingBox[2] = p1[0] + p1[0] * 0.25;
                }
                if (p2[1] > boundingBox[1]) {
                    boundingBox[3] = -p2[1] * 0.25;
                    boundingBox[1] = p2[1] + p2[1] * 0.25;
                }
                this.graph.create('line', [p1, p2], { strokeColor: '#0000ff', strokeWidth: 2 });

                let p1Con = true;
                let p2Con = true;
                for (let j = 0; j < conditions.length; j++) {
                    if (j == i) {
                        continue;
                    }
                    let tmp1 = {};
                    let tmp2 = {};
                    tmp1[keys[0]] = x1.clone();
                    tmp1[keys[1]] = new Fraction(0);
                    tmp2[keys[0]] = new Fraction(0);
                    tmp2[keys[1]] = x2.clone();
                    if (!conditions[j].check(tmp1)) {
                        p1Con = false;
                    }
                    if (!conditions[j].check(tmp2)) {
                        p2Con = false;
                    }
                    if (!p1Con && !p2Con) {
                        break;
                    }
                }
                if (p1Con) {
                    let tmp = {};
                    tmp['name'] = getAlphabet(this.pointName);
                    tmp['coords'] = {};
                    tmp['coords'][keys[0]] = x1.clone();
                    tmp['coords'][keys[1]] = new Fraction(0);
                    let ok = true;
                    for (let k = 0; k < this.points.length; k++) {
                        if (tmp['coords'][keys[0]].compare(this.points[k]['coords'][keys[0]]) == 0 &&
                            tmp['coords'][keys[1]].compare(this.points[k]['coords'][keys[1]]) == 0) {
                            ok = false;
                            break;
                        }
                    }
                    if (ok) {
                        this.points.push(tmp);
                        this.graph.create('point', p1, { name: getAlphabet(this.pointName), size: 2 });
                        this.pointName++;
                    }
                }
                if (p2Con) {
                    let tmp = {};
                    tmp['name'] = getAlphabet(this.pointName);
                    tmp['coords'] = {};
                    tmp['coords'][keys[0]] = new Fraction(0);
                    tmp['coords'][keys[1]] = x2.clone();
                    let ok = true;
                    for (let k = 0; k < this.points.length; k++) {
                        if (tmp['coords'][keys[0]].compare(this.points[k]['coords'][keys[0]]) == 0 &&
                            tmp['coords'][keys[1]].compare(this.points[k]['coords'][keys[1]]) == 0) {
                            ok = false;
                            break;
                        }
                    }
                    if (ok) {
                        this.points.push(tmp);
                        this.graph.create('point', p2, { name: getAlphabet(this.pointName), size: 2 });
                        this.pointName++;
                    }
                }
            } else if (lines[i].value.numerator != 0) {
                let x = lines[i].value.clone();
                let valX = x.numerator / x.denominator;

                if (lines[i].prefix.hasOwnProperty(keys[0])) {
                    if (lines[i].prefix[keys[0]].numerator != 1) {
                        let divider = lines[i].previx[keys[0]].clone();
                        lines[i].divide(divider);
                    }

                    let p1 = [valX, 0];
                    let p2 = [valX, 1];
                    if (p1[0] > boundingBox[2]) {
                        boundingBox[0] = -p1[0] * 0.25;
                        boundingBox[2] = p1[0] + p1[0] * 0.25;
                    }
                    if (p2[0] > boundingBox[2]) {
                        boundingBox[0] = -p2[0] * 0.25;
                        boundingBox[2] = p2[0] + p2[0] * 0.25;
                    }
                    this.graph.create('line', [p1, p2], { name: 'a', strokeColor: '#0000ff', strokeWidth: 2 });
                    let pCon = true;
                    for (let j = 0; j < conditions.length; j++) {
                        if (j == i) {
                            continue;
                        }
                        let tmp = {};
                        tmp[keys[0]] = x.clone();;
                        tmp[keys[1]] = new Fraction(0);
                        if (!conditions[j].check(tmp)) {
                            pCon = false;
                            break;
                        }
                    }
                    if (pCon) {
                        let tmp = {};
                        tmp['name'] = getAlphabet(this.pointName);
                        tmp['coords'] = {};
                        tmp['coords'][keys[0]] = x.clone();
                        tmp['coords'][keys[1]] = new Fraction(0);
                        let ok = true;
                        for (let k = 0; k < this.points.length; k++) {
                            if (tmp['coords'][keys[0]].compare(this.points[k]['coords'][keys[0]]) == 0 &&
                                tmp['coords'][keys[1]].compare(this.points[k]['coords'][keys[1]]) == 0) {
                                ok = false;
                                break;
                            }
                        }
                        if (ok) {
                            this.points.push(tmp);
                            this.graph.create('point', p1, { name: getAlphabet(this.pointName), size: 2 });
                            this.pointName++;
                        }
                    }
                } else {
                    if (lines[i].prefix[keys[1]].numerator != 1) {
                        let divider = lines[i].prefix[keys[1]].clone();
                        lines[i].divide(divider);
                    }

                    let p1 = [0, valX];
                    let p2 = [1, valX];
                    if (p1[1] > boundingBox[1]) {
                        boundingBox[3] = -p1[1] * 0.25;
                        boundingBox[1] = p1[1] + p1[1] * 0.25;
                    }
                    if (p2[1] > boundingBox[1]) {
                        boundingBox[3] = -p2[1] * 0.25;
                        boundingBox[1] = p2[1] + p2[1] * 0.25;
                    }
                    this.graph.create('line', [p1, p2], { name: 'a', strokeColor: '#0000ff', strokeWidth: 2 });
                    let pCon = true;
                    for (let j = 0; j < conditions.length; j++) {
                        if (j == i) {
                            continue;
                        }
                        let tmp = {};
                        tmp[keys[0]] = new Fraction(0);
                        tmp[keys[1]] = x.clone();
                        if (!conditions[j].check(tmp)) {
                            pCon = false;
                            break;
                        }
                    }
                    if (pCon) {
                        let tmp = {};
                        tmp['name'] = getAlphabet(this.pointName);
                        tmp['coords'] = {};
                        tmp['coords'][keys[0]] = new Fraction(0);
                        tmp['coords'][keys[1]] = x.clone();
                        let ok = true;
                        for (let k = 0; k < this.points.length; k++) {
                            if (tmp['coords'][keys[0]].compare(this.points[k]['coords'][keys[0]]) == 0 &&
                                tmp['coords'][keys[1]].compare(this.points[k]['coords'][keys[1]]) == 0) {
                                ok = false;
                                break;
                            }
                        }
                        if (ok) {
                            this.points.push(tmp);
                            this.graph.create('point', p1, { name: getAlphabet(this.pointName), size: 2 });
                            this.pointName++;
                        }
                    }
                }
            }

            let step = this._calculateLine(conditions[i], i);
            if (step.length > 0) {
                result += step;
                if (i < conditions.length - 3) {
                    result += '<hr />';
                }
            }
        }

        this.graph.setBoundingBox(boundingBox);

        return result;
    }

    _calculateLine(condition, conIndex) {
        let result = '';

        let con = condition.clone();

        let keys = Object.keys(con.prefix);

        if (keys.length == 1) {
            if (con.prefix[keys[0]].compare(new Fraction(1)) == 0) {
                if (con.value.compare(new Fraction(0)) != 0) {
                    result += '\\[';
                    result += '(p_' + (conIndex + 1) + ') \\quad ';
                    result += '\\boxed{';
                    result += con.toLatex(true);
                    result += '}';
                    result += '\\]';
                }
                return result;
            }

            result += '\\[';
            result += '(p_' + (conIndex + 1) + ') \\quad ';
            result += con.toLatex(true);
            result += '\\]';

            result += '\\[';
            result += this._prefixToLtex(keys[0]);
            result += ' = ';
            result += '\\frac{' + con.value.toLatex() + '}' + '{' + con.prefix[keys[0]].toLatex() + '}';
            result += '\\]';

            let val = con.value.clone();
            val.divide(con.prefix[keys[0]]);
            result += '\\[';
            result += '\\boxed{';
            result += this._prefixToLtex(keys[0]);
            result += ' = ';
            result += val.toLatex();
            result += '}';
            result += '\\]';
        } else {
            result += '\\[';
            result += '(p_' + (conIndex + 1) + ') \\quad ';
            result += con.toLatex(true);
            result += '\\]';
            for (let i = keys.length - 1; i >= 0; i--) {
                result += 'Presek sa \\(' + this._prefixToLtex(keys[1 - i]) + '\\) osom:';
                result += '\\[';
                result += this._prefixToLtex(keys[i]);
                result += ' = ';
                result += '0';
                result += '\\]';

                let prefix = null;
                let val = con.value.clone();
                let step2 = '';

                result += '\\[';
                for (let j = 0; j < keys.length; j++) {
                    if (j > 0 && con.prefix[keys[j]].sign() > 0) {
                        result += '+';
                    }
                    if (i == j || con.prefix[keys[j]].compare(new Fraction(1)) != 0) {
                        result += con.prefix[keys[j]].toLatex();
                    }

                    if (j == i) {
                        result += ' \\cdot ';
                        result += '0';
                    } else {
                        result += this._prefixToLtex(keys[j]);
                        if (con.prefix[keys[j]].compare(new Fraction(1)) != 0) {
                            prefix = con.prefix[keys[j]].clone();
                        }

                        if (step2.length > 0 && con.prefix[keys[j]].sign() > 0) {
                            result += '+';
                        }
                        if (con.prefix[keys[j]].compare(new Fraction(1)) == 0) {
                            step2 += '\\boxed{';
                        } else {
                            step2 += con.prefix[keys[j]];
                        }
                        step2 += this._prefixToLtex(keys[j]);
                    }
                }

                step2 += ' = ';
                step2 += con.value.toLatex();
                if (!prefix) {
                    step2 += '}';
                }

                result += ' = ';
                result += con.value.toLatex();
                result += '\\]';

                result += '\\[' + step2 + '\\]';

                if (prefix) {
                    result += '\\[';
                    result += this._prefixToLtex(keys[1 - i]);
                    result += ' = ';
                    result += '\\frac{' + val.toLatex() + '}{' + prefix.toLatex() + '}';
                    result += '\\]';

                    val.divide(prefix);
                    result += '\\[';
                    result += '\\boxed{';
                    result += this._prefixToLtex(keys[1 - i]);
                    result += ' = ';
                    result += val.toLatex();
                    result += '}';
                    result += '\\]';
                }
            }
        }

        return result;
    }

    _prefixToLtex(prefix) {
        let result = '';

        if (prefix.length == 0) {
            return result;
        }

        result += prefix[0];
        if (prefix.length > 0) {
            result += '_{';
            result += prefix.substr(1);
            result += '}';
        }

        return result;
    }

    _findPoints(func, conditions) {
        let result = '';

        let keys = Object.keys(func.prefix);

        let first = true;
        for (let i = 0; i < conditions.length; i++) {
            for (let j = i + 1; j < conditions.length; j++) {
                if (Object.keys(conditions[i].prefix).length < 2 && Object.keys(conditions[j].prefix).length < 2) {
                    if (conditions[i].value.numerator == 0 || conditions[j].value.numerator == 0) {
                        continue;
                    }

                    let con1 = null;
                    let con2 = null;

                    if (conditions[i].prefix.hasOwnProperty(keys[0])) {
                        if (con1) {
                            continue;
                        }
                        con1 = conditions[i].clone();
                    } else {
                        if (con2) {
                            continue;
                        }
                        con2 = conditions[i].clone();
                    }
                    if (conditions[j].prefix.hasOwnProperty(keys[0])) {
                        if (con1) {
                            continue;
                        }
                        con1 = conditions[j].clone();
                    } else {
                        if (con2) {
                            continue;
                        }
                        con2 = conditions[j].clone();
                    }

                    let divider1 = con1.prefix[keys[0]].clone();
                    con1.divide(divider1);
                    let divider2 = con2.prefix[keys[1]].clone();
                    con2.divide(divider2);

                    let p = [con1.value.numerator / con1.value.denominator, con2.value.numerator / con2.value.denominator];
                    let tmp = {};
                    tmp[keys[0]] = con1.value.clone();
                    tmp[keys[1]] = con2.value.clone();

                    let ok = true;
                    for (let k = 0; k < conditions.length; k++) {
                        if (!conditions[k].check(tmp)) {
                            ok = false;
                        }
                    }
                    if (ok) {
                        let tmp = {};
                        tmp['name'] = getAlphabet(this.pointName);
                        tmp['coords'] = {};
                        tmp['coords'][keys[0]] = con1.value.clone();
                        tmp['coords'][keys[1]] = con2.value.clone();
                        ok = true;
                        for (let k = 0; k < this.points.length; k++) {
                            if (tmp['coords'][keys[0]].compare(this.points[k]['coords'][keys[0]]) == 0 &&
                                tmp['coords'][keys[1]].compare(this.points[k]['coords'][keys[1]]) == 0) {
                                ok = false;
                                break;
                            }
                        }
                        if (ok) {
                            this.points.push(tmp);
                            this.graph.create('point', p, { name: getAlphabet(this.pointName), size: 2 });
                            this.pointName++;
                        }
                    }

                    continue;
                }

                let A = [[], []];
                let b = [];
                for (let k = 0; k < keys.length; k++) {
                    if (conditions[i].prefix.hasOwnProperty(keys[k])) {
                        A[0].push(conditions[i].prefix[keys[k]].numerator / conditions[i].prefix[keys[k]].denominator);
                    } else {
                        A[0].push(0);
                    }
                    if (conditions[j].prefix.hasOwnProperty(keys[k])) {
                        A[1].push(conditions[j].prefix[keys[k]].numerator / conditions[j].prefix[keys[k]].denominator);
                    } else {
                        A[1].push(0);
                    }
                }
                b.push(conditions[i].value.numerator / conditions[i].value.denominator);
                b.push(conditions[j].value.numerator / conditions[j].value.denominator);
                let p = JXG.Math.Numerics.Gauss(A, b);

                let tmp = {};
                for (let k = 0; k < keys.length; k++) {
                    tmp[keys[k]] = new Fraction(p[k]);
                }

                let ok = true;
                for (let k = 0; k < conditions.length; k++) {
                    if (!conditions[k].check(tmp)) {
                        ok = false;
                    }
                }
                if (ok) {
                    let tmpRes = {};
                    let step = this._solvePoint(func, conditions, i, j, getAlphabet(this.pointName), tmpRes);
                    if (Object.keys(tmpRes).length > 0) {
                        tmp['name'] = getAlphabet(this.pointName);
                        tmp['coords'] = {};
                        tmp['coords'][keys[0]] = tmpRes[keys[0]];
                        tmp['coords'][keys[1]] = tmpRes[keys[1]];
                        ok = true;
                        for (let k = 0; k < this.points.length; k++) {
                            if (tmp['coords'][keys[0]].compare(this.points[k]['coords'][keys[0]]) == 0 &&
                                tmp['coords'][keys[1]].compare(this.points[k]['coords'][keys[1]]) == 0) {
                                ok = false;
                                break;
                            }
                        }
                        if (ok) {
                            this.points.push(tmp);
                            this.graph.create('point', p, { name: getAlphabet(this.pointName), size: 2 });
                            if (!first) {
                                result += '<hr />';
                            } else {
                                first = false;
                            }
                            result += step;
                            this.pointName++;
                        }
                    }
                }
            }
        }

        return result;
    }

    _solvePoint(func, conditions, con1Index, con2Index, pointName, res) {
        let result = '';

        let condition1 = conditions[con1Index];
        let condition2 = conditions[con2Index];

        let keys = Object.keys(func.prefix);

        let complex = false;
        let con1 = null;
        let con2 = null;
        let reverse = false;
        let reverse2 = false;

        if (Object.keys(condition1.prefix).length >= 2 && Object.keys(condition2.prefix).length >= 2) {
            complex = true;
            con1 = condition1.clone();
            con2 = condition2.clone();
        } else if (Object.keys(condition1.prefix).length == 1) {
            con1 = condition2.clone();
            con2 = condition1.clone();
            reverse2 = true;
        } else {
            con1 = condition1.clone();
            con2 = condition2.clone();
        }

        if (!complex && con2.value.numerator == 0) {
            return '';
        }

        if (!complex && con2.prefix.hasOwnProperty(keys[0])) {
            reverse = true;
        }

        result += '\\[';
        result += '\\{' + pointName + '\\}\\quad ';
        result += 'p_' + (con1Index + 1) + ' \\cap ' + 'p_' + (con2Index + 1);
        result += '\\]';

        if (complex) {
            let pivot = con1.prefix[keys[0]].clone();
            pivot.divide(con2.prefix[keys[0]]);
            pivot.numerator *= -1;
            pivot.reciprocal();

            result += '\\[';
            result += '(p_' + (con1Index + 1) + ')\\quad ';
            result += con1.toLatex(true);
            result += ' / ';
            result += ' \\cdot ';
            let parenthases = false;
            if (pivot.sign() < 0) {
                result += '(';
                parenthases = true;
            }
            result += pivot.toLatex();
            if (parenthases) {
                result += ')';
            }
            result += ' + II';
            result += '\\]';

            result += '\\[';
            result += '(p_' + (con2Index + 1) + ')\\quad ';
            result += con2.toLatex(true);
            result += '\\]';

            let tmp = con1.clone();
            tmp.multiply(pivot);
            con2.add(tmp);
        }

        result += '\\[';
        if (reverse2) {
            result += '(p_' + (con2Index + 1) + ')\\quad ';
        } else {
            result += '(p_' + (con1Index + 1) + ')\\quad ';
        }
        result += con1.toLatex(true);
        result += ' \\implies ';

        if (reverse) {
            let tmp = con2.clone();
            tmp.divide(con2.prefix[keys[0]].clone());

            let prefix = con1.prefix[keys[0]].clone();
            prefix.multiply(tmp.value);

            if (con1.prefix[keys[1]].numerator != 1) {
                result += con1.prefix[keys[1]].toLatex();
            }
            con1.value.subtract(prefix);

            result += this._prefixToLtex(keys[1]);
            result += ' = ';
            result += con1.value.toLatex();

            if (con1.prefix[keys[1]].numerator != 1 || con1.prefix[keys[1]].sign() < 0) {
                result += ' \\implies ';
                result += this._prefixToLtex(keys[1]);
                result += ' = ';
                result += '\\frac{' + con1.value.toLatex() + '}{' + con1.prefix[keys[1]].toLatex() + '}';
                result += ' \\implies ';
                result += this._prefixToLtex(keys[1]);
                result += ' = ';
                con1.value.divide(con1.prefix[keys[1]].clone());
                result += con1.value.toLatex();
            }
        } else {
            let tmp = con2.clone();
            tmp.divide(con2.prefix[keys[1]].clone());

            let prefix = con1.prefix[keys[1]].clone();
            prefix.multiply(tmp.value);

            if (con1.prefix[keys[0]].numerator != 1) {
                result += con1.prefix[keys[0]].toLatex();
            }
            con1.value.subtract(prefix);

            result += this._prefixToLtex(keys[0]);
            result += ' = ';
            result += con1.value.toLatex();

            if (con1.prefix[keys[0]] != 1 || con1.prefix[keys[0]].sign() < 0) {
                result += ' \\implies ';
                result += this._prefixToLtex(keys[0]);
                result += ' = ';
                result += '\\frac{' + con1.value.toLatex() + '}{' + con1.prefix[keys[0]].toLatex() + '}';
                result += ' \\implies ';
                result += this._prefixToLtex(keys[0]);
                result += ' = ';
                con1.value.divide(con1.prefix[keys[0]]);
                result += con1.value.toLatex();
            }
        }
        result += '\\]';

        result += '\\[';
        if (reverse2) {
            result += '(p_' + (con1Index + 1) + ')\\quad ';
        } else {
            result += '(p_' + (con2Index + 1) + ')\\quad ';
        }
        result += con2.toLatex(true);
        if (reverse) {
            if (con2.prefix[keys[0]].numerator != 1 || con2.prefix[keys[0]].sign() < 0) {
                result += ' \\implies ';
                result += this._prefixToLtex(keys[0]);
                result += ' = ';
                result += '\\frac{' + con2.value.toLatex() + '}{' + con2.prefix[keys[0]].toLatex() + '}';
                result += ' \\implies ';
                result += this._prefixToLtex(keys[0]);
                result += ' = ';
                con2.value.divide(con2.prefix[keys[0]]);
                result += con2.value.toLatex();
            }
        } else {
            if (con2.prefix[keys[1]].numerator != 1 || con2.prefix[keys[1]].sign() < 0) {
                result += ' \\implies ';
                result += this._prefixToLtex(keys[1]);
                result += ' = ';
                result += '\\frac{' + con2.value.toLatex() + '}{' + con2.prefix[keys[1]].toLatex() + '}';
                result += ' \\implies ';
                result += this._prefixToLtex(keys[1]);
                result += ' = ';
                con2.value.divide(con2.prefix[keys[1]]);
                result += con2.value.toLatex();
            }
        }
        result += '\\]';

        result += '\\[';
        result += '\\boxed{' + pointName + '(';
        if (reverse) {
            result += con2.value.toLatex() + ', ' + con1.value.toLatex();
            res[keys[0]] = con2.value.clone();
            res[keys[1]] = con1.value.clone();
        } else {
            result += con1.value.toLatex() + ', ' + con2.value.toLatex();
            res[keys[0]] = con1.value.clone();
            res[keys[1]] = con2.value.clone();
        }
        result += ')}';
        result += '\\]';

        return result;
    }

    _findSolution(func) {
        this.result = {};
        let result = '';

        let keys = Object.keys(func.prefix);

        for (let i = 0; i < this.points.length; i++) {
            let z = func.calc(this.points[i].coords);
            if (i == 0) {
                this.result = this.points[i];
                this.result.value = z;
                continue;
            }
            let cmp = z.compare(this.result.value);
            if (this.max && cmp > 0) {
                this.result = this.points[i];
                this.result.value = z;
            } else if (!this.max && cmp < 0) {
                this.result = this.points[i];
                this.result.value = z;
            }
        }

        for (let i = 0; i < this.points.length; i++) {
            let z = func.calc(this.points[i].coords);

            result += '\\[';
            result += this.points[i].name + '(' + this.points[i].coords[keys[0]] + ', ' + this.points[i].coords[keys[1]] + ')';
            result += '\\]';

            result += '\\[';
            result += func.toLatex();
            result += '\\]';

            result += '\\[';
            result += func.name;
            result += '_{' + this.points[i].name + '}';
            result += ' = ';
            let step = '\\[';
            step += func.name;
            step += '_{' + this.points[i].name + '}';
            step += ' = ';
            for (let j = 0; j < keys.length; j++) {
                let prefix = func.prefix[keys[j]].clone();
                if (prefix.numerator == 1 && prefix.sign() > 0) {
                    result += this.points[i].coords[keys[j]].toLatex();
                    continue;
                }
                if (prefix.sign() > 0 && j > 0) {
                    result += '+';
                }
                result += prefix.toLatex();
                result += ' \\cdot '
                result += this.points[i].coords[keys[j]].toLatex();

                prefix.multiply(this.points[i].coords[keys[j]]);
                if (prefix.sign() > 0 && j > 0) {
                    step += '+';
                }
                step += prefix.toLatex();
            }
            step += '\\]'
            result += '\\]';

            result += step;

            result += '\\[';
            let box = false;
            if (z.compare(this.result.value) == 0) {
                box = true;
                result += '\\boxed{';
            }
            result += func.name;
            result += '_{' + this.points[i].name + '}';
            result += ' = ';
            result += z.toLatex();
            if (box) {
                result += '}';
            }
            result += '\\]';

            if (i < this.points.length - 1) {
                result += '<hr />';
            }
        }

        return result;
    }

    _showResult(func) {
        let result = '';

        let keys = Object.keys(func.prefix);

        result += '\\['
        result += '\\boxed{'
        result += func.name;
        if (this.max) {
            result += '_{max}';
        } else {
            result += '_{min}';
        }
        result += ' = '
        result += this.result.value.toLatex();
        result += '}'
        result += '\\]';
        result += '\\[';
        result += '\\boxed{'
        result += this.result.name;
        result += ' (';
        result += this.result.coords[keys[0]].toLatex();
        result += ', ';
        result += this.result.coords[keys[1]].toLatex();
        result += ')'
        result += '}'
        result += '\\]';

        return result;
    }

    _drawAreaOfInterest(func) {
        let p = [];
        let p0 = [null, null];

        let keys = Object.keys(func.prefix);

        for (let i = 0; i < this.points.length; i++) {
            p.push([]);
            p[i].push(this.points[i].coords[keys[0]].numerator / this.points[i].coords[keys[0]].denominator);
            p[i].push(this.points[i].coords[keys[1]].numerator / this.points[i].coords[keys[1]].denominator);

            if (i == 0) {
                p0.push(p[i][0]);
                p0.push(p[i][1]);
                continue;
            }

            if (i == 0) {
                continue;
            }
            if (p[i][0] < p0[0]) {
                p0[0] = p[i][0];
            }
            if (p[i][0] == p0[0]) {
                if (p[i][1] > p0[1]) {
                    p0[1] = p[i][1];
                }
            }
        }

        p.sort((a, b) => {
            let left = (a[0] - p0[0]) * (b[1] - p0[1]) - (b[0] - p0[0]) * (a[1] - p0[1]);
            if (left == 0) {
                let distA = (p0[0] - a[0]) * (p0[0] - a[0]) + (p0[1] - a[1]) * (p0[1] - a[1]);
                let distB = (p0[0] - b[0]) * (p0[0] - b[0]) + (p0[1] - b[1]) * (p0[1] - b[1]);
                return distA - distB;
            }

            return left;
        });

        this.graph.create('polygon', p, {
            withLines: false,
            fillColor: '#ffff00',
            vertices: {
                visile: false,
            },
        });
    }
}
