'use client'

import React, { FC } from 'react'

//@typescript-eslint/ban-ts-comment @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LabelComponent: FC<{ blockKind: string; formData: Record<string, any>; }> | undefined = (props) => {
  const { formData } = props
  return <div>{formData?.textToDisplay}</div>
}

export default LabelComponent;