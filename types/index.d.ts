/* eslint-disable no-unused-vars */

declare type InputProps = {
  id?: string;
  type: string;
  name: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string | number;
  required?: boolean;
  value?: string | number;
  onChange?: any;
  readonly?: boolean;
  min?: string | number;
  max?: string | number;
};

declare type SelectProps = {
  name: string;
  defaultValue?: string | number;
  className?: string;
  data: (string | { label: string; value: string | number })[];
  required?: boolean;
  value?: string | number | readonly string[] | undefined;
  onChange?: any;
  multiple?: boolean;
};

declare interface DoughnutChartProps {
  title: string;
  data: {
    type: string;
    count: number;
    color: string;
  }[];
}

declare interface signInProps {
  email: string;
  password: string;
  environment: string;
  timezone: string;
}

declare interface GenericResponse {
  statusCode: number;
  message: string;
}
