export interface Landmark {
    id: number;
    name: string;
    year: number;
    description: string;
    image: string;
}

export const landmarks: Landmark[] = [
    {
        id: 1,
        name: "Civil Rights Memorial Center",
        year: 1989,
        description: "The Civil Rights Memorial is a memorial in Montgomery, Alabama, to 41 people who died in the struggle for the equal and integrated treatment of all people, during the civil rights movement in the United States. The memorial is sponsored by the Southern Poverty Law Center.",
        image: "/bg-landmark.png"
    },
    {
        id: 2,
        name: "Alabama State Capitol",
        year: 1851,
        description: "The Alabama State Capitol, listed on the National Register of Historic Places as the First Confederate Capitol, is the state capitol building for Alabama. It is located on Capitol Hill, originally known as Goat Hill, in Montgomery.",
        image: "/bg-landmark.png"
    },
    {
        id: 3,
        name: "Dexter Avenue King Memorial Baptist Church",
        year: 1883,
        description: "The Dexter Avenue King Memorial Baptist Church is a Baptist church in Montgomery, Alabama, affiliated with the Progressive National Baptist Convention. The church was designated as a National Historic Landmark in 1974 because of its importance in the civil rights movement and American history.",
        image: "/bg-landmark.png"
    }
];
