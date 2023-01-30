import React from "react";
import Slider from "react-slick";
import "./SimpleSlider.scss";



const SimpleSlider = ()=>{

    const settings = {
      // dots: true,
      infinite: true, 
      speed: 500,
      autoplay: true,
      autoplaySpeed: 2500,  // 넘어가는 속도
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '0px',  // 0px 하면 슬라이드 끝쪽 이미지가 안 잘림
    };
    
    return (
    	<Slider {...settings}>
                <img className="slider-img" src="asset/slide1.jpg" alt="slide1"/>
                <img className="slider-img" src="asset/slide2.jpg" alt="slide2"/>
                <img className="slider-img" src="asset/slide3.jpg" alt="slide3"/>
                <img className="slider-img" src="asset/slide4.jpg" alt="slide4"/>
                <img className="slider-img" src="asset/slide5.jpg" alt="slide5"/>
        </Slider>  
    );
}


export default SimpleSlider