'use strict';

import KeenQuery from 'n-keen-query';
import {init as chartUi, renderChart} from '../components/chart-ui';
import {fromQueryString as getConfigurator} from '../components/configurator';
import {storeKq} from '../data/kq-cache';

export function init () {

	const configure = getConfigurator();

	[].forEach.call(document.querySelectorAll('.chart'), el => {
		const alias = el.dataset.keenAlias;
		const printerEl = el.querySelector('.chart__printer')
		let conf;
		if (conf = window.aliases[alias]) {
			let builtQuery = KeenQuery.buildFromAlias(conf);

			// todo: put this in buildFromAlias

			builtQuery = builtQuery.setPrinter(conf.printer || 'LineChart').tidy();

			storeKq(alias, builtQuery);

			// avoid showing as big number when the default view could easily be converted to a line graph over time
			if (builtQuery.dimension < 2 && !conf.printer) {
				builtQuery.interval('d')
			}
			renderChart(printerEl, configure(builtQuery), conf);

		} else {
			printerEl.classList.add('chart-error');
			printerEl.innerHTML = `<p class="error">Invalid chart name: ${alias}</p>`;
		}
	});

	chartUi(document.querySelector('.charts'));
}
