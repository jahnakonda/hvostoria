/* Хвостория — скрипты прототипа.
   Появление секций при прокрутке, мобильное меню, плавающая кнопка брони,
   честная заглушка формы (бэкенд подключим позже). */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- появление секций при прокрутке ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (n) { io.observe(n); });
    /* каскадная задержка появления внутри сеток */
    document.querySelectorAll('.facts-strip, .rates, .tags, .staff, .revs').forEach(function (grid) {
      Array.prototype.forEach.call(grid.children, function (child, i) {
        child.style.setProperty('--i', Math.min(i, 6));
      });
    });
  } else {
    reveals.forEach(function (n) { n.classList.add('in'); });
  }

  /* ---------- мобильное меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('site-nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- плавающая кнопка брони ----------
     Появляется после первого экрана (не в самом начале),
     исчезает, когда видна сама секция бронирования. */
  var floatcta = document.getElementById('floatcta');
  var hero = document.querySelector('.hero');
  var bron = document.getElementById('bron');
  if (floatcta && 'IntersectionObserver' in window && hero && bron) {
    var pastHero = false;
    var inBron = false;
    var sync = function () {
      var vis = pastHero && !inBron;
      floatcta.hidden = false;
      floatcta.classList.toggle('is-vis', vis);
    };
    new IntersectionObserver(function (en) {
      pastHero = !en[0].isIntersecting;
      sync();
    }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(function (en) {
      inBron = en[0].isIntersecting;
      sync();
    }, { threshold: 0.15 }).observe(bron);
  }

  /* ---------- форма бронирования (честная заглушка) ----------
     Бэкенда ещё нет: не показываем фальшивое «заявка принята». */
  var form = document.getElementById('bron-form');
  if (form) {
    var msg = form.querySelector('.form__msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var need = [];
      form.querySelectorAll('[required]').forEach(function (f) {
        var v = (f.type === 'checkbox') ? f.checked : f.value.trim();
        if (!v) need.push(f.closest('label').querySelector('span').textContent.replace('*', '').trim());
      });
      if (need.length) {
        msg.textContent = 'Заполните обязательные поля: ' + need.join(', ') + '.';
        return;
      }
      msg.textContent = 'Демо-версия: отправка заявок подключается на этапе бэкенда. Пока свяжитесь с нами по телефону — номер уточняется.';
    });
  }
})();