
// Написать пример генератора с исключением


// Написать перебор композиции генераторов методом for..of



/*
 Написать «сеяный псевдослучайный генератор». Он получает «зерно», как первое значение,
и затем генерирует следующее, используя формулу. Так что одно и то же зерно даёт одинаковую
последовательность.
 Пример такой формулы: "next = previous * 16807 % 2147483647"
Если использовать 1 как зерно, то значения будут:
 · 16807
 · 282475249
 · 1622650073
 · …и так далее…
 Задачей является создать функцию-генератор pseudoRandom(seed), которая получает seed
и создаёт генератор с указанной формулой.
*/


//  Пример использования:
// let generator = pseudoRandom(1);
// console.log(generator.next().value); // 16807
// console.log(generator.next().value); // 282475249
// console.log(generator.next().value); // 1622650073



// Сделать объект итерабельным
let a = {
   start: 0,
   finish: 5
}
// for (const iterator of a) console.log(iterator);






















