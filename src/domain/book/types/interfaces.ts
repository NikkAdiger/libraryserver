export interface IGetAllBooks {
	userId?: string;
	search?: string;
	page: number;
	limit: number;
}

export interface IUpdateRating {
	userId: string;
	bookId: string;
	rating: number;
}