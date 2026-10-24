export interface GoogleCalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  start?: {
    date?: string; // "YYYY-MM-DD"
    dateTime?: string; // ISO string
  };
  end?: {
    date?: string;
    dateTime?: string;
  };
  htmlLink?: string;
  location?: string;
}

export async function fetchGoogleCalendarEvents(
  token: string,
  timeMin?: string,
  timeMax?: string
): Promise<GoogleCalendarEventItem[]> {
  const params = new URLSearchParams({
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '100'
  });
  if (timeMin) params.append('timeMin', timeMin);
  if (timeMax) params.append('timeMax', timeMax);

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Calendar API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return (data.items || []) as GoogleCalendarEventItem[];
}

export async function createGoogleCalendarEvent(
  token: string,
  event: {
    summary: string;
    description?: string;
    date: string; // YYYY-MM-DD
  }
): Promise<GoogleCalendarEventItem> {
  const body = {
    summary: event.summary,
    description: event.description || 'Created from Focus To-Do academic app',
    start: {
      date: event.date
    },
    end: {
      date: event.date
    }
  };

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create Google Calendar event: ${errorText}`);
  }

  return await res.json();
}

export async function deleteGoogleCalendarEvent(
  token: string,
  eventId: string
): Promise<boolean> {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!res.ok && res.status !== 404) {
    const errorText = await res.text();
    throw new Error(`Failed to delete Google Calendar event: ${errorText}`);
  }

  return true;
}
