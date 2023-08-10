import styled from "styled-components";
import { SCREEN_BREAKPOINTS } from "../../constants/breakpoints";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%
  padding: 5rem 0 5rem 0;
  @media(max-width: ${SCREEN_BREAKPOINTS.EXTRA_LARGE}px) {
    padding: 2rem 0 2rem 0;
  }
`
export const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10rem;

  @media(max-width: ${SCREEN_BREAKPOINTS.EXTRA_LARGE}px) {
    flex-direction: column;
    padding: 0 2rem;
    background-color: #d3d3d3;

  }
`

export const AddButton = styled.button`
  margin-top: 2rem;
  background-color: #0000FF;
  color: #fff;
  font-weight: bold;
  padding: 10px 0;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  width: 20%;
  display:flex;
  justify-content: center;
  height:20%
  `

export const ListContainer = styled.div`
color: #fff;
margin-top: 2rem;
width: 100%;
text-align: center;
overflow-y: auto;
display: flex;
flex-wrap: wrap;
justify-content: center
position: relative;

`


export const TextContainer = styled.div`

height:80%
  `

export const ButtonContainer = styled.div`

  display:flex;
  justify-content: flex-end;
  `

export const Button = styled.button`
  
background-color: #0000FF;
    color: #fff;
    font-weight: bold;
    padding: 10px 0;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    width: 15%;
    display: flex;
    justify-content: center;
    margin-right: 10px;
    font-size: 15px;
    line-height: 1;
    height: 20px !important;

  `

export const ListElements = styled.div`
height: 50%;
  width: 300px;


`
