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
    //// parse ics url
    const calendarIcsUrl = 'https://calendar.google.com/calendar/ical/27368b164f2ff54d4b7f165793fba4d2ef0706b2de617768c8c030ad0500e14c%40group.calendar.google.com/public/basic.ics'
    fetch(calendarIcsUrl)
      .then(response => response.text())
      .then(data => {
        const jcalData = ICAL.parse(data);
        const comp = new ICAL.Component(jcalData);
        const mainEvents = comp.getAllSubcomponents('vevent').map(vevent => {
            const event = new ICAL.Event(vevent);
            return {
                title: event.summary,
                start: event.startDate.toJSDate(),
                end: event.endDate.toJSDate()
            };
        });

        //// render calendar 
        var mainCalendarEl = document.getElementById('calendar');
        var mainCalendar = new FullCalendar.Calendar(mainCalendarEl, {
            initialView: 'dayGridMonth',
            events: mainEvents
        });
        mainCalendar.render();
      })
      .catch(error => console.error('Error fetching data: ', error));

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

    // // init weekly calendar
    // const isoStart = today.toISOString();
    // const isoEnd = endDate.toISOString();

    // //// API request
    // const apiKey = 'AIzaSyCsHXchDeAV3aW3NU6XC69K3bnzX69iJDs';
    // const calendarId = '27368b164f2ff54d4b7f165793fba4d2ef0706b2de617768c8c030ad0500e14c@group.calendar.google.com'
    // const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${isoStart}&timeMax=${isoEnd}&singleEvents=true&orderBy=startTime`;

    // fetch(url)
    // .then(response => response.json())
    // .then(data => {
    //     renderEvents(data.items);
    // })
    // .catch(error => console.error('Error fetching data: ', error));

    // //// render calendar
    // function renderEvents(events) {
    //   const listContainer = document.getElementById('eventList');
    //   listContainer.innerHTML = '';  // 既存のリストをクリア
  
    //   events.forEach(event => {
    //       const listItem = document.createElement('div');
    //       const eventDate = new Date(event.start.date).toLocaleDateString('ja-JP');
    //       const eventTime = `${new Date(event.start.date).toLocaleTimeString('ja-JP')} - ${new Date(event.end.date).toLocaleTimeString('ja-JP')}`;
    //       listItem.innerHTML = {
    //           title: event.summary,
    //           date: eventDate,
    //           time: eventTime
    //       };
    //       listContainer.appendChild(listItem);
    //   });
    // }
 

  });