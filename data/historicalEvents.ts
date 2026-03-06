export interface HistoricalEvent {
    year: number;
    title: string;
    description: string;
    image: string;
    narration: string;
}

export const historicalEvents: HistoricalEvent[] = [
    {
        year: 1717,
        title: "Fort Toulouse Established",
        description: "French settlers establish Fort Toulouse near the confluence of the Coosa and Tallapoosa rivers, marking early European presence in the area.",
        image: "/bg-landmark.png",
        narration: "In 1717, French explorers and settlers established Fort Toulouse, a trading post that became a key outpost in the French colony of Louisiana. This fort represented the first significant European settlement in what would become Montgomery."
    },
    {
        year: 1819,
        title: "Montgomery Becomes State Capital",
        description: "Montgomery is selected as the capital of Alabama after the state is admitted to the Union.",
        image: "/bg-landmark.png",
        narration: "Following Alabama's admission to the Union in 1819, Montgomery was chosen as the state capital due to its central location and strategic position along the Alabama River. This decision shaped the city's future as a political and economic hub."
    },
    {
        year: 1861,
        title: "Confederate Capital",
        description: "Montgomery serves as the first capital of the Confederate States of America for four months.",
        image: "/bg-landmark.png",
        narration: "In February 1861, Montgomery became the temporary capital of the Confederate States of America. Jefferson Davis was inaugurated here, and the city played a crucial role in the early days of the American Civil War."
    },
    {
        year: 1955,
        title: "Rosa Parks and the Bus Boycott",
        description: "Rosa Parks' arrest sparks the Montgomery Bus Boycott, a pivotal event in the Civil Rights Movement.",
        image: "/bg-landmark.png",
        narration: "On December 1, 1955, Rosa Parks refused to give up her seat on a Montgomery bus, sparking the Montgomery Bus Boycott. This 381-day protest, led by Dr. Martin Luther King Jr., became a landmark event in the American Civil Rights Movement."
    },
    {
        year: 1965,
        title: "Selma to Montgomery Marches",
        description: "Civil rights marches from Selma to Montgomery lead to the passage of the Voting Rights Act.",
        image: "/bg-landmark.png",
        narration: "In 1965, the Selma to Montgomery marches brought national attention to voting rights issues. These peaceful protests, met with violence at the Edmund Pettus Bridge, ultimately led to the passage of the Voting Rights Act of 1965."
    }
];