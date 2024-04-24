import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.NodeSignalProcessing {

	
	export interface InvalidEmptyArray {
		
	}

	export interface InvalidEmptyArraySchema extends SpruceSchema.Schema {
		id: 'invalidEmptyArray',
		namespace: 'NodeSignalProcessing',
		name: 'Invalid empty array',
		    fields: {
		    }
	}

	export type InvalidEmptyArrayEntity = SchemaEntity<SpruceErrors.NodeSignalProcessing.InvalidEmptyArraySchema>

}




