import styled, { createGlobalStyle, GlobalStyleComponent } from 'styled-components'
import PoppinsThin from '../assets/fonts/Poppins-Thin.ttf'
import PoppinsExtraLight from '../assets/fonts/Poppins-ExtraLight.ttf'
import PoppinsLight from '../assets/fonts/Poppins-Light.ttf'
import PoppinsRegular from '../assets/fonts/Poppins-Regular.ttf'
import PoppinsMedium from '../assets/fonts/Poppins-Medium.ttf'
import PoppinsSemiBold from '../assets/fonts/Poppins-SemiBold.ttf'
import PoppinsBold from '../assets/fonts/Poppins-Bold.ttf'
import PoppinsExtraBold from '../assets/fonts/Poppins-ExtraBold.ttf'
import PoppinsBlack from '../assets/fonts/Poppins-Black.ttf'

const GlobalStyle: any = createGlobalStyle`

  :focus {
    outline: 0;
  }

  @font-face {
    font-family: Poppins;
    src: url(${PoppinsThin});
    font-weight: 100;
  }
  @font-face {
    font-family: Poppins;
    src:url(${PoppinsExtraLight});
    font-weight: 200;
  }
  @font-face {
    font-family: Poppins;
    src: url(${PoppinsLight});
    font-weight: 300;
  }
  @font-face {
    font-family: Poppins;
    src: url(${PoppinsRegular});
    font-weight: 400;
  }
  @font-face {
    font-family: Poppins;
    src: url(${PoppinsMedium});
    font-weight: 500;
  }
  @font-face {
    font-family: Poppins;
    src: url(${PoppinsSemiBold});
    font-weight: 600;
  }
  @font-face {
    font-family: Poppins;
    src: url(${PoppinsBold});
    font-weight: 700;
  }
  @font-face {
    font-family: Poppins;
    src: url(${PoppinsExtraBold});
    font-weight: 800;
  }
  @font-face {
    font-family: Poppins;
    src: url(${PoppinsBlack});
    font-weight: 900;
  }

  * {
    margin: 0;
    font-family: Poppins;
    font-weight:300;
  }
  
  .tablet-menu-list{
    &:not(:last-child){
        margin-right: 2vw;
    }
  }
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

export const FadeIn = styled.div`
  animation: fadeIn 1s;
`

export default GlobalStyle;