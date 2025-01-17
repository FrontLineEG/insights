import { reactive, defineAsyncComponent } from 'vue'
import { isEmptyObj } from '@/utils'

function useNumberChart() {
	const chart = reactive({
		type: 'Number',
		icon: 'hash',
		dataSchema: {
			labelColumn: false,
			valueColumn: true,
			multipleValues: false,
		},
		getComponent,
		buildComponentProps,
	})

	function getComponent() {
		return defineAsyncComponent(() => import('@/components/Query/Visualize/NumberCard.vue'))
	}

	function buildComponentProps(query, options) {
		if (isEmptyObj(options.data.valueColumn)) {
			return null
		}
		const valueColumn = options.data.valueColumn?.value
		if (
			!query.doc.columns.some((c) =>
				c.is_expression ? c.label === valueColumn : c.column === valueColumn
			)
		) {
			return null
		}

		const value = query.results.getColumnValues(valueColumn)[0]
		chart.componentProps = {
			data: {
				value,
				title: options.title,
			},
			options: options.options,
		}
	}

	return chart
}

export default useNumberChart
