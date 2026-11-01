/*12.2.- Fes un programa en JavaScript que calculi el perímetre 
i l’àrea d’un rectangle de 20 i 80 metres de costat. Modifica el 
programa perquè els valors dels costats es demanin amb prompt().  */


let costat1 = parseInt(prompt("costat1?")), costat2 = parseInt(prompt("costat2?")),
area = costat1*costat2, perimetre = 2 * (costat1+costat2);

console.log("area: " + area);
console.log("perimetre: " + perimetre)