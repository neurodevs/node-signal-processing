import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidEmptyArraySchema: SpruceErrors.HilbertTransform.InvalidEmptyArraySchema  = {
	id: 'invalidEmptyArray',
	namespace: 'HilbertTransform',
	name: 'Invalid empty array',
	    fields: {
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidEmptyArraySchema)

export default invalidEmptyArraySchema
