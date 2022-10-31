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
 * @returns An object containing the `validate` and `validateAt` methods expected by Formik
 */
export function toFormikValidationSchema<T>(
  schema: z.ZodSchema<T>,
  params?: Partial<z.ParseParams>
): {
  validate: (obj: T) => Promise<void>;
  validateAt: (path: string, obj: T) => Promise<void>;
} {
  return {
    async validate(obj: T) {
      try {
        await schema.parseAsync(obj, params);
      } catch (err: unknown) {
        throw createValidationError(err as z.ZodError<T>);
      }
    },
    async validateAt(path: string, obj: T) {
      try {
        await schema.parseAsync(obj, params);
      } catch (err: unknown) {
        const error = createValidationError(err as z.ZodError<T>);
        const innerError = error.inner.find((e) => e.path === path);
        if (innerError) {
          throw innerError;
        }
      }
    },
  };
}
