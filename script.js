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

    // init monthly calendar (fullcalendar integration)
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
    var endDate = new Date();
    endDate.setDate(today.getDate() + 7);
    var options = { month: 'long', day: 'numeric' };
    var weekday = { weekday: 'long' };

    var formattedDate = today.toLocaleDateString('ja-JP', options);
    var formattedWeekday = today.toLocaleDateString('ja-JP', weekday);

    document.getElementById('current-date').textContent = formattedDate;
    document.getElementById('current-day').textContent = formattedWeekday;

    // init weekly calendar
    const isoStart = today.toISOString();
    const isoEnd = endDate.toISOString();

    //// API request
    const apiKey = 'AIzaSyCsHXchDeAV3aW3NU6XC69K3bnzX69iJDs';
    const calendarId = '27368b164f2ff54d4b7f165793fba4d2ef0706b2de617768c8c030ad0500e14c@group.calendar.google.com'
    const url = 'https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${isoStart}&timeMax=${isoEnd}&singleEvents=true&orderBy=startTime';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        renderCalendar(data.items);
    })
    .catch(error => console.error('Error fetching data: ', error));

    //// render calendar
    function renderCalendar(events) {
      const weeklyCalendar = document.getElementById('weekly-calendar');
      const table = document.createElement('table');
      table.className = 'event-table';
  
      const thead = table.createTHead();
      const headerRow = thead.insertRow();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      days.forEach(day => {
          const th = document.createElement('th');
          th.textContent = day;
          headerRow.appendChild(th);
      });
  
      const tbody = table.createTBody();
      const row = tbody.insertRow();
      
      events.forEach(event => {
          const cell = row.insertCell();
          cell.textContent = `${event.summary}: ${new Date(event.start.dateTime).toLocaleTimeString()} - ${new Date(event.end.dateTime).toLocaleTimeString()}`;
      });
  
      weeklyCalendar.appendChild(table);
    }
  

  });