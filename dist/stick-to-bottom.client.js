import * as _$_ from 'ripple/internal/client';

var root_2 = _$_.template(`<div aria-hidden="true" class="tsrx-54763bba ripple-stick-to-bottom-spacer"></div>`, 0);
var root_1 = _$_.template(`<div><div><!><!></div></div>`, 0);
var root = _$_.template(`<!>`, 1, 1);

import { effect } from "ripple";
import { createStickToBottomController } from "./controller";

function getInsetValue(value) {
	if (value === undefined) {
		return undefined;
	}

	return typeof value === "number" ? `${value}px` : value;
}

function getOptions(props) {
	return {
		bottomThreshold: props.bottomThreshold,
		damping: props.damping,
		initial: props.initial,
		mass: props.mass,
		resize: props.resize,
		stiffness: props.stiffness,
		targetScrollTop: props.targetScrollTop
	};
}

export function createStickToBottom(options?) {
	var __block = _$_.scope();

	return createStickToBottomController(options);
}

export function StickToBottom(props) {
	return _$_.tsrx_element((__anchor, __block) => {
		const controller = _$_.with_scope(__block, () => createStickToBottomController(getOptions(props)));

		_$_.with_scope(__block, () => props.contextRef?.(controller));

		_$_.effect(() => {
			_$_.with_scope(__block, () => controller.setOptions(getOptions(props)));
		});

		_$_.effect(() => {
			if (!props.onStateChange) {
				return;
			}

			return _$_.with_scope(__block, () => controller.onStateChange(props.onStateChange));
		});

		_$_.effect(() => () => {
			_$_.with_scope(__block, () => props.contextRef?.(null));
			_$_.with_scope(__block, () => controller.dispose());
		});

		const setScrollElement = (element) => {
			_$_.with_scope(__block, () => controller.setScrollElement(element));
			_$_.with_scope(__block, () => props.scrollRef?.(element));
		};

		const setContentElement = (element) => {
			_$_.with_scope(__block, () => controller.setContentElement(element));
			_$_.with_scope(__block, () => props.contentRef?.(element));
		};

		const bottomInset = _$_.with_scope(__block, () => getInsetValue(props.bottomInset));
		var fragment = root();
		var node_1 = _$_.first_child_frag(fragment);

		_$_.expression(node_1, () => _$_.tsrx_element((__anchor, __block) => {
			var div_1 = root_1();

			_$_.ref(div_1, () => setScrollElement, (v) => setScrollElement = v);

			{
				var div_2 = _$_.child(div_1);

				_$_.ref(div_2, () => setContentElement, (v) => setContentElement = v);

				{
					var expression = _$_.child(div_2);

					_$_.expression(expression, () => props.children);

					var node = _$_.sibling(expression);

					{
						var consequent = (__anchor) => {
							var div_3 = root_2();

							_$_.set_style(div_3, { "--ripple-stick-to-bottom-inset": bottomInset }, void 0);
							_$_.append(__anchor, div_3);
						};

						_$_.if(node, (__render) => {
							if (bottomInset) __render(consequent);
						});
					}

					_$_.pop(div_2);
				}
			}

			_$_.render(
				(__prev) => {
					var __a = [
						"ripple-stick-to-bottom-content",
						props.contentClass,
						props.contentClassName
					];

					if (__prev.a !== __a) {
						_$_.set_class(div_2, __prev.a = __a, 'tsrx-54763bba', true);
					}

					var __b = [
						"ripple-stick-to-bottom",
						props.class,
						props.className,
						props.scrollClass,
						props.scrollClassName
					];

					if (__prev.b !== __b) {
						_$_.set_class(div_1, __prev.b = __b, 'tsrx-54763bba', true);
					}

					var __c = props.style;

					if (__prev.c !== __c) {
						_$_.set_style(div_1, __c, __prev.c);
						__prev.c = __c;
					}
				},
				{ a: Symbol(), b: Symbol(), c: void 0 }
			);

			_$_.append(__anchor, div_1);
		}));

		_$_.append(__anchor, fragment);
	});
}
import "./stick-to-bottom.css";
