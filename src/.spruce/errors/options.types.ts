import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface InvalidEmptyArrayErrorOptions extends SpruceErrors.NodeSignalProcessing.InvalidEmptyArray, ISpruceErrorOptions {
	code: 'INVALID_EMPTY_ARRAY'
}

type ErrorOptions =  | InvalidEmptyArrayErrorOptions 

export default ErrorOptions
