import styled from "styled-components";
import { SCREEN_BREAKPOINTS } from "../../constants/breakpoints";


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  padding: 5rem 0 5rem 0;
  position: relative;

  @media(max-width: ${SCREEN_BREAKPOINTS.EXTRA_LARGE}px) {
    padding: 2rem 0 2rem 0;
  }
`

export const SwitchIcon = styled.img`
  margin: 4px;
  height: 70%;
  width: 70%;
`

export const StatusesColumnsContainer = styled.div`
  padding-top: 4rem;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.5rem;
  max-width: 100vw;
  overflow-x: auto;


`

export const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 10rem;

  @media(max-width: ${SCREEN_BREAKPOINTS.EXTRA_LARGE}px) {
    flex-direction: column;
    padding: 0 2rem;
  }
`




