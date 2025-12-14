import React from "react";

import { useAuth } from "auth";
import { isFunction } from "utils";

interface ICanProps {
	children: ((isAccess: boolean) => React.ReactNode) | React.ReactNode;
	required: string[];
	accessRequired?: boolean;
}

export const Can: React.FC<ICanProps> = ({ required, children, accessRequired = true }: ICanProps) => {
	const { hasPermissions } = useAuth();
	const hasAccess = hasPermissions(required, accessRequired);

	if (isFunction(children)) {
		return <>{children(hasAccess)}</>;
	}

	if (hasAccess) {
		return <>{children}</>;
	}

	return null;
};
