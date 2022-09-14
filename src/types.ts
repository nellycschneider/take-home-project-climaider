export type User = {
	id: string;
	name: string;
};

export type Message = {
	user: User;
	timestamp: number;
	message: string;
};

export interface ChatSectionProps {
	users: Array<User>;
}