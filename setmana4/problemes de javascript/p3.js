/*12.3.- Fes un programa que, donat el radi d’una circumferència, calculi, 
a una nova variable i escrigui a la consola, la longitud de la circumferència 
i l’àrea del cercle. Fes servir una constant per guardar el número pi (3,141593) 
a) Longitud de la circumferència: 2 * 3.1416 * ràdio 
b) Àrea del cercle: 3.1416 * radio^2 
*/

let pi=3.1416, radi = parseInt(prompt("radi?"));

let longitud= 2*pi*radi, area=pi*(radi**2);

console.log("longitud:" + longitud);
console.log("area:" + area);
