import { Switch } from "@headlessui/react";
import React from "react";

type SwitchProps = {
  enabled: boolean | undefined;
  onChange?: (e: any) => void;
  disabled?: boolean;
  checked?: boolean;
  extraCss?: string;
  name?: string;
  id?: string;
};
const SwitchToggle = ({
  checked,
  enabled,
  extraCss,
  id,
  name,
  onChange,
  disabled,
}: SwitchProps) => {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <Switch
      disabled={disabled}
      defaultChecked={enabled}
      checked={checked}
      id={id}
      name={name}
      onChange={onChange}
      className={`group relative ${
        extraCss ? extraCss : "ml-3"
      } inline-flex h-5 w-10 flex-shrink-0 items-center justify-center rounded-full focus:outline-none`}
    >
      <span className="sr-only">Merchant Active State</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-full w-full rounded-md bg-white"
      />
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? "bg-blue_primary" : "bg-grey_border_table",
          "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
        )}
      />
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? "translate-x-5" : "translate-x-0",
          "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-grey_border_table bg-white transition-transform duration-200 ease-in-out"
        )}
      />
    </Switch>
  );
};

export default SwitchToggle;
