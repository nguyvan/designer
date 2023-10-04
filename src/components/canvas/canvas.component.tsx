import React from "react";
import "./canvas.component.scss";
import { Point, useCanvas } from "../../hooks/useCanvas.hook";
import { SizeI } from "../layout/layout.component";
import { Scrollbar, ScrollbarType } from "../../core/scroll/_scrollbar.core";

export interface CanvasProps {
	size?: SizeI;
	delta?: Point;
}

export const Canvas = ({ size }: CanvasProps) => {
	const [delta, setDelta] = React.useState<Point>({
		x: 0,
		y: 0,
	});

	const ref = useCanvas({ size, delta });

	const layoutRef = React.useRef<HTMLDivElement>(null);

	const handleWheel = (event: WheelEvent) => {
		const deltaX = event.deltaX;
		const deltaY = event.deltaY;

		setDelta((delta) => ({
			x: delta.x + deltaX,
			y: delta.y + deltaY,
		}));
	};

	React.useEffect(() => {
		const element = layoutRef.current;

		element!.addEventListener("wheel", handleWheel);
		return () => {
			element!.removeEventListener("wheel", handleWheel);
		};
	}, []);

	return (
		<div className="canvas-container" ref={layoutRef}>
			<canvas
				className="canvas-content"
				height={size?.y}
				width={size?.x}
				ref={ref}
			/>
			<Scrollbar
				type={ScrollbarType.HORIZOTAL}
				size={size!}
				delta={delta}
			/>
			<Scrollbar
				type={ScrollbarType.VERTICAL}
				size={size!}
				delta={delta}
			/>
		</div>
	);
};
