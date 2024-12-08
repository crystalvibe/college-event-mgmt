// Initial categories and subcategories as mutable arrays
export const EVENT_CATEGORIES: string[] = ["Technical", "Cultural", "Sports", "Other"];

type EventSubcategories = {
  [key: string]: string[];
};

export const EVENT_SUBCATEGORIES: EventSubcategories = {
  Technical: [
    "Hackathon",
    "Workshop",
    "Coding Competition",
    "Project Exhibition",
    "Technical Quiz",
    "Paper Presentation",
    "Other"
  ],
  Cultural: [
    "Dance",
    "Music",
    "Drama",
    "Fashion Show",
    "Art Exhibition",
    "Photography",
    "Other"
  ],
  Sports: [
    "Cricket",
    "Football",
    "Basketball",
    "Volleyball",
    "Athletics",
    "Chess",
    "Other"
  ],
  Other: ["Other"]
};

// Function to add new categories
export const addNewCategory = (category: string) => {
  if (!EVENT_CATEGORIES.includes(category)) {
    EVENT_CATEGORIES.push(category);
    EVENT_SUBCATEGORIES[category] = ["Other"];
  }
};

// Function to add new subcategories
export const addNewSubcategory = (category: string, subcategory: string) => {
  if (EVENT_SUBCATEGORIES[category]) {
    if (!EVENT_SUBCATEGORIES[category].includes(subcategory)) {
      EVENT_SUBCATEGORIES[category].push(subcategory);
    }
  }
};