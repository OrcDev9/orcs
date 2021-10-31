const Title = ({text, size}) => {
   
const style = {fontFamily: '"Press Start 2P",cursive',
color: '#ff0',
textShadow: '3px 3px red'
}

return (

    <span style={style}>{text}</span>       
               
  );
};

export default Title;


