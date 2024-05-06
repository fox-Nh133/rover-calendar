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
        height: 'auto',
        events: fullCalendarEvents,
        eventClick: function(info) {
          // set event title
          document.getElementById('eventTitle').textContent = info.event.title;
          // set event date
          document.getElementById('eventStartDate').textContent = info.event.start.toLocaleString('ja-JP', { weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC'});

          if (isSameDate(info.event.start, info.event.end)) {
            document.getElementById('eventEndDate').textContent = info.event.end.toLocaleString('ja-JP', { hour: 'numeric', minute: 'numeric', timeZone: 'UTC'});
          } else {
            document.getElementById('eventEndDate').textContent = info.event.end.toLocaleString('ja-JP', { weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone : 'UTC'});
          }
          // set event location and description
          document.getElementById('eventLocation').textContent = info.event.extendedProps.location;
          document.getElementById('eventDescription').innerHTML = info.event.extendedProps.description;
          // set event id
          document.getElementById('eventId').textContent = info.event.id;
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

    // export event as ics file
    const exportEvent = document.getElementById('exportEvent');
    async function getEventById(eventId) {
      const events = await getEventData();
      console.log(events); // データ配列を確認
      console.log('Searching for Event ID:', eventId); // 検索中のIDを確認
      const event = events.find(event => event.id === eventId);
      return event;
    }
    function formatICSDate(date) {
      const pad = num => num.toString().padStart(2, '0');
      return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
    }

    exportEvent.addEventListener('click', () => {
      const eventId = document.getElementById('eventId').textContent;
      getEventById(eventId).then(event => {
        const icsParts = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'CALSCALE:GREGORIAN',
          'BEGIN:VEVENT',
          `SUMMARY:${event.title}`,
          `DTSTART:${formatICSDate(new Date(event.start))}`,
          `DTEND:${formatICSDate(new Date(event.end))}`,
          `LOCATION:${event.location}`,
          `DESCRIPTION:${event.description}`,
          'STATUS:CONFIRMED',
          'END:VEVENT',
          'END:VCALENDAR'
        ];
        // create ics file
        const icsData = icsParts.join('\r\n');
        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        // create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'event.ics';
        link.click();
        // cleanup
        window.URL.revokeObjectURL(url);
      }
      ).catch(err => console.error(err));
    });

    // init current date
    var today = new Date();
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
        document.getElementById('closestEventStartDate').textContent = closestEvent.start.toLocaleString('ja-JP', {weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC'});
        if (isSameDate(closestEvent.start, closestEvent.end)) {
          document.getElementById('closestEventEndDate').textContent = closestEvent.end.toLocaleString('ja-JP', { hour: 'numeric', minute: 'numeric', timeZone: 'UTC'});
        } else {
          document.getElementById('closestEventEndDate').textContent = closestEvent.end.toLocaleString('ja-JP', {weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC'});
        }
        // set event location and description
        document.getElementById('closestEventLocation').textContent = closestEvent.location;
        document.getElementById('closestEventDescription').innerHTML = closestEvent.description;
      } else {
        document.getElementById('closestEventDate').textContent = 'No upcoming events';
      }
    }).catch(err => console.error(err));

    // copy ical url
    copyICALUrl = document.getElementById('copyICALUrl');
    function copyICALToClipboard() {
      const icalURL = document.getElementById('icalURL');
      icalURL.select();
      icalURL.setSelectionRange(0, 99999); // for mobile devices
      document.execCommand('copy');
    }

    copyICALUrl.addEventListener('click', copyICALToClipboard);

});