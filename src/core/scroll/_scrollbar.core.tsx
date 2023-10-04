import React from "react";
import { SizeI } from "../../components/layout/layout.component";
import { Point } from "../../hooks/useCanvas.hook";
import "./_scrollbar.core.scss";

export enum ScrollbarType {
	HORIZOTAL = "HORIZOTAL",
	VERTICAL = "VERTITCAL",
}

export interface ScrollbarProps {
	type: ScrollbarType;
	delta: Point;
	size: SizeI;
}

export const Scrollbar = ({ type, delta, size }: ScrollbarProps) => {
	const ref = React.useRef<HTMLDivElement>(null);

	const handleWheel = ({ delta, size, type }: ScrollbarProps) => {
		if (type === ScrollbarType.HORIZOTAL) {
			if (delta.x < 0) {
				ref.current!.style.right = "0";
				ref.current!.style.left = "auto";
			} else {
				ref.current!.style.left = "0";
				ref.current!.style.right = "auto";
			}
			const width =
				delta.x !== 0
					? (size.x / (size.x + Math.abs(delta.x))) * 1000
					: 0;

			ref.current!.style.width = `${width}px`;
		} else if (type === ScrollbarType.VERTICAL) {
			if (delta.y < 0) {
				ref.current!.style.top = "0";
				ref.current!.style.bottom = "auto";
			} else {
				ref.current!.style.bottom = "0";
				ref.current!.style.top = "auto";
			}
			const height =
				delta.y !== 0
					? (size.y / (size.y + Math.abs(delta.y))) * 500
					: 0;

			ref.current!.style.height = `${height}px`;
		}
	};

	React.useEffect(() => {
		handleWheel({ type, delta, size });
	}, [type, delta, size]);

	if (type === ScrollbarType.HORIZOTAL) {
		return <div className="scrollbar-horizontal" ref={ref} />;
	} else {
		return <div className="scrollbar-vertical" ref={ref} />;
	}
};
