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

/*
 * Main
 */

function render(latex) {
    $('#latex').empty();
    $('#latex').html(latex);
}

(() => {
    let a = new Fraction(2, 10);
    let b = new Fraction(3, 7);

    console.log('a = ' + a.toString());
    a.simplify(a);
    console.log('a = ' + a.toString());

    console.log('a = ' + a.toString());
    console.log('b = ' + b.toString());

    a.multiply(b);
    console.log('a * b = ' + a.toString());

    console.log('c = ' + a);
    a.divide(b);
    console.log('c / b = ' + a.toString());

    a.add(b);
    console.log('a + b = ' + a.toString());

    console.log('c = ' + a);
    a.subtract(b);
    console.log('c - b = ' + a.toString());

    let eq1 = Equation.parse("-x + y + z = 0");
    let eq2 = Equation.parse("2x + y + z = 3");
    let eq3 = Equation.parse("4x + 3y + z = 7");

    let equations = [eq1, eq2, eq3];

    let latex = '';

    solver = new EquationSystemSolver();
    solver.solveGaussian(equations, (str) => {
        if (latex.length > 0) {
            latex += '<hr />'
        }
        latex += str;
        render(latex);
    });
})();
