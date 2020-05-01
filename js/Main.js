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

    let eq1 = Equation.parse("2x + y - z = 10");
    console.log(eq1);
    console.log(eq1.toLatex());
    eq1.divide(new Fraction(3));
    console.log(eq1.toString())
})();
