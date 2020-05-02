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

        callback(this._displayEquations(equations));

        return this.result;
    }

    _displayEquations(equations) {
        let result = '';
        for (let i = 0; i < equations.length; i++) {
            result += '\\[';
            result += equations[i].toLatex();
            if (i == 0) {
            }
            result += '\\]';
        }

        return result;
    }

    _solveEquation() {
    }
};
