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
        let indexFloor = Math.floor(indexFloat);
        let indexCeil = Math.ceil(indexFloat);
        if(indexFloor<0){
            indexFloor = 0;
        }else if(indexFloor>=this.state.heatSequenceColors.length){
            indexFloor = this.state.heatSequenceColors.length-1;
        }
        if(indexCeil<0){
            indexCeil = 0;
        }else if(indexCeil>=this.state.heatSequenceColors.length){
            indexCeil = this.state.heatSequenceColors.length-1;
        }
        let ratio = indexFloat - indexFloor;
        return this.state.heatSequenceColors[indexFloor].map((c,i)=>{
            let weightedAvg = (c*ratio+this.state.heatSequenceColors[indexCeil][i]*(1-ratio))/2;
            return parseInt(Math.round(weightedAvg).toString());
        })
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
            .getImageData(0, 0, this.props.width, this.props.height)
        gradient = this.colorData(gradient)
        this.state.canvasContext.putImageData(gradient, 0, 0,0,0,this.props.width, this.props.height);
    }

    colorData = (gradient) => {
        console.log(gradient)
        for(let i=0;i<gradient.data.length;i+=4){
            let a = gradient.data[i+3];
            let color = this.getColor(a);
            gradient.data[i]=color[0];
            gradient.data[i+1]=color[1];
            gradient.data[i+2]=color[2];
        }
        console.log(gradient)
        return gradient;
    }

    render(){
        return(
            <canvas
                className={"background"}
                ref={this.setCanvas}
                width={this.props.width}
                height={this.props.height}/>
        )
    }

}

export default GeoHeatmap;