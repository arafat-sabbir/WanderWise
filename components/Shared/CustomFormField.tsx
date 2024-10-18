import PhoneInput from "react-phone-number-input";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { ReactNode } from "react";
import { E164Number } from "libphonenumber-js";

import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Input } from "../ui/input";
import { FormFieldType } from "@/types/types";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  defaultValue?: string;
  name: string;
  type?: string;
  onChange?: (e: any) => void;
  label?: string;
  placeholder: string;
  iconSrc?: string;
  disabled?: boolean;
  required?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: ReactNode;
  accept?: string;
  multiple?: boolean;
  iconAlt?: string;
  className?: string;
  renderSkeleton?: (filed: any) => ReactNode;
}

const RenderIField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    iconSrc,
    iconAlt,
    fieldType,
    placeholder,
    className,
    onChange,
    required = false,
  } = props;
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className={cn("flex rounded-md border", className)}>
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt!}
              height={24}
              width={24}
              className="mx-3 border-0"
            ></Image>
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              required={required}
              type={props?.type}
              accept={props?.accept}
              multiple={props?.multiple}
              className={cn(
                "focus:ring-0 focus:outline-none font-bai ",
                className
              )}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            onChange={field.onChange}
            defaultCountry="BD"
            placeholder={placeholder}
            international
            required={required}
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            className={cn("border border-gray-300 p-1.5 font-bai", className)}
            numberInputProps={{
              className:
                "rounded-md px-4 focus:outline-none w-1/2 bg-transparent dark:bg-transparent text-gray-500", // my Tailwind classes
            }}
          />
        </FormControl>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            required={required}
            className={cn("border focus:ring-0 focus:outline-none", className)}
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            required={required}
            onValueChange={(value: string) => {
              field.onChange(value);
              if (onChange) onChange(value);
            }}
            value={field.value} // Bind the value correctly
            disabled={props.disabled} // Handle the disabled state
          >
            <SelectTrigger className="shad-select-trigger">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, label, name } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <RenderIField field={field} props={props} />
          <FormMessage className="shad-error"></FormMessage>
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
