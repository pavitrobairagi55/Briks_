export const iconSx = (disable) => ({
  height: '44px',
  width: '44px',
  color: disable ? 'rgba(0, 0, 0, 0.26)' : 'inherit',
  cursor: disable ? 'not-allowed' : 'pointer',
});

export const typographyTextNextLine = {
	wordWrap: 'break-word',
}