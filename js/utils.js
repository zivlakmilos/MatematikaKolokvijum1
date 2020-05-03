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

function isDigit(chr) {
    if (chr >= '0' && chr <= '9') {
        return true;
    }

    return false;
}

function isLetter(chr) {
    if ((chr >= 'A' && chr <= 'Z') || (chr >= 'a' && chr <= 'z')) {
        return true;
    }

    return false;
}

function clone(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj)
}
