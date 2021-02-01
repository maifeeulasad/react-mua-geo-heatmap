import React from 'react';

class GeoHeatmap extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            canvas: null,
            canvasContext: null,
            heatSequenceColors: [
                [0,0,255],[0,255,0],[255,0,0]
            ]
        }
    }

    setCanvas = (elem) => {
        this.setState({
            canvas: elem,
            canvasContext: elem.getContext('2d')
        },()=>this.drawData())
    }

    componentDidMount() {
        //this.drawData();
    }

    getColor = (input) => {
        let indexFloat = (this.state.heatSequenceColors.length*input)/255;
        let index=parseInt(indexFloat.toString())
        if(index<0){
            index = 0;
        }else if(index>=this.state.heatSequenceColors.length){
            index = this.state.heatSequenceColors.length-1;
        }
        return this.state.heatSequenceColors[index];
    }

    drawData = () => {
        for (let i = 0; i < this.props.data.length; i++) {
            let p = this.props.data[i];
            this.state.canvasContext.beginPath();
            let color = 'rgba(0,0,0,255)';
            let gradient
                = this
                .state
                .canvasContext
                .createRadialGradient(0, 0, p[2] / 5, 0, 0, p[2]);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'rgba(255,255,255,0)');

            this.state.canvasContext.fillStyle = gradient;

            this.state.canvasContext.setTransform(1, 0, 0, 1, p[0], p[1]);
            this.state.canvasContext.beginPath();
            this
                .state
                .canvasContext
                .arc(0, 0, p[2], 0, 2 * Math.PI, false);
            this.state.canvasContext.fill();
        }
        let gradient = this
            .state
            .canvasContext
            .getImageData(0, 0, this.props.width | window.innerWidth, this.props.height | window.innerHeight)
        gradient = this.colorData(gradient)
        this.state.canvasContext.putImageData(gradient, 0, 0,0,0,this.props.width | window.innerWidth, this.props.height | window.innerHeight);
    }

    colorData = (gradient) => {
        console.log(gradient)
        for(let i=0;i<gradient.data.length;i+=4){
            let r = gradient.data[i];
            let g = gradient.data[i+1];
            let b = gradient.data[i+2];
            let a = gradient.data[i+3];
            let val = r*r+g*g+b*b+a*a;
            gradient.data[i]=a;
            let color = this.getColor(a);
            //console.log(color)
            gradient.data[i]=color[0];
            gradient.data[i+1]=color[1];
            gradient.data[i+2]=color[2];
            /*
            if(a>127){
                gradient.data[i]=255;
            }else{
                gradient.data[i] = 0;
            }
             */
            //gradient.data[i+1]=0;
            //gradient.data[i+2]=0;
            //gradient.data[i] = val/4/255/255;
            //gradient.data[i+1] = 0;
            //gradient.data[i+2] = 0;
            //gradient.data[i+3] = 255;
        }
        return gradient;
    }

    render(){
        return(
            <canvas
                className={"background"}
                ref={this.setCanvas}
                width={this.props.width | window.innerWidth}
                height={this.props.height | window.innerHeight}/>
        )
    }

}

export default GeoHeatmap;