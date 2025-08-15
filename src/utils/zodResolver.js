export const zodResolver = (schema) => async (data) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return {
      values: result.data,
      errors: {},
    };
  }

  const fieldErrors = result.error.flatten().fieldErrors;
  const errors = Object.keys(fieldErrors).reduce((acc, key) => {
    const messages = fieldErrors[key];
    if (messages && messages.length) {
      acc[key] = { type: "validation", message: messages[0] };
    }
    return acc;
  }, {});

  return {
    values: {},
    errors,
  };
};
