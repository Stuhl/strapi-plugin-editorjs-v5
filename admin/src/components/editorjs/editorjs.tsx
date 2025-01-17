import { Field } from "@strapi/design-system"
import * as React from "react"
import { useIntl } from "react-intl"

import StyledBox from "./styled_box"
import { Box } from "@strapi/design-system"
import { Typography } from "@strapi/design-system"
import Editor from "./editor/editor"

const EditorJS = (props: any) => {
  const { formatMessage } = useIntl()

  const {
    attribute,
    disabled,
    intlLabel,
    name,
    onChange,
    error,
    description,
    required,
    value,
    labelAction
  } = props

  return (
    <Field.Root
      name ={name}
      id   ={name}
      error={error}
      hint ={description && formatMessage(description)}
    >
      <StyledBox>
        <Box>
          <Typography variant={"pi"} fontWeight="bold">
            {intlLabel ? formatMessage(intlLabel) : name}
          </Typography>
          {required && (
            <Typography variant={"pi"} fontWeight="bold" textColor="danger600">
              *
            </Typography>
          )}
        </Box>
        <Editor 
          onChange={onChange} 
          name    ={name} 
          value   ={value}
          disabled={disabled}
        /> 
        {error && (
          <Typography variant={"pi"}>
            {formatMessage({id: error, defaultMessage: error})}
          </Typography>
        )}
        {description && (
          <Typography variant={"pi"}>
            {formatMessage(description)}
          </Typography>
        )}
      </StyledBox>
      <Field.Error />
      <Field.Hint />
    </Field.Root>
  )
}

export default EditorJS