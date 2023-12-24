/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.HilbertTransform {

	
	export interface InvalidEmptyArray {
		
	}

	export interface InvalidEmptyArraySchema extends SpruceSchema.Schema {
		id: 'invalidEmptyArray',
		namespace: 'HilbertTransform',
		name: 'Invalid empty array',
		    fields: {
		    }
	}

	export type InvalidEmptyArrayEntity = SchemaEntity<SpruceErrors.HilbertTransform.InvalidEmptyArraySchema>

}




