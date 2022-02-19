const iso8601 = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(Z|([+-]\d{2}:\d{2}))?$/;

const isDate = (value: string): boolean =>
  iso8601.test(value);

const createDate = (value: string): Date =>
  new Date((Date.parse(value)));

const patch = (value: string): string | Date =>
  isDate(value) ? createDate(value) : value;

const deepPatch = (value: any): any => {
  if (typeof value === "string") {
    return patch(value);
  }

  if ((value !== null && typeof value === 'object') || Array.isArray(value)) {
    for (let item in value) {
      if (value.hasOwnProperty(item)) {
        value[item] = deepPatch(value[item]);
      }
    }
  }

  return value;
};

const dateValueResponseTransform = (data: any, headers?: any): any => {
  return deepPatch(data);
};

export default dateValueResponseTransform;