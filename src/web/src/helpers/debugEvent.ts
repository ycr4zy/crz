interface DebugEvent<T = any> {
	action: string;
	data: T;
}

export const isEnvBrowser = (): boolean => !(window as any).invokeNative

export const debugData = <P>(events: DebugEvent<P>[], timer = 1000): void => {
	if (isEnvBrowser()) {
		for (const event of events) {
			setTimeout(() => {
				window.dispatchEvent(
					new MessageEvent("message", {
						data: {
							action: event.action,
							data: event.data,
						},
					})
				);
			}, timer);
		}
	}
};