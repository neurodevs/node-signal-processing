import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidEmptyArraySchema: SpruceErrors.NodeSignalProcessing.InvalidEmptyArraySchema  = {
	id: 'invalidEmptyArray',
	namespace: 'NodeSignalProcessing',
	name: 'Invalid empty array',
	    fields: {
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidEmptyArraySchema)

export default invalidEmptyArraySchema
