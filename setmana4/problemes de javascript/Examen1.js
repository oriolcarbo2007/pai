/*1.- (2 punts) Escriu un programa que, donat un número llegit amb prompt, 
escrigui el missatge "El número és positiu" si el número és més gran que zero, 
"El número és negatiu" si és més petit que zero, o "El número és zero" si és igual 
a zero. Utilitza if-else.
*/

let num = parseInt(prompt("num?"));

if (num > 0 ){
    console.log("positiu");
}

else if (num < 0){
    console.log("negatiu");
}

 else{ 
    console.log("zero");
}