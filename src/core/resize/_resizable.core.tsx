import React from "react";
import "./_resizeable.core.scss";

interface ResizableProps {
	children: React.ReactNode;
	handleChangeSize: () => void;
}

export const Resizable = ({ children, handleChangeSize }: ResizableProps) => {
	const ref = React.useRef<HTMLDivElement>(null);
	const [isResizing, setIsResizing] = React.useState<boolean>(false);

	const startResizing = React.useCallback(() => {
		setIsResizing(true);
	}, []);

	const endResizing = React.useCallback(() => {
		setIsResizing(false);
	}, []);

	const resize = React.useCallback(
		(mouseMoveEvent: MouseEvent) => {
			if (isResizing && ref.current) {
				ref.current.style.width =
					mouseMoveEvent.clientX -
					ref.current.getBoundingClientRect().left +
					"px";
				document.body.style.cursor = "col-resize";
				handleChangeSize();
			} else if (!isResizing) {
				document.body.style.cursor = "default";
			}
		},
		[ref, isResizing, handleChangeSize]
	);

	React.useEffect(() => {
		const element = ref.current;

		element!.addEventListener("mouseup", endResizing);
		window.addEventListener("mousemove", resize);
		return () => {
			element!.removeEventListener("mouseup", endResizing);
			window.removeEventListener("mousemove", resize);
		};
	}, [ref, resize, endResizing]);

	return (
		<div
			ref={ref}
			id="__sidebar"
			className="app-sidebar"
			onMouseDown={(e) => e.preventDefault()}
		>
			{children}
			<div className="app-sidebar-resizer" onMouseDown={startResizing} />
		</div>
	);
};
