import React from "react";
import { Canvas } from "../canvas/canvas.component";
import { Sidebar } from "../sidebar/sidebar.component";
import "./layout.component.scss";

export interface SizeI {
	x: number;
	y: number;
}

export const Layout = () => {
	const [size, setSize] = React.useState<SizeI>();

	const handleChangeSize = () => {
		const boundingSidebar = document
			.getElementById("__sidebar")!
			.getBoundingClientRect();
		const boundingLayout = document
			.getElementById("__layout")!
			.getBoundingClientRect();

		setSize({
			x: boundingLayout.width - boundingSidebar.width,
			y: boundingLayout.height,
		});
	};

	React.useEffect(() => {
		handleChangeSize();
	}, []);

	return (
		<div className="layout-container" id="__layout">
			<Sidebar handleChangeSize={handleChangeSize} />
			<Canvas size={size} />
		</div>
	);
};
