export const sortArrOfObj = (arr, sortVal) => {
	const { key, value } = sortVal
	const res = [...arr].sort((a, b) => {
		if (typeof a[key] === 'number' && typeof b[key] === 'number') {
			return value === 1 ? a[key] - b[key] : b[key] - a[key]
		} else if (typeof a[key] === 'string' && typeof b[key] === 'string') {
			return value === 1 ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
		} else {
			return 0 // Fallback if types don't match
		}
	})
	return res
}

export const sliceTable = (list, page, rowsPerPage) => {
	// eslint-disable-next-line no-mixed-operators
	return list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
}
