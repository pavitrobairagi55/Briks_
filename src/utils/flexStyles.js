/**

  This file defines a set of reusable styles for flexbox layouts. 
  The flexStyles object contains various flexbox utility styles 
  for arranging and aligning elements in different ways, both in 
  column and row directions.
 */
  export const flexStyles = {
	flexColumn: {
		display: 'flex',
		flexDirection: 'column',
	},
	flexColumnJustifyCenter: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	flexColumnFlexEnd: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	flexColumnFlexStart: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
	},
	flexColumnJustifyAlignCenter: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	flexColumnEnd: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	flexColumnCenter: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	flexColumnSpaceBetween: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	flexColumnCenterEnd: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	flexColumnEndCenter: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	flexColumnAlignStart: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
	flexColumnSpaceBetweenAlignCenter: {
		display: 'flex',
		direction: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	flexColumnCenterSpaceEvenly: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	flexCenter: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexJustifyCenter: {
		display: 'flex',
		justifyContent: 'center',
	},
	flexAlignCenter: {
		display: 'flex',
		alignItems: 'center',
	},
	flexCenterSpaceBetween: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	flexJustifyAlignEnd: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	flexcenterJustifyFlexStart: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	flexRowJustifyCenter: {
		display: 'flex',
		direction: 'row',
		justifyContent: 'center',
	},
	flexRowJustifyAlignCenter: {
		display: 'flex',
		direction: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexRowJustifyStart: {
		display: 'flex',
		direction: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	flexRowSpaceBetweenAlignCenter: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	flexRowSpaceBetween: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	flexRowSpaceBetweenAlignToEnd: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
	},
	flexRowRight: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	flexRowAlignCenter: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	flexRowJustifyEnd: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'flex-start',
	},
	flexRowCenter: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexRowAlignLeft: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	flexRowAllStart: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	flexRowFlexEnd: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	flexRowCenterSpaceEvenly: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
}

export const globalStyles = {
	hideScroll: {
		'::-webkit-scrollbar': {
			display: 'none !important',
		},
		'::-moz-scrollbar': {
			display: 'none !important',
		},
		'::-ms-scrollbar': {
			display: 'none !important',
		},
	},
}
