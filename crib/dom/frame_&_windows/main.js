let { warn } = console;


warn("======== Открытие окон и методы window ========");
//* Всплывающее окно («попап» – от англ. Popup window)

window.open('https://javascript.info/'); // будет заблокировано
/*
 Они были придуманы для отображения нового контента поверх открытого главного окна. Но с тех пор появились другие способы сделать это:
JavaScript может загрузить содержимое вызовом fetch и показать его в тут же созданном <div>, так что попапы используются не каждый день.

* Блокировка попапов
 Всплывающее окно блокируется в том случае, если вызов window.open произошёл не в результате действия посетителя (например, события onclick).
*/
// попап будет показан или заблокирован зависит от настроек браузера
button.onclick = () => {
   window.open('https://javascript.info');
};

// откроется через 3 секунды
setTimeout(() => window.open('http://google.com'), 3000);
/*
 Попап откроется в Chrome, но будет заблокирован в Firefox.
Но если мы уменьшим тайм-аут до одной секунды, то попап откроется и в Firefox.

* Синтаксис открытия нового окна: window.open(url, name, params):
 · url - URL для загрузки в новом окне.
 · name - Имя нового окна. У каждого окна есть свойство window.name, в котором можно задавать, какое окно использовать для попапа.
  Таким образом, если уже существует окно с заданным именем – указанный в параметрах URL откроется в нем, в противном случае откроется новое окно.
 · params - Строка параметров для нового окна. Содержит настройки, разделённые запятыми. Важно помнить, что в данной строке не должно быть пробелов.
  Например width=200,height=100.

* Параметры в строке params:
 · Позиция окна:
  · left/top (числа) – координаты верхнего левого угла нового окна на экране. Существует ограничение:
   новое окно не может быть позиционировано вне видимой области экрана.
  · width/height (числа) – ширина и высота нового окна. Существуют ограничения на минимальную высоту и ширину,
   которые делают невозможным создание невидимого окна.
 · Панели окна:
  · menubar (yes/no) – позволяет отобразить или скрыть меню браузера в новом окне.
  · toolbar (yes/no) – позволяет отобразить или скрыть панель навигации браузера (кнопки вперёд, назад, перезагрузки страницы) нового окна.
  · location (yes/no) – позволяет отобразить или скрыть адресную строку нового окна. Firefox и IE не позволяют скрывать эту панель по умолчанию.
  · status (yes/no) – позволяет отобразить или скрыть строку состояния. Как и с адресной строкой, большинство браузеров будут принудительно показывать её.
  · resizable (yes/no) – позволяет отключить возможность изменения размера нового окна. Не рекомендуется.
  · scrollbars (yes/no) – позволяет отключить полосы прокрутки для нового окна. Не рекомендуется.
*/
//* Пример: минималистичное окно
let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000`;
open('/', 'test', params);
/*
 Большинство браузеров «исправит» странные значения – как, например, нулевые width/height и отрицательные left/top.
Например, Chrome установит высоту и ширину такого окна равной высоте и ширине экрана, так что попап будет занимать весь экран.
*/
//* Закрытие попапа
// Чтобы закрыть окно: 
window.close();
// Для проверки, закрыто ли окно: win.closed.
/*
* Изменение размеров
Методы для передвижения и изменения размеров окна:
 · win.moveBy(x,y) - Переместить окно относительно текущей позиции на x пикселей вправо и y пикселей вниз.
  Допустимы отрицательные значения (для перемещения окна влево и вверх).
 · win.moveTo(x,y) - Переместить окно на координаты экрана (x,y).
 · win.resizeBy(width,height) - Изменить размер окна на указанные значения width/height относительно текущего размера.
  Допустимы отрицательные значения.
 · win.resizeTo(width,height) - Изменить размер окна до указанных значений.

* Прокрутка окна
 · win.scrollBy(x,y) - Прокрутить окно на x пикселей вправо и y пикселей вниз относительно текущей прокрутки. Допустимы отрицательные значения.
 · win.scrollTo(x,y) - Прокрутить окно до заданных координат (x,y).
 · elem.scrollIntoView(top = true) - Прокрутить окно так, чтобы elem для elem.scrollIntoView(false) появился вверху (по умолчанию) или внизу.
 · Также существует событие window.onscroll.
*/


warn("======== Общение между окнами ========");
/*
* Политика «Одинакового источника» (Same Origin) ограничивает доступ окон и фреймов друг к другу.
 Идея заключается в том, что если у пользователя открыто две страницы: john-smith.com и gmail.com, то у скрипта со страницы john-smith.com
не будет возможности прочитать письма из gmail.com.

* Политика «Одинакового источника» говорит, что:
 · если у нас есть ссылка на другой объект window, например, на всплывающее окно, созданное с помощью window.open или на window из <iframe>
  и у этого окна тот же источник, то к нему будет полный доступ.
 · в противном случае, если у него другой источник, мы не сможем обращаться к его переменным, объекту document и так далее.
  Единственное исключение – объект location: его можно изменять (таким образом перенаправляя пользователя).
   Но нельзя читать location (нельзя узнать, где находится пользователь, чтобы не было никаких утечек информации).

* Внутри <iframe> находится по сути отдельное окно с собственными объектами document и window.
 · iframe.contentWindow ссылка на объект window внутри <iframe>.
 · iframe.contentDocument – ссылка на объект document внутри <iframe>, короткая запись для iframe.contentWindow.document.
*/
// чтение и запись в ифрейм с другим источником:
iframe.onload = () => {
   let iframeWindow = iframe.contentWindow; // можно получить ссылку на внутренний window
   try {
      let doc = iframe.contentDocument; // ...но не на document внутри него
   } catch (e) {
      console.log(e);
   }

   // также мы не можем прочитать URL страницы в ифрейме
   try {
      // Нельзя читать из объекта Location
      let href = iframe.contentWindow.location.href; // ОШИБКА
   } catch (e) {
      alert(e); // Security Error
   }

   // ...но можно писать в него (и загрузить что-то другое в ифрейм)!
   iframe.contentWindow.location = '/'; // OK

   iframe.onload = null; // уберём обработчик, чтобы не срабатывал после изменения location
}
/*
* Окна на поддоменах: document.domain
 о определению, если у двух URL разный домен, то у них разный источник.

 Но если в окнах открыты страницы с поддоменов одного домена 2-го уровня, например john.site.com, peter.site.com и site.com
(так что их общий домен site.com), то можно заставить браузер игнорировать это отличие.
 Для этого в каждом таком окне нужно запустить:
 document.domain = 'site.com';


* inframe: подождите документ!
! Когда inframe – с того же источника, мы имеем доступ к документу в нём. Но есть подвох.
Когда inframe создан, в нём сразу есть документ. Но этот документ – другой, не тот, который в него будет загружен!
 Так что если мы тут же сделаем что-то с этим документом, то наши изменения, скорее всего, пропадут.
*/
let oldDoc = iframeTwo.contentDocument;
iframeTwo.onload = () => {
   let newDoc = iframeTwo.contentDocument;
   // загруженный document - не тот, который был в iframe при создании изначально!
   console.log(oldDoc == newDoc); // false
}

//* Как поймать момент, когда появится правильный документ?
let oldDocTree = iframeTree.contentDocument;
iframeTree.onload = () => {
   let timer = setTimeout(() => {
      let newDocTree = iframeTree.contentDocument;
      if (newDocTree == oldDocTree) return;

      console.log("New document is here!");
      clearInterval(timer); // отключим setInterval, он нам больше не нужен
   }, 100);
}

/*
* Коллекция window.frames
Другой способ получить объект window из <iframe> – забрать его из именованной коллекции window.frames:
 · По номеру: window.frames[0] – объект window для первого фрейма в документе.
 · По имени: window.frames.iframeName – объект window для фрейма со свойством name="iframeName".
*/
console.log(iframeTree.contentWindow == frames[0]); // true
console.log(iframeTree.contentWindow == frames.win); // true
/*
* Ифрейм может иметь другие ифреймы внутри. Таким образом, объекты window создают иерархию.
Навигация по ним выглядит так:
 · window.frames – коллекция «дочерних» window (для вложенных фреймов).
 · window.parent – ссылка на «родительский» (внешний) window.
 · window.top – ссылка на самого верхнего родителя.
*/
console.log(window.frames[0].parent === window); // true

//* Можно использовать свойство top, чтобы проверять, открыт ли текущий документ внутри ифрейма или нет:
if (window == top) { // текущий window == window.top?
   console.log('Скрипт находится в самом верхнем объекте window, не во фрейме');
} else {
   console.log('Скрипт запущен во фрейме!');
}

/*
* Атрибут ифрейма sandbox
 Атрибут sandbox позволяет наложить ограничения на действия внутри <iframe>, чтобы предотвратить выполнение ненадёжного кода.
Атрибут помещает ифрейм в «песочницу», отмечая его как имеющий другой источник и/или накладывая на него дополнительные ограничения.
 · allow-same-origin - "sandbox" принудительно устанавливает «другой источник» для ифрейма. Другими словами,
 он заставляет браузер воспринимать iframe, как пришедший из другого источника, даже если src содержит тот же сайт.
 Со всеми сопутствующими ограничениями для скриптов. Эта опция отключает это ограничение.
 · allow-top-navigation - Позволяет ифрейму менять parent.location.
 · allow-forms - Позволяет отправлять формы из ифрейма.
 · allow-scripts - Позволяет запускать скрипты из ифрейма.
 · allow-popups - Позволяет открывать всплывающие окна из ифрейма с помощью window.open.


* Обмен сообщениями между окнами
 Интерфейс postMessage позволяет окнам общаться между собой независимо от их происхождения.
Это способ обойти политику «Одинакового источника». Он позволяет обмениваться информацией, скажем john-smith.com и gmail.com,
но только в том случае, если оба сайта согласны и вызывают соответствующие JavaScript-функции.
Это делает общение безопасным для пользователя.
* postMessage
 Окно, которое хочет отправить сообщение, должно вызвать метод postMessage окна получателя.
win.postMessage(data, targetOrigin).
* Аргементы:
 · data - Данные для отправки.
 · targetOrigin - Определяет источник для окна-получателя, только окно с данного источника имеет право получить сообщение.
*/
// Например, здесь win получит сообщения только в том случае, если в нём открыт документ из источника http://example.com:
let win = window.frames.example;

win.postMessage("message", "http://example.com");

// Если мы не хотим проверять, то в targetOrigin можно указать *.
win.postMessage("message", "*");
/*
* Событие message
 Чтобы получать сообщения, окно-получатель должно иметь обработчик события message (сообщение).
Оно срабатывает, когда был вызван метод postMessage (и проверка targetOrigin пройдена успешно).
Объект события имеет специфичные свойства:
 · data - Данные из postMessage.
 · origin - Источник отправителя, например, http://javascript.info.
 · source - Ссылка на окно-отправитель. Можно сразу отправить что-то в ответ, вызвав source.postMessage(...).
*/
//* Чтобы добавить обработчик, следует использовать метод addEventListener, короткий синтаксис window.onmessage не работает.
window.addEventListener("message", function (event) {
   if (event.origin != 'http://javascript.info') {
      // что-то пришло с неизвестного домена. Давайте проигнорируем это
      return;
   }

   alert("received: " + event.data);

   // can message back using event.source.postMessage(...)
});


warn("======== Атака типа clickjacking ========");
/*
 Атака сlickjacking – это способ хитростью «заставить» пользователей кликнуть на сайте-жертве, без понимания, что происходит.
Она опасна, если по клику могут быть произведены важные действия.
 · Для защиты от этой атаки рекомендуется использовать X-Frame-Options: SAMEORIGIN на страницах или даже целиком сайтах,
  которые не предназначены для просмотра во фрейме.
 · Или, если мы хотим разрешить отображение страницы во фрейме и при этом оставаться в безопасности,
  то можно использовать перекрывающий блок <div>.
*/




















































