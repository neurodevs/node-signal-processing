import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
	id: 'invalidEmptyArray',
	name: 'Invalid empty array',
	fields: {},
})
