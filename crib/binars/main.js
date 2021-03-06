let { warn } = console;

warn("======== ArrayBuffer, бинарные массивы ========");

//* Базовый объект для работы с бинарными данными имеет тип ArrayBuffer и представляет собой ссылку на непрерывную область памяти фиксированной длины.
let buffer = new ArrayBuffer(16); // создаётся буфер длиной 16 байт
console.log(buffer.byteLength); // 16
/*
! ArrayBuffer – это не массив!
* ArrayBuffer не имеет ничего общего с Array:
 · его длина фиксирована, мы не можем увеличивать или уменьшать её.
 · ArrayBuffer занимает ровно столько места в памяти, сколько указывается при создании.
 · Для доступа к отдельным байтам нужен вспомогательный объект-представление, buffer[index] не сработает.

* ArrayBuffer – это область памяти. Что там хранится? Этой информации нет. Просто необработанный («сырой») массив байтов.

* Для работы с ArrayBuffer нужен специальный объект, реализующий «представление» данных.
 · Uint8Array – представляет каждый байт в ArrayBuffer как отдельное число; возможные значения находятся в промежутке
  от 0 до 255 (в байте 8 бит, отсюда такой набор). Такое значение называется «8-битное целое без знака».
 · Uint16Array – представляет каждые 2 байта в ArrayBuffer как целое число; возможные значения находятся в промежутке
  от 0 до 65535. Такое значение называется «16-битное целое без знака».
 · Uint32Array – представляет каждые 4 байта в ArrayBuffer как целое число; возможные значения находятся в промежутке
  от 0 до 4294967295. Такое значение называется «32-битное целое без знака».
 · Float64Array – представляет каждые 8 байт в ArrayBuffer как число с плавающей точкой; возможные значения находятся
  в промежутке между 5.0x10-324 и 1.8x10308.

 Если мы собираемся что-то записать в него или пройтись по его содержимому, да и вообще для любых действий мы должны использовать
какой-то объект-представление («view»), например:
*/
let view = new Uint32Array(buffer); // интерпретируем содержимое как последовательность 32-битных целых чисел без знака

console.log(Uint32Array.BYTES_PER_ELEMENT); // 4 байта на каждое целое число
console.log(view.length); // 4, именно столько чисел сейчас хранится в буфере
console.log(view.byteLength); // 16, размер содержимого в байтах

// запишем какое-нибудь значение
view[0] = 123456;

// пройдёмся по всем значениям
for (let num of view) console.log(num); // 123456, потом 0, 0, 0 (всего 4 значения)

/*
*TypedArray
 Общий термин для всех таких представлений (Uint8Array, Uint32Array и т.д.) – это TypedArray, типизированный массив.
У них имеется набор одинаковых свойств и методов.
 Они уже намного больше напоминают обычные массивы: элементы проиндексированы, и возможно осуществить обход содержимого.

* Есть 5 вариантов создания типизированных массивов:
new TypedArray(buffer, [byteOffset], [length]);
new TypedArray(object);
new TypedArray(typedArray);
new TypedArray(length);
new TypedArray();

 · Если передан аргумент типа ArrayBuffer, то создаётся объект-представление для него.
  Дополнительно можно указать аргументы byteOffset (0 по умолчанию) и length (до конца буфера по умолчанию),
   тогда представление будет покрывать только часть данных в buffer.
 · Если в качестве аргумента передан Array или какой-нибудь псевдомассив, то будет создан типизированный массив
  такой же длины и с тем же содержимым.
* Можно использовать эту возможность, чтобы заполнить типизированный массив начальными данными:
*/
let arr = new Uint8Array([0, 1, 2, 3,]);
console.log(arr.length); // 4, создан бинарный массив той же длины
console.log(arr[1]); // 1, заполнен 4-мя байтами с указанными значениями
/*
 · Если в конструктор передан другой объект типа TypedArray, то делается то же самое: создаётся типизированный массив
  с такой же длиной и в него копируется содержимое. При необходимости значения будут приведены к новому типу.
*/
let arr16 = new Uint16Array([1, 1000]);
let arr8 = new Uint8Array(arr16);
console.log(arr8[0]); // 1
console.log(arr8[1]); // 232, потому что 1000 не помещается в 8 бит
/*
 · Если передано число length – будет создан типизированный массив, содержащий именно столько элементов.
  Размер нового массива в байтах будет равен числу элементов length, умноженному на размер одного элемента TypedArray.
  BYTES_PER_ELEMENT:
*/
let newArr16 = new Uint16Array(4); // создаём типизированный массив для 4 целых 16-битных чисел без знака
console.log(Uint16Array.BYTES_PER_ELEMENT); // 2 байта на число
console.log(newArr16.byteLength); // 8 (размер массива в байтах)

// · При вызове без аргументов будет создан пустой типизированный массив.
/*
* Для доступа к ArrayBuffer в TypedArray есть следующие свойства:
 · buffer – ссылка на объект ArrayBuffer.
 · byteLength – размер содержимого ArrayBuffer в байтах.

*Список типизированных массивов:
 · Uint8Array, Uint16Array, Uint32Array – целые беззнаковые числа по 8, 16 и 32 бита соответственно.
 · Uint8ClampedArray – 8-битные беззнаковые целые, обрезаются по верхней и нижней границе при присвоении.
 · Int8Array, Int16Array, Int32Array – целые числа со знаком (могут быть отрицательными).
 · Float32Array, Float64Array – 32- и 64-битные числа со знаком и плавающей точкой.
*/

/*
* Методы TypedArray
 Типизированные массивы TypedArray, за некоторыми заметными исключениями, имеют те же методы, что и массивы Array.
Мы можем обходить их, вызывать map, slice, find, reduce и т.д.
* Однако, есть некоторые вещи, которые нельзя осуществить:
 · Нет метода splice – мы не можем удалять значения, потому что типизированные массивы – это всего лишь представления данных из буфера,
  а буфер – это непрерывная область памяти фиксированной длины. Мы можем только записать 0 вместо значения.
 · Нет метода concat.
* Но зато есть два дополнительных метода:
 · arr.set(fromArr, [offset]) копирует все элементы из fromArr в arr, начиная с позиции offset (0 по умолчанию).
 · arr.subarray([begin, end]) создаёт новое представление того же типа для данных, начиная с позиции begin до end (не включая).
  Это похоже на метод slice (который также поддерживается), но при этом ничего не копируется – просто создаётся новое представление,
  чтобы совершать какие-то операции над указанными данными.
*/
/*
* DataView
DataView – это специальное супергибкое нетипизированное представление данных из ArrayBuffer. Оно позволяет обращаться к данным на любой позиции
 и в любом формате.
 · В случае типизированных массивов конструктор строго задаёт формат данных. Весь массив состоит из однотипных значений.
  Доступ к i-ому элементу можно получить как arr[i].
 · В случае DataView доступ к данным осуществляется посредством методов типа .getUint8(i) или .getUint16(i).
  Мы выбираем формат данных в момент обращения к ним, а не в момент их создания.

* Синтаксис: new DataView(buffer, [byteOffset], [byteLength])

 · buffer – ссылка на бинарные данные ArrayBuffer. В отличие от типизированных массивов, DataView не создаёт буфер автоматически.
  Нам нужно заранее подготовить его самим.
 · byteOffset – начальная позиция данных для представления (по умолчанию 0).
 · byteLength – длина данных (в байтах), используемых в представлении (по умолчанию – до конца buffer).

 Например, извлечём числа в разных форматах из одного и того же буфера двоичных данных:
*/
// бинарный массив из 4х байт, каждый имеет максимальное значение 255
let newBuffer = new Uint8Array([255, 255, 255, 255]).buffer;

let dataView = new DataView(newBuffer);

// получим 8-битное число на позиции 0
console.log(dataView.getUint8(0)); // 255

// получим 16-битное число на той же позиции 0, оно состоит из 2-х байт, вместе составляющих число 65535
// console.log(dataView.getUnit16(0)); // 65535 (максимальное 16-битное беззнаковое целое) (не работает)

// получим 32-битное число на позиции 0
console.log(dataView.getUint32(0)); // 4294967295 (максимальное 32-битное беззнаковое целое)

dataView.setUint32(0, 0); // при установке 4-байтового числа в 0, во все его 4 байта будут записаны нули
/*
 Представление DataView отлично подходит, когда мы храним данные разного формата в одном буфере. Например, мы храним последовательность пар,
первое значение пары 16-битное целое, а второе – 32-битное с плавающей точкой. DataView позволяет легко получить доступ к обоим.
*/
/*
!  Дан массив из типизированных массивов Uint8Array. Вот функция concat(arrays),
! которая объединяет эти массивы в один типизированный массив и возвращает его.
*/
function concat(arrays) {
   if (!arrays.length) return null;

   // находим общую длину переданных массивов
   let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

   let result = new Uint8Array(totalLength);

   // копируем каждый из массивов в result
   // следующий массив копируется сразу после предыдущего
   let offset = 0;
   for (let array of arrays) {
      result.set(array, offset);
      offset += array.length;
   }

   return result;
}
// Ниндзя-код:
function concat2(arrays) {
   return new Uint8Array(arrays.flatMap(s => Array.from(s)));
}


warn("======== TextDecoder и TextEncoder ========");
/*
 Что если бинарные данные фактически являются строкой? Например, мы получили файл с текстовыми данными.
Встроенный объект TextDecoder позволяет декодировать данные из бинарного буфера в обычную строку.
Для этого прежде всего нам нужно создать сам декодер:
*let decoder = new TextDecoder([label], [options]);
 · label – тип кодировки, utf-8 используется по умолчанию, но также поддерживаются big5, windows-1251 и многие другие.
 · options – объект с дополнительными настройками:
  · fatal – boolean, если значение true, тогда генерируется ошибка для невалидных (не декодируемых) символов,
   в ином случае (по умолчанию) они заменяются символом \uFFFD.
  · ignoreBOM – boolean, если значение true, тогда игнорируется BOM (дополнительный признак, определяющий порядок следования байтов),
   что необходимо крайне редко.
…и после использовать его метод decode:
* let str = decoder.decode([input], [options]);
 · input – бинарный буфер (BufferSource) для декодирования.
 · options – объект с дополнительными настройками:
  · stream – true для декодирования потока данных, при этом decoder вызывается вновь и вновь для каждого следующего фрагмента данных.
 В этом случае многобайтовый символ может иногда быть разделён и попасть в разные фрагменты данных. Это опция указывает TextDecoder запомнить символ,
на котором остановился процесс, и декодировать его со следующим фрагментом.
*/
// Например:
let uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
console.log(new TextDecoder().decode(uint8Array)); // Hello

let uint8ArrayTwo = new Uint8Array([228, 189, 160, 229, 165, 189]);
console.log(new TextDecoder().decode(uint8ArrayTwo)); // 你好

// Можно декодировать часть бинарного массива, создав подмассив:
let uint8ArrayTree = new Uint8Array([0, 72, 101, 108, 108, 111, 0]);
let binaryString = uint8ArrayTree.subarray(1, -1);
console.log(new TextDecoder().decode(binaryString)); // Hello

/*
* TextEncoder
 TextEncoder поступает наоборот – кодирует строку в бинарный массив.
Имеет следующий синтаксис:
*/
let encoder = new TextEncoder();
/*
 Поддерживается только кодировка «utf-8».
Кодировщик имеет следующие два метода:
 · encode(str) – возвращает бинарный массив Uint8Array, содержащий закодированную строку.
 · encodeInto(str, destination) – кодирует строку (str) и помещает её в destination, который должен быть экземпляром Uint8Array.
*/
let uint8ArrayUbort = encoder.encode("Hello");
console.log(uint8ArrayUbort); // 72,101,108,108,111


warn("======== Blob ========");
/*
 Объект Blob состоит из необязательной строки type (обычно MIME-тип) и blobParts – последовательности других объектов Blob, строк и BufferSource.
Благодаря type мы можем загружать и скачивать Blob-объекты, где type естественно становится Content-Type в сетевых запросах.
* Конструктор имеет следующий синтаксис: new Blob(blobParts, options);
 · blobParts – массив значений Blob/BufferSource/String.
 · options – необязательный объект с дополнительными настройками:
  · type – тип объекта, обычно MIME-тип, например. image/png,
  · endings – если указан, то окончания строк создаваемого Blob будут изменены в соответствии с текущей операционной системой (\r\n или \n).
   По умолчанию "transparent" (ничего не делать), но также может быть "native" (изменять).
*/
// создадим Blob из строки
let blob = new Blob(["<html>…</html>"], { type: 'text/html' });
// обратите внимание: первый аргумент должен быть массивом [...]

// создадим Blob из типизированного массива и строк
let hello = new Uint8Array([72, 101, 108, 108, 111]); // "hello" в бинарной форме
let helloBlob = new Blob([hello, ' ', 'world'], { type: 'text/plain' });
console.log(helloBlob);
/*
 Можно получить срез Blob, используя slice: blob.slice([byteStart], [byteEnd], [contentType]);
 · byteStart – стартовая позиция байта, по умолчанию 0.
 · byteEnd – последний байт, по умолчанию до конца.
 · contentType – тип type создаваемого Blob-объекта, по умолчанию такой же, как и исходный.
*/
/*
* Blob как URL
 Blob может быть использован как URL для <a>, <img> или других тегов, для показа содержимого.
При клике на ссылку мы загружаем динамически генерируемый Blob с hello world содержимым как файл:
*/
let linkBlob = new Blob(["Hello, world!"], { type: 'text/plain' });
link.href = URL.createObjectURL(blob);

// Мы также можем создать ссылку динамически..
let linklink = document.createElement('a');
linklink.download = 'hello.txt';

let blobblob = new Blob(['Hello, warld!'], { type: 'text/plain' });
linklink.href = URL.createObjectURL(blobblob);
// linklink.click(); // скачается фаил.txt
URL.revokeObjectURL(linklink.href);

//* URL.createObjectURL берёт Blob и создаёт уникальный URL для него в формате blob:<origin>/<uuid>.
/*
 Вот как выглядит сгенерированный URL:
blob:https://javascript.info/1e67e00e-860d-40a5-89ae-6ab0cbee6273
*/

/*
* Изображение в Blob
Мы можем создать Blob для изображения, части изображения или даже создать скриншот страницы. Что удобно для последующей загрузки куда-либо.
Операции с изображениями выполняются через элемент <canvas>:
 · Для отрисовки изображения (или его части) на холсте (canvas) используется canvas.drawImage.
 · Вызов canvas-метода .toBlob(callback, format, quality) создаёт Blob и вызывает функцию callback при завершении.
*/
/*
* Из Blob в ArrayBuffer
 Конструктор Blob позволяет создать Blob-объект практически из чего угодно, включая BufferSource.
Но если нам нужна производительная низкоуровневая обработка, мы можем использовать ArrayBuffer из FileReader:
*/
// получаем arrayBuffer из Blob
let fileReader = new FileReader();
fileReader.readAsArrayBuffer(blob);

fileReader.onload = function (event) {
   let arrayBuffer = fileReader.result;
};


warn("======== File и FileReader ========");
/*
 Объект File наследуется от объекта Blob и обладает возможностями по взаимодействию с файловой системой.
* Есть два способа его получить:
 Во-первых, есть конструктор, похожий на Blob: new File(fileParts, fileName, [options])
 · fileParts – массив значений Blob/BufferSource/строки.
 · fileName – имя файла, строка.
 · options – необязательный объект со свойством:
  · lastModified – дата последнего изменения в формате таймстамп (целое число).
 Во-вторых, чаще всего мы получаем файл из <input type="file"> или через перетаскивание с помощью мыши, или из других интерфейсов браузера.
  В этом случае файл получает эту информацию из ОС.

 Так как File наследует от Blob, у объектов File есть те же свойства плюс:
 · name – имя файла,
 · lastModified – таймстамп для даты последнего изменения.

 В этом примере мы получаем объект File из <input type="file">:
*/
function showFile(input) {
   let file = input.files[0]; // можно выбрать несколько фаилов (input.files – псевдомассив)

   console.log(`File name: ${file.name}`);
   console.log(`Last modified: ${file.lastModified}`);
}

/*
* FileReader
 FileReader объект, цель которого читать данные из Blob (и, следовательно, из File тоже).
Данные передаются при помощи событий, так как чтение с диска может занять время.
Конструктор:
*/
let reader = new FileReader(); // без аргументов
/*
* Основные методы:
 · readAsArrayBuffer(blob) – считать данные как ArrayBuffer
 · readAsText(blob, [encoding]) – считать данные как строку (кодировка по умолчанию: utf-8)
 · readAsDataURL(blob) – считать данные как base64-кодированный URL.
 · abort() – отменить операцию.

* Выбор метода для чтения зависит от того, какой формат мы предпочитаем, как мы хотим далее использовать данные.
 · readAsArrayBuffer – для бинарных файлов, для низкоуровневой побайтовой работы с бинарными данными. Для высокоуровневых операций у File есть свои методы, унаследованные от Blob, например, slice, мы можем вызвать их напрямую.
 · readAsText – для текстовых файлов, когда мы хотим получить строку.
 · readAsDataURL – когда мы хотим использовать данные в src для img или другого тега. Есть альтернатива – можно не читать файл, а вызвать URL.createObjectURL(file), детали в главе Blob.

* В процессе чтения происходят следующие события:
 · loadstart – чтение начато.
 · progress – срабатывает во время чтения данных.
 · load – нет ошибок, чтение окончено.
 · abort – вызван abort().
 · error – произошла ошибка.
 · loadend – чтение завершено (успешно или нет).

* Когда чтение закончено, мы сможем получить доступ к его результату следующим образом:
 · reader.result результат чтения (если оно успешно)
 · reader.error объект ошибки (при неудаче).

 Пример чтения файла:
*/
function readFile(input) {
   let file = input.files[0];
   let reader = new FileReader();

   reader.readAsText(file);

   reader.onload = function () {
      console.log(reader.result);
   }

   reader.onerror = function () {
      console.log(reader.error);
   };
}
/*
 FileReader работает для любых объектов Blob, а не только для файлов.
 Поэтому мы можем использовать его для преобразования Blob в другой формат:
 · readAsArrayBuffer(blob) – в ArrayBuffer,
 · readAsText(blob, [encoding]) – в строку (альтернатива TextDecoder),
 · readAsDataURL(blob) – в формат base64-кодированного URL.
*/




