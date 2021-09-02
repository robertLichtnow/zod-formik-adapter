import { z } from "zod";

export class ValidationError extends Error {
  public name = "ValidationError";

  public inner: Array<{ path: string; message: string }> = [];

  public constructor(message: string) {
    super(message);
  }
}

function createValidationError(e: z.ZodError) {
  const error = new ValidationError(e.message);
  error.inner = e.errors.map((err) => ({
    message: err.message,
    path: err.path.join("."),
  }));

  return error;
}

/**
 * Wrap your zod schema in this function when providing it to Formik's validation schema prop
 * @param schema The zod schema
 * @returns An object containing the `validate` method expected by Formik
 */
export function toFormikValidationSchema<T>(
  schema: z.ZodSchema<T>,
): { validate: (obj: T) => Promise<void> } {
  return {
    async validate(obj: T) {
      try {
        await schema.parseAsync(obj);
      } catch (err: unknown) {
        throw createValidationError(err as z.ZodError<T>);
      }
    },
  };
}