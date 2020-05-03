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
    $('.latex').empty();
    $('.latex').html(latex);
    MathJax.texReset();
    MathJax.typesetClear();
    MathJax.typesetPromise();
}

(() => {
    let latex = '';
    let equationsSolver = new EquationSystemSolver();

    $('#equationsCalculate').click(() => {
        let lines = $('#equationsProblem').val().split('\n');
        let equations = [];

        $.each(lines, function (index, item) {
            let eq = Equation.parse(item);
            if (eq) {
                equations.push(eq);
            }
        });

        latex = '';

        let method = $('#equationsMethod').val();
        if (method == 'matrix') {
            equationsSolver.solveMatrix(equations, (str) => {
                if (latex.length > 0) {
                    latex += '<hr />';
                }
                latex += str;
            });
            render(latex);
        } else {
            equationsSolver.solveGaussian(equations, (str) => {
                if (latex.length > 0) {
                    latex += '<hr />'
                }
                latex += str;
            });
            render(latex);
        }
    });
})();
