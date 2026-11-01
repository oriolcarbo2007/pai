/*12.4.- Escriu un programa en JavaScript que calculi el sou mensual 
a partir del nombre d’hores treballades (160 hores) i el preu per hora 
treballada (12€). Prova amb altres valors.
*/

let hores = parseInt(prompt("hores treballades?")); 
let preu = parseInt(prompt("Preu de la hora?"));

let sou = hores * preu;

console.log(" el sou es de: "+ sou + "€" );

