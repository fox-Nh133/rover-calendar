document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

      // Add a click event on each of them
      $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {

          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');

        });
      });
    }

    // init and sync calendar
    // weekly-calendar config
    var weeklyCalendarEl = document.getElementById('weekly-calendar');
    var weeklyCalendar = new FullCalendar.Calendar(weeklyCalendarEl, {
      locale: 'ja',
      initialView: 'listWeek',
      events:'27368b164f2ff54d4b7f165793fba4d2ef0706b2de617768c8c030ad0500e14c@group.calendar.google.com',
      googleCalendarApiKey: 'AIzaSyCsHXchDeAV3aW3NU6XC69K3bnzX69iJDs',
    });
    weeklyCalendar.render()

    // main-calendar config
    var mainCalendarEl = document.getElementById('main-calendar');
    var mainCalendar = new FullCalendar.Calendar(mainCalendarEl, {
      locale: 'ja',
      initialView: 'dayGridMonth',
      events:'27368b164f2ff54d4b7f165793fba4d2ef0706b2de617768c8c030ad0500e14c@group.calendar.google.com',
      googleCalendarApiKey: 'AIzaSyCsHXchDeAV3aW3NU6XC69K3bnzX69iJDs'
    });
    mainCalendar.render() 

    // init current date
    var today = new Date();
    var options = { month: 'long', day: 'numeric' };
    var weekday = { weekday: 'long' };

    var formattedDate = today.toLocaleDateString('ja-JP', options);
    var formattedWeekday = today.toLocaleDateString('ja-JP', weekday);

    document.getElementById('current-date').textContent = formattedDate;
    document.getElementById('current-day').textContent = formattedWeekday;

  });