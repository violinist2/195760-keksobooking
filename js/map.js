'use strict';
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Массив в случайном порядке (перемешивание массива)
function compareRandom(a, b) {
  return Math.random() - 0.5;
}

var LIST_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var LIST_TYPES = ['flat', 'house', 'bungalo'];
var LIST_TIMES = ['12:00', '13:00', '14:00'];
var LIST_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

// Наименования становятся в случайном порядке, чтобы каждое использовалось только один раз
LIST_TITLES.sort(compareRandom);

// Функция извлечения случайного элемента из массива
var getRandomElementArray = function (anyArray) {
  var randomNumber = getRandomNumber(0, anyArray.length - 1);
  // максимальный номер элемента в массиве = anyArray.length-1, т.к нумерация начинается с 0
  return anyArray[randomNumber];
}

// Функция извлечения случайного количества случайных удобств - вариант №1
/*
var getFeatures = function () {
  var oneFeatures = [];
  var lengthOfFeatures = getRandomNumber(0, LIST_FEATURES.length); // Вдруг число возможных удобств изменится
  for (var i = 0; i < lengthOfFeatures; i++) {
    var randomItem = getRandomElementArray(LIST_FEATURES); // Определенно это неправильно, выводятся случайным образом однаковые удобства
    oneFeatures.push(randomItem);
  }
  return oneFeatures;
}
*/

// Функция извлечения случайного количества случайных удобств - вариант №2, с поправкой, чтобы удобства не повторялись
var getFeatures = function () {
  LIST_FEATURES.sort(compareRandom); // перемешиваем массив удобств
  var oneFeatures = [];
  var lengthOfFeatures = getRandomNumber(0, LIST_FEATURES.length); // определяем количество удобств конкретного объяление
  for (var i = 0; i < lengthOfFeatures; i++) {
    var newItem = LIST_FEATURES[i]; // просто добавляем удобства с первого из перемешанного массива и далее
    oneFeatures.push(newItem); // добавляем в новый массив
  }
  return oneFeatures; // и отдаем массив на выход функции
}

var announcements = [];
for (i = 0; i < 8; i++) {
  var coordX = getRandomNumber(300, 900);
  var coordY = getRandomNumber(100, 500);
  var oneAds = {
    "author": {
      "avatar": 'img/avatars/user0' + (i + 1) + '.png'
    },
    "offer": {
      "title": getRandomElementArray(LIST_TITLES),
      "address": coordX + ',' + coordY,
      "price": getRandomNumber(1000, 1000000),
      "type": getRandomElementArray(LIST_TYPES),
      "rooms": getRandomNumber(1, 5),
      "guests": getRandomNumber(1, 100),
      "checkin": getRandomElementArray(LIST_TIMES),
      "checkout": getRandomElementArray(LIST_TIMES),
      "features": getFeatures(),
      "description": '',
      "photos": []
    },
    "location": {
      "x": coordX,
      "y": coordY
    }
  };
  // Добавление элемента в массив
  announcements.push(oneAds);
}

var deleteClassMap = document.querySelector('.map');
deleteClassMap.classList.remove('map--faded');


var fragment = document.createDocumentFragment();
//fragment = document.querySelector('.map__pin--main');
//var Marker = document.querySelector('.map__pin--main');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

//var avatarImg = document.querySelector('.map__pin--main img');
var avatarImg = pinTemplate.querySelector('img');
var fragmentPlace = document.querySelector('.map__pins');
var templateOffer = document.querySelector('template').content; //шаблон
var insertPlace = document.querySelector('.map');
for (var i = 0; i < announcements.length; i++) {
  //  var clonefragment = fragment.cloneNode(true);
  var clonefragment = pinTemplate.cloneNode(true);
  fragmentPlace.appendChild(clonefragment);
  //    fragment.style.top = announcements[i].location.y + 84 + 'px';
  //    fragment.style.left = announcements[i].location.x + 32 + 'px';
  pinTemplate.style.top = announcements[i].location.y + 84 + 'px';
  pinTemplate.style.left = announcements[i].location.x + 32 + 'px';

  avatarImg.src = announcements[i].author.avatar;
}

var renderPopupAnnouncement = function (oneAnnouncement) {
  var templateElement = templateOffer.cloneNode(true);
  insertPlace.appendChild(templateElement);
  var titleElement = document.querySelector('.map h3');
  titleElement.textContent = oneAnnouncement.offer.title;

  var addressElement = document.querySelector('small');
  addressElement.textContent = oneAnnouncement.offer.address;

  var priceElement = document.querySelector('.popup__price');
  priceElement.innerHTML = oneAnnouncement.offer.price + '&#x20bd;' + '/ночь';

  var houseElement = document.querySelector('h4');
  if (oneAnnouncement.offer.type == 'flat') {
    houseElement.textContent = 'Квартира';
  } else if (oneAnnouncement.offer.type == 'bungalo') {
    houseElement.textContent = 'Бунгало';
  } else {
    houseElement.textContent = 'Дом';
  }
  var roomsGuestElement = document.querySelector('h4 + p');
  roomsGuestElement.textContent = oneAnnouncement.offer.rooms + ' комнаты для ' + oneAnnouncement.offer.guests + ' гостей';
  var guestElement = document.querySelector('h4 + p + p');
  guestElement.textContent = 'заезд после ' + oneAnnouncement.offer.checkin + ', выезд до ' + oneAnnouncement.offer.checkout;// что вставляем

  var featuresElements = document.querySelector('.popup__features');
  for (var i = 0; i < 6; i++) { // удаляем из шаблона ВСЕ стоявшие в нём 6 удобств, мы точно знаем, что в шаблоне их 6, хотя можно улучшить
    var li = document.querySelectorAll(".popup__features li")[0];
    featuresElements.removeChild(li);
  }
  for (var i = 0; i < oneAnnouncement.offer.features.length; i++) { // по количеству удобств в конкретном объявлении создаём новые li
    var li = document.createElement("li");
    li.classList.add('feature'); // сначала отдельно основной класс
    li.classList.add('feature--' + oneAnnouncement.offer.features[i]); // второй заход, потому что не разрешает добавить в один заход полноценный двойной класс вида "feature feature--{{название удобства}}"
    featuresElements.appendChild(li);
  }

  var descriptionElement = document.querySelector('.popup__features').nextElementSibling
  descriptionElement.textContent = oneAnnouncement.offer.description;
  var avatarElement = document.querySelector('.popup__avatar');
  avatarElement.src = oneAnnouncement.author.avatar;
}
// Вызываем функцию с первым объявлением из массива
renderPopupAnnouncement(announcements[0]);
