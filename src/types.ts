export interface Person {
  id: string;
  name: string;
  isDuplicate?: boolean;
}

export interface Group {
  id: number;
  members: Person[];
}
