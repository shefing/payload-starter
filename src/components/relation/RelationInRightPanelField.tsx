'use client'
import { RelationshipField, useField, useStepNav } from '@payloadcms/ui'
import { RelationshipFieldClientProps } from 'payload'
import { ArrowRightToBracket } from 'flowbite-react-icons/outline'
import { useRef } from 'react'
import { useCustomContext } from '@/providers/CustomContext'

//throw event /context on click
const RelationInRightPanelField: React.FC<RelationshipFieldClientProps> = (props) => {
  const { isRightPanelOpen, setIsRightPanelOpen, setId, setCollection, setPrevStepNav } = useCustomContext()
  const { stepNav } = useStepNav()
  const { value } = useField<string>({
    path: props.field._path,
  })
  const isFirstClick = useRef(true)

  const handleClick = () => {
    if (!isRightPanelOpen) {
      if (isFirstClick.current) {
        setPrevStepNav(stepNav)
        setIsRightPanelOpen(true)
        setCollection(props.field.relationTo as string)
        setId(value)
      } else {
        isFirstClick.current = false
      }
    } else {
      setIsRightPanelOpen(false)
    }
  }

  return (
    <div className="flex items-center">
      <RelationshipField {...props} />
      <ArrowRightToBracket
        size={14}
        onClick={handleClick}
        className="cursor-pointer ml-[5px] mt-[10px]"
      />
    </div>
  )
}

export default RelationInRightPanelField
