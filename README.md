# zod-formik-adapter

[![codecov](https://codecov.io/gh/robertLichtnow/zod-formik-adapter/branch/master/graph/badge.svg?token=Z5V1VKCGV9)](https://codecov.io/gh/robertLichtnow/zod-formik-adapter)

This library adapts a [zod](https://www.npmjs.com/package/zod) schema to work as a `validationSchema` prop or `validate` prop on [Formik](https://www.npmjs.com/package/formik)

## Install

```bash
npm install zod-formik-adapter
# or
yarn add zod-formik-adapter
# or
pnpm add zod-formik-adapter
# or
bun add zod-formik-adapter
```

## Usage

```TSX
import { z } from 'zod';
import { Formik } from 'formik';
// use "zod-formik-adapter/v4" if you are using zod v4
import { toFormikValidationSchema } from 'zod-formik-adapter';

const Schema = z.object({
  name: z.string(),
  age: z.number(),
});

const Component = () => (
  <Formik
    validationSchema={toFormikValidationSchema(Schema)}
  >
    {...}
  </Formik>
);
```

```TSX
import { z } from 'zod';
import { Formik } from 'formik';
import { toFormikValidate } from 'zod-formik-adapter';

const Schema = z.object({
  name: z.string(),
  age: z.number(),
});

const Component = () => (
  <Formik
    validate={toFormikValidate(Schema)}
  >
    {...}
  </Formik>
);
```
