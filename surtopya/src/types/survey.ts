export type QuestionType = 'single' | 'multi' | 'text' | 'short' | 'long' | 'rating' | 'date' | 'select' | 'section';

export interface LogicRule {
    triggerOption: string;
    destinationQuestionId: string;
}

export interface Question {
    id: string;
    type: QuestionType;
    title: string;
    description?: string;
    options?: string[]; // For single/multi choice
    required: boolean;
    points: number;
    logic?: LogicRule[];
}

export interface SurveyTheme {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
}

export interface Survey {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    theme?: SurveyTheme;
    settings: {
        isPublic: boolean;
        pointsReward: number;
    };
}
