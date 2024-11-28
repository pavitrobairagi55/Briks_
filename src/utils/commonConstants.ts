export const rowsPerPageOptions: Array<{ text: string; value: number }> = [
	{
		text: '5',
		value: 5,
	},
	{
		text: '10',
		value: 10,
	},
	{
		text: '25',
		value: 25,
	},
	// {
	// 	text: '50',
	// 	value: 50,
	// },
]

export const typographyKeys = {
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	subtitle1: 'subtitle1',
	subtitle2: 'subtitle2',

	h5: 'h5',
	h6: 'h6',
	callout1: 'callout1',
	body1: 'body1',
	body2: 'body2',

	callout2: 'callout2',
	caption: 'caption',
	caption1: 'caption1',
} as const
