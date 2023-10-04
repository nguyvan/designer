import React from "react";
import { CanvasProps } from "../components/canvas/canvas.component";

export interface Point {
	x: number;
	y: number;
}

export interface Path {
	index: number;
	paths: Point[];
}

const getLastIndex = () => {
	const keys = Object.keys(localStorage);
	return Math.max(...keys.map((value) => parseInt(value.split("_")[1])), -1);
};

export const useCanvas = ({ size, delta }: CanvasProps) => {
	const ref = React.useRef<HTMLCanvasElement>(null);
	const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);
	const [path, setPath] = React.useState<Path>({
		index: getLastIndex(),
		paths: [],
	});

	const [isDrawing, setIsDrawing] = React.useState<boolean>(false);

	const isInsideCanvas = React.useCallback((event: MouseEvent) => {
		if (ref.current) {
			const x = event.clientX;
			const y = event.clientY;
			const bounding = ref.current.getBoundingClientRect();

			return (
				x >= bounding.left &&
				x <= bounding.left + bounding.width &&
				y >= bounding.top &&
				y <= bounding.top + bounding.height
			);
		}
		return false;
	}, []);

	const computePointInCanvas = React.useCallback(
		(clientX: number, clientY: number) => {
			if (ref.current) {
				const bounding = ref.current.getBoundingClientRect();
				return {
					x: clientX - bounding.left,
					y: clientY - bounding.top,
				};
			} else {
				return null;
			}
		},
		[]
	);

	const onDraw = React.useCallback(
		(ctx: CanvasRenderingContext2D, point: Point) => {
			ctx.lineTo(point.x, point.y);
			setPath((path) => {
				const newPath = {
					index: path.index,
					paths: [
						...path.paths,
						{
							x: point.x + delta!.x,
							y: point.y + delta!.y,
						},
					],
				};
				return newPath;
			});
			ctx.strokeStyle = "white";
			ctx.stroke();
		},
		[delta]
	);

	const initMouseMove = React.useCallback(
		(event: MouseEvent) => {
			if (isInsideCanvas(event) && ref.current) {
				const point = computePointInCanvas(
					event.clientX,
					event.clientY
				)!;
				if (isDrawing && contextRef) {
					onDraw(contextRef.current!, point);
				}
			}
		},
		[computePointInCanvas, isInsideCanvas, onDraw, isDrawing]
	);

	const onMouseDown = React.useCallback(
		(event: MouseEvent) => {
			contextRef.current = ref.current!.getContext("2d");
			const point = computePointInCanvas(event.clientX, event.clientY)!;
			contextRef.current!.beginPath();
			contextRef.current!.moveTo(point.x, point.y);
			setPath((path) => {
				const newPath = {
					index: path.index + 1,
					paths: [
						{
							x: point.x + delta!.x,
							y: point.y + delta!.y,
						},
					],
				};
				return newPath;
			});
			ref.current!.style.cursor =
				'url("./assets/img/draw.cursor.png"), pointer';
			setIsDrawing(true);
		},
		[computePointInCanvas, setPath, delta]
	);

	const onMouseUp = React.useCallback(() => {
		contextRef.current!.closePath();
		ref.current!.style.cursor = "default";
		localStorage.setItem(`canvas_${path.index}`, JSON.stringify(path));
		setIsDrawing(false);
	}, [path]);

	React.useEffect(() => {
		const element = ref.current;

		element?.addEventListener("mousemove", initMouseMove);
		element?.addEventListener("mousedown", onMouseDown);
		element?.addEventListener("mouseup", onMouseUp);
		return () => {
			element?.removeEventListener("mousemove", initMouseMove);
			element?.removeEventListener("mousedown", onMouseDown);
			element?.removeEventListener("mouseup", onMouseUp);
		};
	}, [initMouseMove, onMouseDown, onMouseUp]);

	React.useEffect(() => {
		const element = ref.current;
		const ctx = element?.getContext("2d");
		const keys = Object.keys(localStorage);

		const bounding = ref.current!.getBoundingClientRect();

		ctx?.clearRect(0, 0, bounding!.width, bounding!.height);

		for (const key of keys) {
			const data: Path = JSON.parse(localStorage.getItem(key)!);
			ctx?.beginPath();
			for (let point of data.paths) {
				ctx?.lineTo(
					point.x - (delta?.x || 0),
					point.y - (delta?.y || 0)
				);
				ctx!.strokeStyle = "white";
				ctx?.stroke();
			}
			ctx?.closePath();
		}
	}, [size, delta]);

	return ref;
};
