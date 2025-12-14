import { Spin } from "antd";
import { PropsWithChildren, FC } from "react";
import { Outlet } from "react-router";

import { useAuth } from "./AuthProvider";

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
	const { pending } = useAuth();

	if (pending) return <Spin fullscreen />;

	return children || <Outlet />;
};
