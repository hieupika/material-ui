import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { OverridableComponent } from '@mui/types';
import {
  unstable_capitalize as capitalize,
  unstable_useControlled as useControlled,
  unstable_useId as useId,
} from '@mui/utils';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import { styled, useThemeProps } from '../styles';
import { getRadioGroupUtilityClass } from './radioGroupClasses';
import { RadioGroupOwnerState, RadioGroupTypeMap } from './RadioGroupProps';
import RadioGroupContext from './RadioGroupContext';
import FormControlContext from '../FormControl/FormControlContext';

const useUtilityClasses = (ownerState: RadioGroupOwnerState) => {
  const { row, size, variant, color } = ownerState;
  const slots = {
    root: [
      'root',
      row && 'row',
      variant && `variant${capitalize(variant)}`,
      color && `color${capitalize(color)}`,
      size && `size${capitalize(size)}`,
    ],
  };

  return composeClasses(slots, getRadioGroupUtilityClass, {});
};

const RadioGroupRoot = styled('div', {
  name: 'JoyRadioGroup',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: RadioGroupOwnerState }>(({ ownerState, theme }) => ({
  ...(ownerState.size === 'sm' && {
    '--RadioGroup-gap': '0.625rem',
  }),
  ...(ownerState.size === 'md' && {
    '--RadioGroup-gap': '0.875rem',
  }),
  ...(ownerState.size === 'lg' && {
    '--RadioGroup-gap': '1.25rem',
  }),
  display: 'flex',
  flexDirection: ownerState.row ? 'row' : 'column',
  borderRadius: theme.vars.radius.sm,
  ...theme.variants[ownerState.variant!]?.[ownerState.color!],
}));

const RadioGroup = React.forwardRef(function RadioGroup(inProps, ref) {
  const props = useThemeProps<typeof inProps & { component?: React.ElementType }>({
    props: inProps,
    name: 'JoyRadioGroup',
  });

  const {
    className,
    component,
    children,
    name: nameProp,
    defaultValue,
    disableIcon = false,
    overlay,
    value: valueProp,
    onChange,
    color = 'neutral',
    variant = 'plain',
    size = 'md',
    row = false,
    role = 'radiogroup',
    ...other
  } = props;

  const [value, setValueState] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'RadioGroup',
  });

  const ownerState = {
    row,
    size,
    variant,
    color,
    role,
    ...props,
  };

  const classes = useUtilityClasses(ownerState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueState(event.target.value);

    if (onChange) {
      onChange(event);
    }
  };

  const name = useId(nameProp);

  const formControl = React.useContext(FormControlContext);

  if (process.env.NODE_ENV !== 'production') {
    const registerEffect = formControl?.registerEffect;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (registerEffect) {
        return registerEffect();
      }

      return undefined;
    }, [registerEffect]);
  }

  return (
    <RadioGroupContext.Provider
      value={{
        disableIcon,
        overlay,
        row,
        size,
        name,
        value,
        onChange: handleChange,
      }}
    >
      <RadioGroupRoot
        ref={ref}
        role={role}
        as={component}
        ownerState={ownerState}
        className={clsx(classes.root, className)}
        // The `id` is just for the completeness, it does not have any effect because RadioGroup (div) is non-labellable element
        // MDN: "If it is not a labelable element, then the for attribute has no effect"
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#attr-for
        id={formControl?.htmlFor}
        aria-labelledby={formControl?.labelId}
        aria-describedby={formControl?.['aria-describedby']}
        {...other}
      >
        {React.Children.map(children, (child, index) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                // to let Radio knows when to apply margin(Inline|Block)Start
                ...(index === 0 && { 'data-first-child': '' }),
                ...(index === React.Children.count(children) - 1 && { 'data-last-child': '' }),
                'data-parent': 'RadioGroup',
              } as Record<string, string>)
            : child,
        )}
      </RadioGroupRoot>
    </RadioGroupContext.Provider>
  );
}) as OverridableComponent<RadioGroupTypeMap>;

RadioGroup.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * Class name applied to the root element.
   */
  className: PropTypes.string,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['danger', 'info', 'primary', 'success', 'warning']),
    PropTypes.string,
  ]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue: PropTypes.any,
  /**
   * The radio's `disabledIcon` prop. If specified, the value is passed down to every radios under this element.
   */
  disableIcon: PropTypes.bool,
  /**
   * The name used to reference the value of the control.
   * If you don't provide this prop, it falls back to a randomly generated name.
   */
  name: PropTypes.string,
  /**
   * Callback fired when a radio button is selected.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange: PropTypes.func,
  /**
   * The radio's `overlay` prop. If specified, the value is passed down to every radios under this element.
   */
  overlay: PropTypes.bool,
  /**
   * @ignore
   */
  role: PropTypes /* @typescript-to-proptypes-ignore */.string,
  /**
   * If `true`, flex direction is set to 'row'.
   * @default false
   */
  row: PropTypes.bool,
  /**
   * The size of the component.
   * @default 'md'
   */
  size: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['sm', 'md', 'lg']),
    PropTypes.string,
  ]),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Value of the selected radio button. The DOM API casts this to a string.
   */
  value: PropTypes.any,
  /**
   * The variant to use.
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['outlined', 'plain', 'soft', 'solid']),
    PropTypes.string,
  ]),
} as any;

export default RadioGroup;
