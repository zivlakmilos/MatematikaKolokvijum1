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

function renderEquationsSystem(latex) {
    $('#equationsLatex').empty();
    $('#equationsLatex').html(latex);
    MathJax.texReset();
    MathJax.typesetClear();
    MathJax.typesetPromise();
}

function renderLinearProgramming(latex, index) {
    $('#linearProgrammingLatex' + index).empty();
    $('#linearProgrammingLatex' + index).html(latex);
    MathJax.texReset();
    MathJax.typesetClear();
    MathJax.typesetPromise();
}

(() => {
    let equationsSolver = new EquationSystemSolver();
    let linearProgramminSolver = new LinearProgramminSolver();

    $('#equationsCalculate').click(() => {
        let lines = $('#equationsProblem').val().split('\n');
        let equations = [];

        $.each(lines, function (index, item) {
            let eq = Equation.parse(item);
            if (eq) {
                equations.push(eq);
            }
        });

        let latex = '';

        let method = $('#equationsMethod').val();
        if (method == 'matrix') {
            equationsSolver.solveMatrix(equations, (str) => {
                if (latex.length > 0) {
                    latex += '<hr />';
                }
                latex += str;
            });
        } else {
            equationsSolver.solveGaussian(equations, (str) => {
                if (latex.length > 0) {
                    latex += '<hr />'
                }
                latex += str;
            });
        }
        renderEquationsSystem(latex);
    });

    $('#linearProgrammingCalculate').click(() => {
        let txtFunc = $('#linearProgrammingFunction').val();
        let func = Function.parse(txtFunc);

        let lines = $('#linearProgrammingConditions').val().split('\n');
        let conditions = [];

        $.each(lines, function (index, item) {
            let condition = Condition.parse(item);
            if (condition) {
                conditions.push(condition);
            }
        });

        let max = $('#linearProgrammingGoal').val() == 'min' ? false : true;

        let latex1 = '';
        let latex2 = '';

        $('#linearProgrammingGraph').addClass('visible');
        let graph = JXG.JSXGraph.initBoard('linearProgrammingGraph', {
            boundingbox: [ -5, 100, 100, -5 ],
            axis: true,
            zoom: {
                factorX: 1.25,
                factorY: 1.25,
                wheel: true,
                needshift: true,
                eps: 0.1,
            },
            showCopyright: false,
        });

        linearProgramminSolver.solveGraphics(func, conditions, max, graph, (str) => {
            latex1 += str;
            latex1 += '<hr />';
        }, (str) => {
            latex2 += '<hr />';
            latex2 += str;
        });

        renderLinearProgramming(latex1, 1);
        renderLinearProgramming(latex2, 2);
    });
})();
