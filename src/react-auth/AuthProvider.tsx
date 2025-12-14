import { useState, createContext, useContext, useEffect, useRef } from "react";
import { UIMatch, useMatches, useNavigate } from "react-router";
import { App } from "antd";

import { parseJwt, showErrorMessage } from "utils";
import * as ROUTE_PATH from "constants/routes";
import { ENTERPRISE_STATES, USER_STATES } from "constants/guids";
import { useApi } from "api";
import { ILoginResponse } from "api/AuthRepository";
import { IUser } from "api/UsersRepository";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [pending, setPending] = useState(true);
	const isRefreshing = useRef(false);
	const api = useApi();
	const { message } = App.useApp();
	const matches = useMatches() as Array<
		UIMatch<unknown, { menuItem?: { roles?: string[]; accessRequired?: boolean } }>
	>;

	const tokenStorage = useTokensWithStorage();
	const navigate = useNavigate();

	const hasPermissions = (roles: string[], accessRequired?: boolean) => {
		return (
			(!roles.length || (!!user?.role && roles.includes(user.role))) &&
			(!accessRequired ||
				(user?.state.id === USER_STATES.ACTIVE &&
					// При ограничении доступа к компании hr/тренеры снова не видят полное меню
					(!user?.enterprise || user.enterprise.state?.id === ENTERPRISE_STATES.ACTIVE)))
		);
	};

	useEffect(() => {
		api.client.interceptors.response.use(null, async (error) => {
			//  код ошибки токен протух
			if ([401, 498].includes(error.response?.status) && !error.config?._retry && !isRefreshing.current) {
				const refreshToken = tokenStorage.getRefreshToken();
				if (!refreshToken) {
					signOut();
					return;
				}

				if (error.config) error.config._retry = true;
				isRefreshing.current = true;

				setPending(true);

				try {
					const response = await api.auth.refreshToken(refreshToken);
					setAuthData(response.data);

					return api.client(error.config);
				} catch (err) {
					signOut();
					showErrorMessage("Не удалось обновить refresh-токен", console.error)(err);
				} finally {
					setPending(false);
					isRefreshing.current = false;
				}
			}

			throw error;
		});

		checkAuth();
	}, []);

	const setTokenToApiClient = (token: string) => {
		api.client.defaults.headers.common.Authorization = token ? `Bearer ${token}` : undefined;
	};

	const loadUser = async (userId: string) => {
		setPending(true);
		try {
			const response = await api.users.getById(userId);
			if (response.data) {
				setUser(response.data);
			}
		} catch (error) {
			showErrorMessage("Ошибка аутентификации", message.error)(error);
		} finally {
			setPending(false);
		}
	};

	const setAuthData = ({
		accessToken,
		refreshToken,
		needRefreshUserRights,
	}: ILoginResponse & { needRefreshUserRights?: boolean }) => {
		tokenStorage.saveTokens({ access: accessToken, refresh: refreshToken });
		setTokenToApiClient(accessToken);

		const parsedAccessToken = parseJwt(accessToken);
		if (user?.id !== parsedAccessToken.Id || needRefreshUserRights) {
			return loadUser(parsedAccessToken.user_id);
		}

		return Promise.resolve();
	};

	const refreshUser = () => {
		if (user?.id) {
			loadUser(user.id);
		}
	};

	const resetAuthData = () => {
		tokenStorage.removeTokens();
		setUser(null);

		delete api.client.defaults.headers.common["Authorization"];
	};

	const signIn = (data: { login: string; password: string }) => {
		api.auth
			.login(data.login, data.password)
			.then((response) => {
				if (response?.data) setAuthData(response.data);
			})
			.catch(showErrorMessage("Ошибка аутентификации", message.error));
	};

	const signOut = () => {
		resetAuthData();
		navigate(ROUTE_PATH.LOGIN, { replace: true });
	};

	const logOut = async () => {
		const accessToken = tokenStorage.getAccessToken();

		if (accessToken) {
			const response = await api.auth.validateToken(accessToken);
			if (response?.data.isValid) {
				await api.auth.logOut();
			}
		}

		signOut();
	};

	const checkAuth = async () => {
		const refreshToken = tokenStorage.getRefreshToken();

		setPending(true);

		if (refreshToken) {
			try {
				const response = await api.auth.refreshToken(refreshToken);
				setAuthData(response.data);
			} catch (error) {
				signOut();
				showErrorMessage("Не удалось обновить refresh-токен", console.error)(error);
			}
		} else if (!hasAccessToCurrentRoute()) {
			signOut();
		}

		setPending(false);
	};

	const getAuthorizedRoutes = (routes: IRoute[]) => {
		return routes.reduce((accumulator: IRoute[], item) => {
			const itemShouldFillProfile = item.handle?.menuItem?.accessRequired;
			const itemRoles = item.handle?.menuItem?.roles || [];
			if (item.path && item.handle?.menuItem && hasPermissions(itemRoles, itemShouldFillProfile)) {
				accumulator.push({
					...item,
					...(item.children && {
						children: getAuthorizedRoutes(item.children),
					}),
				});
			}

			return accumulator;
		}, []);
	};

	const hasAccessToCurrentRoute = () => {
		for (const match of matches) {
			const itemShouldFillProfile = match.handle?.menuItem?.accessRequired;
			const itemRoles = match.handle?.menuItem?.roles || [];

			if (!hasPermissions(itemRoles, itemShouldFillProfile)) {
				return false;
			}
		}

		return true;
	};

	const value = {
		tokens: tokenStorage.getTokens(),
		user,
		signIn,
		signOut,
		logOut,
		pending,
		refreshUser,
		setAuthData,
		hasPermissions,
		getAuthorizedRoutes,
		hasAccessToCurrentRoute,
		setTokenToApiClient,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};

const AuthContext = createContext<IAuthContext>({
	user: null,
	tokens: {} as ITokens,
	signIn: () => {},
	signOut: () => {},
	logOut: () => Promise.resolve(),
	pending: true,
	setAuthData: () => Promise.resolve(),
	refreshUser: () => {},
	hasPermissions: () => false,
	getAuthorizedRoutes: () => [],
	hasAccessToCurrentRoute: () => false,
	setTokenToApiClient: () => {},
});

interface IAuthContext {
	user: IUser | null;
	tokens: ITokens;
	signIn: (data: { login: string; password: string }, callback?: VoidFunction) => void;
	signOut: () => void;
	logOut: () => Promise<void>;
	pending: boolean;
	setAuthData: ({ accessToken, refreshToken }: ILoginResponse) => Promise<void>;
	refreshUser: () => void;
	hasPermissions: (roles: string[], accessRequired: boolean) => boolean;
	getAuthorizedRoutes: (routes: IRoute[]) => IRoute[];
	hasAccessToCurrentRoute: () => boolean;
	setTokenToApiClient: (token: string) => void;
}

interface ITokens {
	access: string | null;
	refresh: string | null;
}

interface IRoute {
	path?: string;
	key?: string;
	handle?: {
		menuItem?: {
			label: string;
			icon?: JSX.Element;
			roles?: string[];
			accessRequired?: boolean;
		};
	};
	menuItem?: {
		label: string;
		icon?: JSX.Element;
		roles?: string[];
		accessRequired?: boolean;
	};
	children?: IRoute[];
}

const useTokensWithStorage = () => {
	const accessToken = useRef("");

	const saveTokens = (tokens: { access: string; refresh: string }) => {
		accessToken.current = tokens.access;
		localStorage.setItem(TOKEN_NAME_REFRESH, tokens.refresh); // TODO: вынести refresh-токен в httponly cookie
	};

	const removeTokens = () => {
		accessToken.current = "";
		localStorage.removeItem(TOKEN_NAME_REFRESH);
	};

	const getRefreshToken = () => {
		return localStorage.getItem(TOKEN_NAME_REFRESH) || "";
	};

	const getAccessToken = () => {
		return accessToken.current;
	};

	const getTokens = () => {
		return {
			access: getAccessToken(),
			refresh: getRefreshToken(),
		};
	};

	return {
		saveTokens,
		removeTokens,
		getAccessToken,
		getRefreshToken,
		getTokens,
	};
};

const TOKEN_NAME_REFRESH = "refresh";
