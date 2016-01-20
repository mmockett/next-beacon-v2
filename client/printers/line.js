/* global google */

'use strict';

const chartui = require('../components/chartui');
const colors = require('../colors');

module.exports = function () {
	const data = this.getTable().humanize('shortest');
	return (el, alias) => {
		const drawChart = () => {
			let dataTable = new google.visualization.DataTable();
			dataTable.addColumn('string', data.headings[0]);
			data.headings.slice(1).forEach(a => {
				dataTable.addColumn('number', a);
			})

			data.rows.forEach(row => {
				dataTable.addRow(row);
			});

			// TODO: Abstract global options at some point
			let options = {
				title: alias.question,
				height: 450,
				trendlines: { 0: {
					color: 'green'
				}},
				curveType:'function',
				chartArea: {
					top: '5%',
					left: '5%',
					width: '95%',
					height: '85%'
				},
				legend: { position: 'bottom' },
				vAxis: {
					viewWindow: { min: 0 }
				},
				colors: colors.getColors()
			};

			let chart = new google.visualization.LineChart(el);
			chart.draw(dataTable, options);
			chartui.renderChartUI(el, alias);
		}

		// Todo: Improve performance
		google.charts.setOnLoadCallback(drawChart);
		google.charts.load('current', {packages: ['corechart']});
	}
}
