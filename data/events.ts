export interface Event {
    name: string;
    type: string;
    date: string;
    url: string;
}

export const events: Event[] = [
    { name: "Montgomery Museum of Fine Arts Tour", type: "Museum", date: "Today, 10:00 AM", url: "https://mmfa.org" },
    { name: "Riverfront Concert Series", type: "Event", date: "Tomorrow, 7:00 PM", url: "https://www.visitingmontgomery.com/events" },
    { name: "Rosa Parks Library Exhibit", type: "Historic", date: "Ongoing", url: "https://www.montgomeryalabama.gov/departments/library" },
];