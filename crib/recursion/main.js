let {warn} = console;


warn('============= Рекурсия и Связанный список =============')
/*
* Рекурсия
 Два способа мышления
В качестве первого примера напишем функцию pow(x, n), которая возводит x в натуральную степень n.
Иначе говоря, умножает x на само себя n раз.
 pow(2, 2) = 4
 pow(2, 3) = 8
 pow(2, 4) = 16

 Рассмотрим два способа её реализации.
Итеративный способ (цикл for):
*/
function pow(x, n) {
   let result = 1;
   for (let i = 0; i < n; i++) {
      result *= x; // умножаем result на x n раз в цикле
   }
   return result;
}
console.log(pow(2, 3)); // 8

// Рекурсивный способ: упрощение задачи и вызов функцией самой себя:
function pow(x, n) {
   return (n !== 1) ? x * pow(x, n - 1) : x;
}
console.log(pow(2, 3)); // 8
/*
 Обратите внимание, что рекурсивный вариант отличается принципиально.
Когда функция pow(x, n) вызывается, исполнение делится на две ветви:


            	if  n == 1   = x
             /
pow(x, n) =
             \
             else n !== 1   = x * pow(x, n - 1)

 1) Если n == 1, тогда всё просто. Эта ветвь называется базой рекурсии, потому что сразу же приводит
к очевидному результату: pow(x, 1) равно x.
 2) Мы можем представить pow(x, n) в виде: x * pow(x, n - 1). Что в математике записывается как:
xn = x * xn-1. Эта ветвь – шаг рекурсии: мы сводим задачу к более простому действию (умножение на x)
и более простой аналогичной задаче (pow с меньшим n). Последующие шаги упрощают задачу всё больше и больше,
пока n не достигает 1.
 Говорят, что функция pow рекурсивно вызывает саму себя до n == 1.

 Например, рекурсивный вариант вычисления pow(2, 4) состоит из шагов:
pow(2, 4) = 2 * pow(2, 3)
pow(2, 3) = 2 * pow(2, 2)
pow(2, 2) = 2 * pow(2, 1)
pow(2, 1) = 2

 Общее количество вложенных вызовов (включая первый) называют глубиной рекурсии.
В нашем случае она будет равна ровно n.
 Максимальная глубина рекурсии ограничена движком JavaScript.
Точно можно рассчитывать на 10000 вложенных вызовов.


* Контекст выполнения, стек
Подробно по ссылке https://learn.javascript.ru/recursion


* Рекурсивные обходы
 Представьте, у нас есть компания. Структура персонала может быть представлена как объект:
*/
let company = {
   sales: [{ name: 'John', salary: 1000 }, { name: 'Alice', salary: 600 }],
   development: {
      sites: [{ name: 'Peter', salary: 2000 }, { name: 'Alex', salary: 1800 }],
      internals: [{ name: 'Jack', salary: 1300 }]
   }
};
/*
 Другими словами, в компании есть отделы.
Отдел может состоять из массива работников или может быть разделён на подотделы,
например, отдел development состоит из подотделов: sites и internals. 
Также возможно, что при росте подотдела он делится на подразделения (или команды).

 Необходима функция для получения суммы всех зарплат. Как можно это сделать?

Когда наша функция получает отдел для подсчёта суммы зарплат, есть два возможных случая:
 1) Либо это «простой» отдел с массивом – тогда мы сможем суммировать зарплаты в простом цикле.
 2) Или это объект с N подотделами – тогда мы можем сделать N рекурсивных вызовов,
чтобы получить сумму для каждого из подотделов, и объединить результаты.
*/
function sumSalaries(department) {
   if (Array.isArray(department)) { // случай (1)
      return department.reduce((prev, item) => prev + item.salary, 0); // сумма элементов массива
   } else { // случай (2)
      let summ = 0;
      for (let subLvl of Object.values(department)) {
         summ += sumSalaries(subLvl); // рекурсивно вызывается для подотделов, суммируя результаты
      }
      return summ;
   }
};
console.log(sumSalaries(company));
/*
 Принцип прост: для объекта {...} используются рекурсивные вызовы,
а массивы [...] являются «листьями» дерева рекурсии, они сразу дают результат.
*/

warn('============= Связанный список ==============');
/*
 Допустим, что мы хотим хранить упорядоченный список объектов.
Естественным выбором будет массив:
  let arr = [obj1, obj2, obj3];
…Но у массивов есть недостатки. Операции «удалить элемент» и «вставить элемент» являются "дорогостоящими".
Если массив большой, на это потребуется время.
 Связанный список призван решить эту проблему.

Элемент связанного списка определяется рекурсивно как объект с:
 · value,
 · next – свойство, ссылающееся на следующий элемент связанного списка или null, если это последний элемент.
*/
let list = {
   value: 1,
   next: {
      value: 2,
      next: {
         value: 3,
         next: {
            value: 4,
            next: null
         }
      }
   }
};

// Альтернативный код для создания
let listTwo = { value: 1 };
listTwo.next = { value: 2 };
listTwo.next.next = { value: 3 };
listTwo.next.next.next = { value: 4 };

// Список можно легко разделить на несколько частей и впоследствии объединить обратно
let secondList = listTwo.next.next;
console.log(secondList);
listTwo.next.next = null; 
console.log(listTwo.next.next);
console.log(listTwo); //! Не корректно из-за изменений в коде ниже!
// Для объединения 
listTwo.next.next = secondList;
console.log(listTwo); //! Не корректно из-за изменений в коде ниже!

// Для добавления нового элемента в начало необходимо обновить перввый элемент списка
listTwo = { value: 'New item', next: listTwo};
console.log(listTwo); //! Не корректно из-за изменений в коде ниже!

// Чтобы удалить элемент из списка нужно изменить значение "next" предыдущего элеиента
listTwo.next = listTwo.next.next;
console.log(listTwo);

/*
 Главным недостатком списка в сравнении с массивом является то, что невозможно
получить доступ к элементу по его индексу. В простом массиве: arr[n] является прямой ссылкой.
Но в списке необходимо начать с первого элемента и перейти в next N раз, чтобы получить N-й элемент.
*/





