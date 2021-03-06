let { warn } = console;


warn("=== MutationObserver: наблюдатель за изменениями ===");
/*
 Это встроенный объект, наблюдающий за DOM-элементом и запускающий колбэк в случае изменений.

* let observer = new MutationObserver(callback); - создаём наблюдатель за изменениями с помощью колбэк-функции
* observer.observe(node, config); - потом прикрепляем его к DOM-узлу:

* config – это объект с булевыми параметрами «на какие изменения реагировать»:
 · childList – изменения в непосредственных детях node,
 · subtree – во всех потомках node,
 · attributes – в атрибутах node,
 · attributeFilter – массив имён атрибутов, чтобы наблюдать только за выбранными.
 · characterData – наблюдать ли за node.data (текстовое содержимое),
 · characterDataOldValue – если true, будет передавать и старое и новое значение node.data в колбэк (см далее),
  иначе только новое (также требуется опция characterData),
 · attributeOldValue – если true, будет передавать и старое и новое старое значение атрибута в колбэк (см далее),
  иначе только новое (также требуется опция attributes).

 Затем, после изменений, выполняется callback, в который изменения передаются первым аргументом как список объектов MutationRecord,
а сам наблюдатель идёт вторым аргументом.

* Объекты MutationRecord имеют следующие свойства:
 · type – тип изменения, один из:
  · "attributes" изменён атрибут,
  · "characterData" изменены данные elem.data, это для текстовых узлов
  · "childList" добавлены/удалены дочерние элементы,
 · target – где произошло изменение: элемент для "attributes", текстовый узел для "characterData" или элемент для "childList",
 · addedNodes/removedNodes – добавленные/удалённые узлы,
 · previousSibling/nextSibling – предыдущий или следующий одноуровневый элемент для добавленных/удалённых элементов,
 · attributeName/attributeNamespace – имя/пространство имён (для XML) изменённого атрибута,
 · oldValue – предыдущее значение, только для изменений атрибута или текста,
  если включена соответствующая опция attributeOldValue/characterDataOldValue.


 Для примера возьмём <div> с атрибутом contentEditable. Этот атрибут позволяет нам сфокусироваться на элементе,
например, кликнув, и отредактировать содержимое.
*/
let observer = new MutationObserver(MutationRecords => {
   console.log(MutationRecords); // имзменения
});

observer.observe(elem, {
   childList: true, // наблюдать за непосредственными детьми
   subtree: true, // и более глубокими потомками
   characterDataOldValue: true // передавать старое значение в колбэк
});

/*
 Теперь, если мы изменим текст внутри <b>меня</b>, мы получим единичное изменение.
Если мы выберем или удалим <b>меня</b> полностью, мы получим сразу несколько изменений.

 ...детали изменений зависят от того, как браузер обрабатывает такое удаление.
он может соединить два соседних текстовых узла "Отредактируй " и ", пожалуйста" в один узел 
или может оставить их разными текстовыми узлами.

* Когда это может быть нужно?
 Бывают ситуации, когда сторонний скрипт добавляет что-то в наш документ(..рекламу), и мы хотели бы отследить, когда это происходит,
чтобы адаптировать нашу страницу, динамически поменять какие-то размеры и т.п.


* Дополнительные методы
 · observer.disconnect() – останавливает наблюдение.

 Вместе с ним используют метод:
 · mutationRecords = observer.takeRecords() – получает список необработанных записей изменений, которые произошли,
  но колбэк для них ещё не выполнился.
*/
observer.disconnect(); // отключаем наблюдатель
// но возможно, он не успел обработать некоторые изменения
let mutationRecords = observer.takeRecords(); // обработать mutationRecords

/*
* Сборка мусора
 Объекты MutationObserver используют внутри себя так называемые «слабые ссылки» на узлы, за которыми смотрят.
Так что если узел удалён из DOM и больше не достижим, то он будет удалён из памяти вне зависимости от наличия наблюдателя.
*/


warn("======== Selection и Range ========");
/*
 Выделение как в документе, так и в полях формы, таких как <input>.
JavaScript позволяет получать существующее выделение, выделять и снимать выделение как целиком, так и по частям,
убирать выделенную часть из документа, оборачивать её в тег и так далее.


* Range
 В основе выделения лежит Range – диапазон. Он представляет собой пару «граничных точек»: начало и конец диапазона.
Каждая точка представлена как родительский DOM-узел с относительным смещением от начала. 
Если этот узел – DOM-элемент, то смещение – это номер дочернего элемента, а для текстового узла смещение – позиция в тексте.
 Создание диапазона (конструктор не имеет параметров):
*/
let range = new Range();
/*
 · range.setStart(p, 0) – устанавливает начало диапазона на нулевом дочернем элементе тега <p> (Это текстовый узел "Example: ").
 · range.setEnd(p, 2) – расширяет диапазон до 2го (но не включая его) дочернего элемента тега <p>
  (это текстовый узел " and ", но так как конец не включён, последний включённый узел – это тег <i>).
*/
// Выделим "Example: <i>italic</i>". Это первые два дочерних узла тега <p> (учитывая текстовые узлы):
range.setStart(p, 0);
range.setEnd(p, 2);

// toString, вызванный у экземпляра Range, возвращает его содержимое в виде текста (без тегов)
console.log(range.toString()); // Example of Range: italic

// применим этот диапазон к выделению документа
// document.getSelection().addRange(range);

// Расширенный пример, в котором можно попробовать разные варианты:
button.onclick = () => {
   let range = new Range();

   range.setStart(p, start.value);
   range.setEnd(p, end.value);

   document.getSelection().removeAllRanges();
   document.getSelection().addRange(range);
}

/*
* Выделение частей текстовых узлов
 Необходимо просто установить начало и конец как относительное смещение в текстовых узлах.
Например, нужно создать диапазон, который:
 · начинается со второй позиции первого дочернего узла тега <p> (захватываем всё, кроме первых двух букв "Example: ")
 · заканчивается на 3 позиции первого дочернего узла тега <b> (захватываем первые три буквы «bold», но не более):
*/
let range2 = new Range();

range2.setStart(p2.firstChild, 2);
range2.setEnd(p2.querySelector('b').firstChild, 3);

console.log(range2.toString()); // ample of Range: italic and bol
window.getSelection().addRange(range2);

/*
* Объект диапазона Range имеет следующие свойства:
 · startContainer, startOffset – узел и начальное смещение, в примере выше: первый текстовый узел внутри тега <p> и 2.
 · endContainer, endOffset – узел и конечное смещение, в примере выше: первый текстовый узел внутри тега <b> и 3.
 · collapsed – boolean, true, если диапазон начинается и заканчивается на одном и том же месте (следовательно, в диапазон ничего не входит),
  в примере выше: false
 · commonAncestorContainer – ближайший общий предок всех узлов в пределах диапазона, в примере выше: <p>


* Методы Range
 Установить начало диапазона:
 · setStart(node, offset) установить начальную границу в позицию offset в node
 · setStartBefore(node) установить начальную границу прямо перед node
 · setStartAfter(node) установить начальную границу прямо после node

 Установить конец диапазона (похожи на предыдущие методы):
 · setEnd(node, offset) установить конечную границу в позицию offset в node
 · setEndBefore(node) установить конечную границу прямо перед node
 · setEndAfter(node) установить конечную границу прямо после node

 Другие:
 · selectNode(node) выделить node целиком
 · selectNodeContents(node) выделить всё содержимое node
 · collapse(toStart) если указано toStart=true, установить конечную границу в начало, иначе установить начальную границу в конец,
  схлопывая таким образом диапазон
 · cloneRange() создать новый диапазон с идентичными границами

 Чтобы манипулировать содержимым в пределах диапазона:
 · deleteContents() – удалить содержимое диапазона из документа
 · extractContents() – удалить содержимое диапазона из документа и вернуть как DocumentFragment
 · cloneContents() – склонировать содержимое диапазона и вернуть как DocumentFragment
 · insertNode(node) – вставить node в документ в начале диапазона
 · surroundContents(node) – обернуть node вокруг содержимого диапазона. Чтобы этот метод сработал, диапазон должен содержать как открывающие,
  так и закрывающие теги для всех элементов внутри себя: не допускаются частичные диапазоны по типу <i>abc.
*/

let range3 = new Range();

// Каждый описанный метод представлен здесь:
let methods = {
   deleteContents() {
      range3.deleteContents()
   },
   extractContents() {
      let content = range3.extractContents();
      result.innerHTML = "";
      result.append("Извлечено: ", content);
   },
   cloneContents() {
      let content = range3.cloneContents();
      result.innerHTML = "";
      result.append("Клонировано: ", content);
   },
   insertNode() {
      let newNode = document.createElement('u');
      newNode.innerHTML = "НОВЫЙ УЗЕЛ";
      range3.insertNode(newNode);
   },
   surroundContents() {
      let newNode = document.createElement('u');
      try {
         range3.surroundContents(newNode);
      } catch (e) { console.log(e) }
   },
   resetExample() {
      p3.innerHTML = `Example: <i>italic</i> and <b>bold</b>`;
      result.innerHTML = "";

      range3.setStart(p3.firstChild, 2);
      range3.setEnd(p3.querySelector('b').firstChild, 3);

      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range3);
   }
};

for (const method in methods) {
   document.write(`<div><button onclick="methods.${method}()">${method}</button></div>`);
}
methods.resetExample();
//* Также существуют методы сравнения диапазонов, но они редко используются.

/*
* Selection
 Range это общий объект для управления диапазонами выделения. Мы можем создавать и передавать подобные объекты.
Сами по себе они ничего визуально не выделяют.
 Выделение в документе представлено объектом Selection, который может быть получен как window.getSelection()
или document.getSelection().
 Выделение может включать ноль или более диапазонов. На практике же выделить несколько диапазонов в документе
можно только в Firefox, используя Ctrl+click (Cmd+click для Mac).


* Свойства Selection
 · anchorNode – узел, с которого начинается выделение,
 · anchorOffset – смещение в anchorNode, где начинается выделение,
 · focusNode – узел, на котором выделение заканчивается,
 · focusOffset – смещение в focusNode, где выделение заканчивается,
 · isCollapsed – true, если диапазон выделения пуст или не существует.
 · rangeCount – количество диапазонов в выделении, максимум 1 во всех браузерах, кроме Firefox.


* События при выделении
 · elem.onselectstart – когда с elem начинается выделение, например пользователь начинает двигать мышкой с зажатой кнопкой.
 · document.onselectionchange – когда выделение изменено (этот обработчик можно поставить только на document).
*/

//* Демо отслеживания выделения
document.onselectionchange = () => {
   let { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection();

   from.value = `${anchorNode && anchorNode.data}:${anchorOffset}`;
   to.value = `${focusNode && focusNode.data}:${focusOffset}`;
}
/*
* Чтобы получить всё выделение:
 · Как текст: document.getSelection().toString()
 · Как DOM-элементы: получите выделенные диапазоны и вызвать их метод cloneContents()
*/

//* Демо получения выделения как в виде текста, так и в виде DOM-узлов:
document.onselectionchange = () => {
   let selection = document.getSelection();

   cloned.innerHTML = astext.innerHTML = "";

   // Клонируем DOM-элементы из диапазонов (здесь мы поддерживаем множественное выделение)
   for (let i = 0; i < selection.rangeCount; i++) {
      cloned.append(selection.getRangeAt(i).cloneContents());
   }

   // Получаем как текст
   astext.innerHTML += selection;
};
/*
* Методы Selection
 · getRangeAt(i) – взять i-ый диапазон, начиная с 0. Во всех браузерах, кроме Firefox, используется только 0.
 · addRange(range) – добавить range в выделение. Все браузеры, кроме Firefox, проигнорируют этот вызов, если в выделении уже есть диапазон.
 · removeRange(range) – удалить range из выделения.
 · removeAllRanges() – удалить все диапазоны.
 · empty() – сокращение для removeAllRanges.

Также существуют методы управления диапазонами выделения напрямую, без обращения к Range:
 · collapse(node, offset) – заменить выделенный диапазон новым, который начинается и заканчивается на node, на позиции offset.
 · setPosition(node, offset) – то же самое, что collapse (дублирующий метод-псевдоним).
 · collapseToStart() – схлопнуть (заменить на пустой диапазон) к началу выделения,
 · collapseToEnd() – схлопнуть диапазон к концу выделения,
 · extend(node, offset) – переместить фокус выделения к данному node, с позиции offset,
 · setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset) – заменить диапазон выделения на заданные начало anchorNode/anchorOffset
  и конец focusNode/focusOffset. Будет выделено всё содержимое между этими границами
 · selectAllChildren(node) – выделить все дочерние узлы данного узла node.
 · deleteFromDocument() – удалить содержимое выделения из документа.
 · containsNode(node, allowPartialContainment = false) – проверяет, содержит ли выделение node (частично, если второй аргумент равен true)
*/

// Пример выделения всего параграфа id="p6" не обращаясь к связанному объекту Range.
document.getSelection().setBaseAndExtent(p6, 0, p6, p6.childNodes.length);

// То же самое с помощью Range (p7).
let rangeP7 = new Range();
rangeP7.selectNodeContents(p7); // или selectNode(p), чтобы выделить и тег <p>

// document.getSelection().removeAllRanges(); // очистить текущее выделение, если оно существует
// document.getSelection().addRange(p7); // может быть только одно выделение на странице (крома FireFox)
/*
! Если выделение уже существует, сначала снимите его, используя removeAllRanges(), и только затем добавляйте новые диапазоны.
!В противном случае все браузеры, кроме Firefox, проигнорируют добавление.
!Исключением являются некоторые методы выделения, которые заменяют существующее выделение, например, setBaseAndExtent.


* Выделение в элементах форм
 Элементы форм, такие как input и textarea, предоставляют отдельное API для выделения. Так как значения полей представляют собой простой текст,
а не HTML, и нам не нужны такие сложные объекты, как Range и Selection.

* Свойства:
 · input.selectionStart – позиция начала выделения (это свойство можно изменять),
 · input.selectionEnd – позиция конца выделения (это свойство можно изменять),
 · input.selectionDirection – направление выделения, одно из: «forward» (вперёд), «backward» (назад) или «none»
  (без направления, если, к примеру, выделено с помощью двойного клика мыши).

* События:
input.onselect – срабатывает, когда выделение завершено.

* Методы:
 · input.select() – выделяет всё содержимое input (может быть textarea вместо input),
 · input.setSelectionRange(start, end, [direction]) – изменить выделение, чтобы начиналось с позиции start, и заканчивалось end,
  в данном направлении direction (необязательный параметр).
 · input.setRangeText(replacement, [start], [end], [selectionMode]) – заменяет выделенный текст в диапазоне новым.
  Если аргументы start и end указаны, то они задают начало и конец диапазона, иначе используется текущее выделение.
 Последний аргумент, selectionMode, определяет, как будет вести себя выделение после замены текста. 

* Возможные значения:
 · "select" – только что вставленный текст будет выделен.
 · "start" – диапазон выделения схлопнется прямо перед вставленным текстом (так что курсор окажется непосредственно перед ним).
 · "end" – диапазон выделения схлопнется прямо после вставленного текста (курсор окажется сразу после него).
 · "preserve" – пытается сохранить выделение. Значение по умолчанию.
*/

// Этот код использует событие onselect, чтобы отслеживать выделение.
area.onselect = () => {
   fromTwo.value = area.selectionStart;
   toTwo.value = area.selectionEnd;
}
/*
! ЗАМЕТИТЬ !
 · onselect срабатывает при выделении чего-либо, но не при снятии выделения.
 · событие document.onselectionchange не должно срабатывать при выделении внутри элемента формы в соответствии со спецификацией,
  так как оно не является выделением элементов в document. Хотя некоторые браузеры генерируют это событие, полагаться на это не стоит.

 Когда selectionStart и selectionEnd равны друг другу. В этом случае они указывают на позицию курсора.
Иными словами, когда ничего не выбрано, выделение схлопнуто на позиции курсора.
 Задавая selectionStart и selectionEnd одно и то же значение, можно передвигать курсор.
*/
areaMove.onfocus = () => {
   // нулевая задержка setTimeout нужна, чтобы это сработало после получения фокуса элементом формы
   setTimeout(() => { // если начало и конец совпадают, курсор устанавливается на этом месте
      areaMove.selectionStart = areaMove.selectionEnd = 10;
   });
};
/*
 Чтобы изменять содержимое выделения, можно использовать метод input.setRangeText.
Это довольно сложный метод. В простейшем случае он принимает один аргумент, заменяет содержание выделенной области и снимает выделение.
В этом примере выделенный текст будет обёрнут в *...*:
*/
buttonStar.onclick = () => {
   if (inputStar.selectionStart == inputStar.selectionEnd) return;

   let selected = inputStar.value.slice(inputStar.selectionStart, inputStar.selectionEnd);
   inputStar.setRangeText(`*${selected}*`);
}

/*
* Сделать что-то невыделяемым
 Существуют три способа сделать что-то невыделяемым:
 · Использовать CSS-свойство user-select: none.
 Это свойство не позволяет начать выделение с elem, но пользователь может начать выделять с другого места и включить elem.
После этого elem станет частью document.getSelection(), так что на самом деле выделение произойдёт,
но его содержимое обычно игнорируется при копировании и вставке.
 · Предотвратить действие по умолчанию в событии onselectstart или mousedown. (elem.onselectstart = () => false;)
 Этот способ также не даёт начать выделение с elem, но пользователь может начать с другого элемента, а затем расширить выделение до elem.
 · Можно очистить выделение после срабатывания с помощью document.getSelection().empty(). Этот способ используется редко,
 так как он вызывает нежелаемое мерцание при появлении и исчезновении выделения.
*/


warn("=== Событийный цикл: микрозадачи и макрозадачи ===");
/*
* Алгоритм событийного цикла
 · Выбрать и исполнить старейшую задачу из очереди макрозадач (например, «script»).
 · Исполнить все микрозадачи:
  · Пока очередь микрозадач не пуста: - Выбрать из очереди и исполнить старейшую микрозадачу
 · Отрисовать изменения страницы, если они есть.
 · Если очередь макрозадач пуста – подождать, пока появится макрозадача.
 · Перейти к шагу 1.
 Чтобы добавить в очередь новую макрозадачу:
 · Использовать setTimeout(f) с нулевой задержкой.

 Этот способ можно использовать для разбиения больших вычислительных задач на части, чтобы браузер мог реагировать на пользовательские события
и показывать прогресс выполнения этих частей.
 Также это используется в обработчиках событий для отложенного выполнения действия после того, как событие полностью обработано
(всплытие завершено).

* Для добавления в очередь новой микрозадачи:
 · Используйте queueMicrotask(f).
 · Также обработчики промисов выполняются в рамках очереди микрозадач.
 События пользовательского интерфейса и сетевые события в промежутках между микрозадачами не обрабатываются:
микрозадачи исполняются непрерывно одна за другой. Поэтому queueMicrotask можно использовать для асинхронного выполнения функции
в том же состоянии окружения.
*/

//* Пример вывода в консоль сообщений в порядке очереди выполнения задач
setTimeout(function timeout() {
   console.log('Таймаут'); // №4
}, 0);

let z = new Promise(function (resolve, reject) {
   console.log('Создание промиса'); // №1
   resolve();
});

z.then(function () {
   console.log('Обработка промиса'); // №3
});

console.log('Конец скрипта'); // №2



