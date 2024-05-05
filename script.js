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
    //// parse json data
    async function getEventData() {
      const response = await fetch('backend/calendar.json');
      const data = await response.json();
      const events = data.map(event => {
        return {
          id: event.uid,
          title: event.summary,
          start: new Date(event.start),
          end: new Date(event.end),
          description: event.description,
          location: event.location
        }
      });
      return events;
    }

    getEventData().then(events => console.log(events)).catch(err => console.error(err));

    //// init fullcalendar
    getEventData().then(fullCalendarEvents => {
      const calendarEl = document.getElementById('mainCalendar');
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ja',
        events: fullCalendarEvents,
        eventClick: function(info) {
          document.getElementById('eventTitle').textContent = info.event.title;
          document.getElementById('eventStartDate').textContent = info.event.start.toLocaleString();
          document.getElementById('eventEndDate').textContent = info.event.end.toLocaleString();
          document.getElementById('eventLocation').textContent = info.event.extendedProps.location;
          document.getElementById('eventDescription').innerHTML = info.event.extendedProps.description;
          document.getElementById('eventDetails').style.display = 'block';
        }
      });
      calendar.render();
    }).catch(err => console.error(err));

    var closeEventDetails = document.getElementById('closeEventDetails');
    if (closeEventDetails) {
      closeEventDetails.addEventListener('click', function() {
        document.getElementById('eventDetails').style.display = 'none';
      });
    }

    // init current date
    var today = new Date();
    var endDate = new Date();
    endDate.setDate(today.getDate() + 7);
    var options = { month: 'long', day: 'numeric' };
    var weekday = { weekday: 'long' };

    var formattedDate = today.toLocaleDateString('ja-JP', options);
    var formattedWeekday = today.toLocaleDateString('ja-JP', weekday);

    document.getElementById('currentDate').textContent = formattedDate;
    document.getElementById('currentDay').textContent = formattedWeekday;
 

  });