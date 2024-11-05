'use client'
import { TextField, useField, useFieldProps, useFormInitializing } from '@payloadcms/ui';
import { TextFieldClientProps } from 'payload';
import { useEffect } from 'react';

export interface TextFromRelationFieldProps {
  relationField: string;
  relationDisplayField: string;
  fetchEndpoint: string;
}

const TextFromRelationField: React.FC<TextFromRelationFieldProps & TextFieldClientProps> = (props) => {
  const { relationField, relationDisplayField, fetchEndpoint } = props;
  const formInitializing = useFormInitializing();

  const { path } = useFieldProps();
  const { value, setValue } = useField<string>({
    path: `${path}`,
  });

  const { value:relationValue } = useField<string>({
    path: `${relationField}`,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (formInitializing) {
        return;
      }
      if (relationValue) {
        const response = await fetch(`${fetchEndpoint}/${relationValue}?depth=0`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data[relationDisplayField] !== value ) {
          setValue(data[relationDisplayField] || '');
        } else {
          console.log('No data returned');
        }
      }
    };
    fetchData();
  }, [relationValue]);

  return <TextField {...props} />
};

export default TextFromRelationField;
