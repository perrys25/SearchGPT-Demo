import React from "react"
import styled, {keyframes} from "styled-components"
import tw from "twin.macro";

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 0.675rem 0;
`

const BounceAnimation = keyframes`
  0% { 
    margin-bottom: 0; 
    margin-top : 0.5rem;
  }

  50% { 
    margin-bottom: 0.5rem;
    margin-top : 0;
  }

  100% {
    margin-bottom: 0;
    margin-top : 0.5rem;
  }
`
const Dot = styled.div`
  border-radius: 50%;
  width: 0.7rem;
  height: 0.7rem;
  margin: 0 0.25rem;
  ${tw`bg-black dark:bg-white`}
  animation: ${BounceAnimation} 1.2s ease-in-out infinite;
  animation-delay: ${(props: {delay: string}) => props.delay};
`

// return
export default function Loading() {
    return (
        <LoadingWrapper>
            <Dot delay="0s" />
            <Dot delay="0.1s" />
            <Dot delay="0.2s" />
        </LoadingWrapper>
    )
}
