'use strict';

const Poller = require('ft-poller');

module.exports = new Poller({
	url: `https://api.keen.io/3.0/projects/${process.env.KEEN_PROJECT_ID}?api_key=${process.env.KEEN_MASTER_KEY}`,
	defaultData: [],
	autostart: true,
	parseData: data => {
		const map = data.events.reduce((obj, e) => {
			const parts = e.name.split(':');
			const category = parts[0];
			const action = parts[1];
			// attempt to group things sensibly
			const bucket = ['view'].indexOf(action) > -1 ? action :
				['email', 'site', 'page', 'overlay', 'push'].indexOf(category) > -1 ? category : action;
			obj[bucket] = obj[bucket] || [];
			obj[bucket].push({category, action})
			return obj;
		}, {});
		return map;
	}
})
