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

    //// check if two dates are the same
    function isSameDate(date1, date2) {
      return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
    }

    //// init fullcalendar
    getEventData().then(fullCalendarEvents => {
      const calendarEl = document.getElementById('mainCalendar');
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ja',
        events: fullCalendarEvents,
        eventClick: function(info) {
          // set event title
          document.getElementById('eventTitle').textContent = info.event.title;
          // set event date
          document.getElementById('eventStartDate').textContent = info.event.start.toLocaleString('ja-JP', { weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'});

          if (isSameDate(info.event.start, info.event.end)) {
            document.getElementById('eventEndDate').textContent = info.event.end.toLocaleString('ja-JP', { hour: 'numeric', minute: 'numeric'});
          } else {
            document.getElementById('eventEndDate').textContent = info.event.end.toLocaleString('ja-JP', { weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'});
          }
          // set event location and description
          document.getElementById('eventLocation').textContent = info.event.extendedProps.location;
          document.getElementById('eventDescription').innerHTML = info.event.extendedProps.description;
          // set event id
          document.getElementById('eventId').textContent = info.event.extendedProps.id;
          // show event details
          document.getElementById('eventDetails').style.display = 'block';
        }
      });
      calendar.render();
    }).catch(err => console.error(err));

    // close event details
    const closeEventDetails = document.querySelectorAll('.close-event-details');

    closeEventDetails.forEach(el => {
      el.addEventListener('click', () => {
        document.getElementById('eventDetails').style.display = 'none';
      });
    });

    // // export event as ics file
    // const exportEvent = document.getElementById('exportEvent');
    // exportEvent.addEventListener('click', () => {
    // const eventId = getElementById('eventId').textContent;
    // const icsParts = [
    //   'BEGIN:VCALENDAR',
    //   'VERSION:2.0',
    //   'BEGIN:VEVENT',
    //   `DTSTART:${event.start}`,
    //   `DTEND:${event.end}`,
    //   `SUMMARY:${event.summary}`,
    //   `DESCRIPTION:${event.description}`,
    //   `LOCATION:${event.location}`,
    //   'END:VEVENT'
    // ];
    

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

    // init closest event window
    //// get closest event
    getEventData().then(events => {
      const closestEvent = events.filter(event => new Date(event.start) > today).sort((a, b) => new Date(a.start) - new Date(b.start))[0];
      console.log(closestEvent);
      return closestEvent;
    }).then(closestEvent => {
      if (closestEvent) {
        // set event title
        document.getElementById('closestEventTitle').innerText = closestEvent.title;
        // set event date
        document.getElementById('closestEventStartDate').textContent = closestEvent.start.toLocaleString('ja-JP', {weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'});
        if (isSameDate(closestEvent.start, closestEvent.end)) {
          document.getElementById('closestEventEndDate').textContent = closestEvent.end.toLocaleString('ja-JP', { hour: 'numeric', minute: 'numeric'});
        } else {
          document.getElementById('closestEventEndDate').textContent = closestEvent.end.toLocaleString('ja-JP', {weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'});
        }
        // set event location and description
        document.getElementById('closestEventLocation').textContent = closestEvent.location;
        document.getElementById('closestEventDescription').textContent = closestEvent.description;
      } else {
        document.getElementById('closestEventDate').textContent = 'No upcoming events';
      }
    }).catch(err => console.error(err));
});