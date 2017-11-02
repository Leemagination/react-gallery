require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';



var imageDatas = require('json!../data/imageDatas.json');

function genImageURL(imageDatasArr) {
    //图片名转换图片路径
    for(var i = 0;i<imageDatasArr.length;i++){
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require( '../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
}

function getRangeRandom(low,high){
    return Math.ceil(Math.random()*(high - low) + low);
}

function get30DegRandom(){
   return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random()*30));
}

imageDatas = genImageURL(imageDatas);

class ImgFigure extends  React.Component{
    handleDragStart(e){
        e.preventDefault();
    }
    handleClick(e){
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }


        e.stopPropagation();
        e.preventDefault();
    }
    render(){
        var styleObj = {};

        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;

        }

        if(this.props.arrange.rotate){
            (['MozTransform','msTransform','WebkitTransform','transform']).forEach(function (value) {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11;
        }

        var imgFigureClassName = 'img-figure';
             imgFigureClassName += this.props.arrange.isInverse?' is-inverse':'';



        return (
          <figure className={imgFigureClassName}  style={styleObj} onClick={this.handleClick.bind(this)}>
              <img className="img-size"  src={this.props.data.imageURL}
                    alt={this.props.data.title}
                    onDragStart={this.handleDragStart.bind(this)}

              />
              <figcaption>
                  <h2 className="img-title">{this.props.data.title}</h2>
                  <div className="img-back" onClick={this.handleClick.bind(this)}>
                      <p>
                          {this.props.data.desc}
                      </p>
                  </div>
              </figcaption>
          </figure>
        );
    }
}

class ControllerUnit extends React.Component{
    handleClick(e){

        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }

        e.preventDefault();
        e.stopPropagation();
    }
    render(){
        var controllerUnitClassName = 'controller-unit';

        if(this.props.arrange.isCenter){
            controllerUnitClassName += ' is-center';
            if(this.props.arrange.isInverse){
                controllerUnitClassName += ' is-inverse';
            }
        }

        return (
            <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
        );
    }
}

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            xPosRange: {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            yPosRange: {
                x: [0, 0],
                topY: [0, 0]
            }
        };
        this.state = {
            imgsArrangeArr: [
             /*   {
                    pos: {
                        left: '0',
                        top: '0'
                    },
                    rotate:0,
                    isInverse:false,
                    isCenter:false
                }*/
            ]

        };
    }

    inverse(index){
   return function () {
        var imgsArrangeArr = this.state.imgsArrangeArr;

        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

        this.setState({
            imgsArrangeArr:imgsArrangeArr
        });
    };
}

    rearrange(centerIndex){
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            xPosRange = Constant.xPosRange,
            yPosRange = Constant.yPosRange,
            xPosRangeLeftSecX = xPosRange.leftSecX,
            xPosRangeRightSecX = xPosRange.rightSecX,
            xPosRangeY = xPosRange.y,
            yPosRangeTopY = yPosRange.topY,
            yPosRangeX = yPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random()*2),
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

            imgsArrangeCenterArr[0] ={
                pos: centerPos,
                rotate:0,
                isCenter:true
            };



            topImgSpliceIndex = Math.floor(Math.random()*(imgsArrangeArr.length - topImgNum));
            imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

            imgsArrangeTopArr.forEach((value,index)=>{
               imgsArrangeTopArr[index] = {
                   pos:{
                       top:getRangeRandom(yPosRangeTopY[0],yPosRangeTopY[1]),
                       left:getRangeRandom(yPosRangeX[0],yPosRangeX[1])
                   },
                   rotate:get30DegRandom(),
                   isCenter:false
               }
            });

            for(let i = 0,j = imgsArrangeArr.length,k = j/2;i < j; i++){
                let xPosRangeLORX = null;

                if( i < k){
                    xPosRangeLORX = xPosRangeLeftSecX;
                }else{
                    xPosRangeLORX = xPosRangeRightSecX;
                }

                imgsArrangeArr[i] = {
                    pos:{
                        top:getRangeRandom(xPosRangeY[0],xPosRangeY[1]),
                        left:getRangeRandom(xPosRangeLORX[0],xPosRangeLORX[1])
                    },
                    rotate:get30DegRandom(),
                    isCenter:false
                };
            }


            if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
            }

            imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

            this.setState({
                imgsArrangeArr:imgsArrangeArr
            });
        /*!!!!!!!!!!!!!!!!!!!!!!!!!*/

}
    
    center(index){
        return function () {
            this.rearrange(index);
        };
    }

  componentDidMount(){
    let stageDom =ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW/2),
        halfStageH = Math.ceil(stageH/2);

    let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
         imgW = imgFigureDom.scrollWidth,
         imgH = imgFigureDom.scrollHeight,
         halfImgW = Math.ceil(imgW/2),
         halfImgH = Math.ceil(imgH/2);

      this.Constant.centerPos = {
          left: halfStageW - halfImgW,
          top: halfStageH - imgH
      };

      this.Constant.xPosRange.leftSecX[0] = -halfImgW;
      this.Constant.xPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
      this.Constant.xPosRange.rightSecX[0] = halfStageW + halfImgW;
      this.Constant.xPosRange.rightSecX[1] = stageW - halfImgW;
      this.Constant.xPosRange.y[0] = -halfImgH;
      this.Constant.xPosRange.y[1] = stageH - halfImgH;

      this.Constant.yPosRange.topY[0] = -halfImgH;
      this.Constant.yPosRange.topY[1] = halfStageH - halfImgH * 7;
      this.Constant.yPosRange.x[0] = halfStageW - imgW;
      this.Constant.yPosRange.x[1] = halfStageW;

      this.rearrange(0);
  }
  render() {
      var controllerUnits = [],
          imgFigures = [];
      imageDatas.forEach( (value,index)=>{

           if(!this.state.imgsArrangeArr[index]){
               this.state.imgsArrangeArr[index] ={
                   pos:{
                       left:0,
                       top:0
                   },
                   rotate:0,
                   isInverse:false,
                   isCenter:false
               };
           }
              imgFigures.push(<ImgFigure
                  data={value}
                  key={index}
                  ref={'imgFigure' + index}
                  arrange={this.state.imgsArrangeArr[index]}
                  inverse={this.inverse(index).bind(this)}
                  center={this.center(index).bind(this)}
              />);
                controllerUnits.push(<ControllerUnit
                arrange={this.state.imgsArrangeArr[index]}
                key={index}
                inverse={this.inverse(index).bind(this)}
                center={this.center(index).bind(this)}
                />);
      });
    
    return (
        <section className="stage" ref="stage">
            <section className="img-sec">
                {imgFigures}
            </section>
            <nav className="controller-nav">
                {controllerUnits}
            </nav>
        </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
