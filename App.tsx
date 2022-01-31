import React from "react";
import { StyleSheet, View, Vibration } from "react-native";
import Animated, {
	runOnJS,
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

const BOX_SIZE = 64;
const AREA_RADIUS = 150;

type ContextType = {
	translateX: number;
	translateY: number;
};

export default function App() {
	let translateX = useSharedValue<number>(0);
	let translateY = useSharedValue<number>(0);
	let boxColor = useSharedValue<string>("#010101");

	const makeVibration = () => {
		Vibration.vibrate(50);
		console.log("vibrated");
	};

	const panGestureEvent = useAnimatedGestureHandler<
		PanGestureHandlerGestureEvent,
		ContextType
	>({
		onStart: (event, context) => {
			context.translateX = translateX.value;
			context.translateY = translateY.value;
		},
		onActive: (event, context) => {
			translateX.value = event.translationX + context.translateX;
			translateY.value = event.translationY + context.translateY;
		},
		onEnd: () => {
			const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);

			if (distance < AREA_RADIUS + BOX_SIZE / 2) {
				runOnJS(makeVibration)();
				boxColor.value =
					"#" + Math.floor(Math.random() * 16777215).toString(16);
				translateX.value = withSpring(0);
				translateY.value = withSpring(0);
			}
		},
	});

	const rStlye = useAnimatedStyle(() => {
		"worklet";
		return {
			transform: [
				{
					translateX: translateX.value,
				},
				{
					translateY: translateY.value,
				},
			],
			backgroundColor: boxColor.value,
		};
	});

	return (
		<View style={styles.container}>
			<View style={styles.area}>
				<PanGestureHandler onGestureEvent={panGestureEvent}>
					<Animated.View style={[styles.box, rStlye]} />
				</PanGestureHandler>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	area: {
		width: AREA_RADIUS * 2,
		height: AREA_RADIUS * 2,
		borderRadius: AREA_RADIUS,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 3,
		borderColor: "rgba(0, 0, 0, .08)",
		borderStyle: "dashed",
	},
	box: {
		width: BOX_SIZE,
		height: BOX_SIZE,
		borderRadius: (BOX_SIZE * 20) / 100,
		backgroundColor: "#000",
	},
});
