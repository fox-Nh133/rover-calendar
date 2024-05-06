// fetch-calendar.js
import fs from 'fs';
import fetch from 'node-fetch';
import ical from 'ical';

// set Time zone
process.env.TZ = 'Asia/Tokyo';

async function fetchAndSaveCalendar() {
  const url = 'https://calendar.google.com/calendar/ical/27368b164f2ff54d4b7f165793fba4d2ef0706b2de617768c8c030ad0500e14c%40group.calendar.google.com/public/basic.ics';
  try {
    const response = await fetch(url);
    const data = await response.text();
    const parsedData = ical.parseICS(data);
    const events = Object.values(parsedData).filter(e => e.type === 'VEVENT').map(event => {
      const filteredEvents = { ...event};
      delete filteredEvents.dtstamp;
      return filteredEvents
    });
    fs.writeFileSync('calendar.json', JSON.stringify(events, null, 2));
    console.log('Calendar data updated successfully.');
  } catch (error) {
    console.error('Failed to fetch or save calendar data:', error);
  }
}

fetchAndSaveCalendar();
