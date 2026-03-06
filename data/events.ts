export interface Event {
    name: string;
    type: string;
    date: string;
}

export const events: Event[] = [
    { name: "Montgomery Museum of Fine Arts Tour", type: "Museum", date: "Today, 10:00 AM" },
    { name: "Riverfront Concert Series", type: "Event", date: "Tomorrow, 7:00 PM" },
    { name: "Rosa Parks Library Exhibit", type: "Historic", date: "Ongoing" },
];