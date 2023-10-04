import React from "react";
import { Resizable } from "../../core/resize/_resizable.core";
import "./sidebar.component.scss";

interface SidebarProps {
	handleChangeSize: () => void;
}

export const Sidebar = ({ handleChangeSize }: SidebarProps) => {
	return (
		<Resizable handleChangeSize={handleChangeSize}>
			<div className="sidebar-content"></div>
		</Resizable>
	);
};
