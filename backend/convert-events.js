// convert-events.js
import fs from 'fs';

// ファイルパス
const inputFilePath = 'calendar.json';
const outputFilePath = 'expanded-calendar.json';

// JSONデータを読み込んで展開する関数
async function convertRecurringEvents() {
  try {
    const data = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));

    const expandedEvents = data.flatMap(event => {
      if (!event.rrule) {
        return [event]; // 単一イベントはそのまま返す
      }

      const initialStartDate = new Date(event.start);
      const initialEndDate = new Date(event.end);
      const rrule = event.rrule;
      const occurrences = [];
      let currentDate = new Date(rrule.origOptions.dtstart);
      const untilDate = new Date(rrule.origOptions.until);
      const weekdays = rrule.origOptions.byweekday.map(day => day.weekday);

      while (currentDate <= untilDate) {
        if (weekdays.includes(currentDate.getUTCDay())) {
          const occurrenceStart = new Date(currentDate);
          occurrenceStart.setUTCHours(initialStartDate.getUTCHours());
          occurrenceStart.setUTCMinutes(initialStartDate.getUTCMinutes());
          occurrenceStart.setUTCSeconds(initialStartDate.getUTCSeconds());

          const occurrenceEnd = new Date(currentDate);
          occurrenceEnd.setUTCHours(initialEndDate.getUTCHours());
          occurrenceEnd.setUTCMinutes(initialEndDate.getUTCMinutes());
          occurrenceEnd.setUTCSeconds(initialEndDate.getUTCSeconds());

          // 日をまたぐイベントの場合、終了日を調整
          if (occurrenceEnd < occurrenceStart) {
            occurrenceEnd.setUTCDate(occurrenceEnd.getUTCDate() + 1);
          }

          occurrences.push({
            ...event,
            start: occurrenceStart.toISOString(),
            end: occurrenceEnd.toISOString(),
            rrule: undefined // 繰り返しルールは削除
          });
        }
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }

      return occurrences;
    });

    fs.writeFileSync(outputFilePath, JSON.stringify(expandedEvents, null, 2));
    console.log(`Expanded events have been saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error processing events:', error);
  }
}

convertRecurringEvents();
