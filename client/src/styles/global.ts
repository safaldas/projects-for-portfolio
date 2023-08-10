import { createGlobalStyle } from 'styled-components'
import { SCREEN_BREAKPOINTS } from '../constants/breakpoints'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  body {
    font-size: 14px;
    overflow-y: auto;
  }

  h1 {
    font-size: 3rem;
    line-height: 3rem;
    padding-bottom: 1rem;


    @media(max-width: ${SCREEN_BREAKPOINTS.MEDIUM}px) {
      font-size: 2.5rem;
      line-height: 2.5rem;
    }
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.1rem;
  }


    /* width */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }



  /* Handle */
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
  }

`