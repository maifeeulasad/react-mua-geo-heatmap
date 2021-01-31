import React from 'react';

class GeoHeatmap extends React.Component{

    state={
        canvas: null,
        canvasContext: null,
        data: [
            [100,40,25],
            [100,50,25],
            [3,5,10],
            [200,175,25],
            [200,190,15],
            [200,200,25]
        ]
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

    drawData = () => {
        for (let i = 0; i < this.state.data.length; i++) {
            let p = this.state.data[i];
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
            gradient.data[i] = val/4/255/255;
            gradient.data[i+1] = 0;
            gradient.data[i+2] = 0;
            //gradient.data[i+3] = 255;
        }
        return gradient;
    }

    render(){
        return(
            <canvas
                ref={this.setCanvas}
                width={this.props.width | window.innerWidth}
                height={this.props.height | window.innerHeight}/>
        )
    }

}

export default GeoHeatmap;