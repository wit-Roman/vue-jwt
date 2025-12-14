import { AxiosInstance } from "axios";

export class AuthRepository {
	constructor(
		private client: AxiosInstance,
		private baseUrl: string
	) {}

	refreshToken = (refreshToken: string) => {
		return this.client.post<ILoginResponse & { needRefreshUserRights: boolean }>(
			`${this.baseUrl}AM/Token/RefreshTokens`,
			{ refreshToken },
			{}
		);
	};

	validateToken = (accessToken: string) => {
		return this.client.post<{ userId: string; isValid: boolean }>(
			`${this.baseUrl}AM/Token/ValidateToken`,
			{ accessToken },
			{}
		);
	};

	login = (email: string, password: string) => {
		return this.client.post<ILoginResponse>(`${this.baseUrl}AM/Access/Login`, {
			email,
			password,
		});
	};

	register = (data: IDataForRegistration) => {
		return this.client.post<IRegistrationResponse>(`${this.baseUrl}AM/Access/Registration`, data);
	};

	logOut = () => {
		return this.client.post(`${this.baseUrl}AM/Access/LogOut`);
	};

	validateContact = (data: IDataForContactValidation, excludeToken?: boolean) => {
		// Для неприглашенного пользователя нельзя указывать токен
		const config = excludeToken ? { headers: { Authorization: undefined } } : undefined;
		return this.client.post<void>(`${this.baseUrl}AM/Access/UserContactVerification`, data, config);
	};

	resendVerificationCode = () => {
		return this.client.get<{ contactId: string }>(`${this.baseUrl}AM/Access/RepeatSms`);
	};

	updatePassword = (oldPassword: string, password: string) => {
		return this.client.post<void>(`${this.baseUrl}AM/Access/UpdatePassword`, { oldPassword, password });
	};

	getRights = () => {
		return this.client.get<{ items: IRight[] }>(`${this.baseUrl}CommonAuthorization/GetCurrentUserRights`); // старый метод
	};

	getEmailConfirmation = (code: string) => {
		return this.client.get<ILoginResponse>(`${this.baseUrl}Validate/email`, { params: { code } });
	};
}

export interface ILoginResponse {
	refreshToken: string;
	accessToken: string;
}

export interface IDataForRegistration {
	phone: string;
	email: string;
	password: string;
	role: string;
}

export interface IRegistrationResponse {
	refreshToken: string;
	accessToken: string;
	contactId: string;
}

export interface IDataForContactValidation {
	contactId: string;
	code: string;
	inviteId: string | null;
}

export interface IRight {
	id: string;
	externalId: string;
	name: string;
	alias: string;
}
