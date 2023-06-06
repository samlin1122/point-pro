export interface MakeFieldResponse {
  value: any;
  fieldPath: string;
  isRequired: boolean;
  invalid: boolean;
}
export const makeField = (value: any, fieldPath: string, isRequired: boolean, invalid: boolean): MakeFieldResponse => ({
  value: value,
  fieldPath,
  isRequired,
  invalid
});
