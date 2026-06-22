import * as _$_ from 'ripple/internal/server';

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
	return createStickToBottomController(options);
}

export function StickToBottom(props) {
	return _$_.tsrx_element(() => {
		var _$_hash = 'tsrx-54763bba';

		_$_.output_register_css(_$_hash);

		const controller = createStickToBottomController(getOptions(props));

		props.contextRef?.(controller);

		_$_.effect(() => {
			controller.setOptions(getOptions(props));
		});

		_$_.effect(() => {
			if (!props.onStateChange) {
				return;
			}

			return controller.onStateChange(props.onStateChange);
		});

		_$_.effect(() => () => {
			props.contextRef?.(null);
			controller.dispose();
		});

		const setScrollElement = (element) => {
			controller.setScrollElement(element);
			props.scrollRef?.(element);
		};

		const setContentElement = (element) => {
			controller.setContentElement(element);
			props.contentRef?.(element);
		};

		const bottomInset = getInsetValue(props.bottomInset);

		_$_.regular_block(() => {
			{
				_$_.output_push('<div');
				_$_.output_push(_$_.attr('style', props.style, false));

				_$_.output_push(_$_.attr('class', [
					[
						"ripple-stick-to-bottom",
						props.class,
						props.className,
						props.scrollClass,
						props.scrollClassName
					],
					'tsrx-54763bba'
				]));

				_$_.output_push('>');

				{
					_$_.output_push('<div');

					_$_.output_push(_$_.attr('class', [
						[
							"ripple-stick-to-bottom-content",
							props.contentClass,
							props.contentClassName
						],
						'tsrx-54763bba'
					]));

					_$_.output_push('>');

					{
						_$_.render_expression(props.children);
						_$_.output_push('<!--[-->');

						if (bottomInset) {
							_$_.output_push('<div');
							_$_.output_push(_$_.attr('style', { "--ripple-stick-to-bottom-inset": bottomInset }, false));
							_$_.output_push(' aria-hidden="true"');
							_$_.output_push(' class="tsrx-54763bba ripple-stick-to-bottom-spacer"');
							_$_.output_push('>');
							_$_.output_push('</div>');
						}

						_$_.output_push('<!--]-->');
					}

					_$_.output_push('</div>');
				}

				_$_.output_push('</div>');
			}
		});
	});
}

_$_.register_css('tsrx-54763bba', '\n      .ripple-stick-to-bottom.tsrx-54763bba {\n        height: 100%;\n        overflow: auto;\n        scrollbar-gutter: stable both-edges;\n        width: 100%;\n      }\n\n      .ripple-stick-to-bottom-content.tsrx-54763bba {\n        min-height: 100%;\n      }\n\n      .ripple-stick-to-bottom-spacer.tsrx-54763bba {\n        flex-shrink: 0;\n        height: var(--ripple-stick-to-bottom-inset);\n      }\n    ');
import "./stick-to-bottom.css";
