export type QuestionType = 'single' | 'multi' | 'text' | 'rating' | 'date' | 'select';

export interface Question {
    id: string;
    type: QuestionType;
    title: string;
    description?: string;
    options?: string[]; // For single/multi choice
    required: boolean;
    points: number;
}

export interface Survey {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    settings: {
        isPublic: boolean;
        pointsReward: number;
    };
}
